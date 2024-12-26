#!/usr/bin/env node

import Yargs from "yargs";
import keytar from "keytar";
import chalk from "chalk";

import path from "path";
import { readFile, readFileSync, writeFile } from "fs";

import { print } from "@/utils";
import { NOW_SDK_KEYCHAIN_ALIAS } from "@/constants";

print(
  `${chalk.bold("Now-SDK Helper")}, CLI Tool to Help with ${chalk.green("Now-SDK")} Quirks.`,
);
print(chalk.magentaBright("Copyright (C) 2024-Present, VectorMind Labs."));
print(chalk.magentaBright("Written by Antony J.R <antony@vectormindlabs.com>"));
print("");

Yargs.scriptName("now-sdk-helper")
  .command(
    "export",
    "Export Now-SDK Authentication State",
    (args) => {
      return args
        .option("o", {
          alias: "output",
          describe: "Path to Output the Export File",
        })
        .option("a", {
          alias: "account",
          describe:
            "Account to Export, The string used in `now-sdk auth save <account>`",
        })
        .demandOption(
          ["account"],
          "Provide the Now-SDK Auth Account to Export",
        );
    },
    (argv) => {
      const raw_export_path = argv.output ? (argv.output as string) : "./";
      const export_path = raw_export_path.replace(
        new RegExp("\\" + path.sep, "g"),
        "/",
      );
      const sn_account = argv.account as string;
      const export_file = path.join(
        export_path,
        `${sn_account}-nowsdk-secret-export.json`,
      );

      keytar.getPassword(NOW_SDK_KEYCHAIN_ALIAS, sn_account).then((result) => {
        if (!result) {
          print(
            `${chalk.bgRed(chalk.bold(chalk.white("FATAL")))}: no account found for '${sn_account}'`,
          );
          return;
        }

        writeFile(export_file, result, "utf8", (err) => {
          if (err) {
            print(
              `${chalk.bgRed(chalk.bold(chalk.white("FATAL")))}: failed to write secret to '${export_file}'.`,
            );
            print(err);
            return;
          }

          print(
            chalk.greenBright(
              `Successfully Exported Now-SDK(${chalk.bold(sn_account)}) to ${chalk.bold(export_file)}`,
            ),
          );
        });
      });
    },
  )
  .command(
    "import",
    "Import Now-SDK Authentication State",
    (args) => {
      return args
        .option("f", {
          alias: "export-file",
          describe: "Path to Export File to Import",
        })
        .demandOption(
          ["export-file"],
          "Provide the Now-SDK Export File to Import",
        );
    },
    (argv) => {
      const export_file = argv.exportFile as string;

      readFile(export_file, "utf8", (err, data) => {
        if (err) {
          print(
            `${chalk.bgRed(chalk.bold(chalk.white("FATAL")))}: cannot read export file '${chalk.bold(export_file)}'.`,
          );
          print(err);
          return;
        }

        // When importing anything, we better make sure we don't
        // make it the default account just in case.
        // We can set the default account using the official now-sdk
        // anyways.

        try {
          let accountData = JSON.parse(data);
          accountData["isDefault"] = false;

          const sn_account = Object.hasOwn(accountData, "alias")
            ? (accountData["alias"] as string)
            : "UnknownAlias";

          print(`Importing Now-SDK Account: ${chalk.bold(sn_account)}`);

          keytar
            .setPassword(
              NOW_SDK_KEYCHAIN_ALIAS,
              sn_account,
              JSON.stringify(accountData),
            )
            .then(() => {
              print(
                chalk.greenBright(
                  `Imported Now-SDK Account (${chalk.bold(sn_account)}) Successfully!`,
                ),
              );
            });
        } catch (err) {
          print(
            `${chalk.bgRed(chalk.white(chalk.bold("FATAL")))}: cannot serialize export json.`,
          );
          print(err);
        }
      });
    },
  )

  .help()
  .showHelpOnFail(true)
  .demandCommand(1, "").argv;
