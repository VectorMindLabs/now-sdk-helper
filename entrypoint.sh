#!/usr/bin/env bash

cd $HOME

export $(dbus-launch)
eval "$(echo 'now-sdk-helper-keyring-passwd' | gnome-keyring-daemon --unlock)"

echo "Now-SDK CI/CD Builder"
echo "Copyright (C) 2024-Present, VectorMind Labs."
echo ""

# Get Alias
account=$(cat /now/secret.json | jq -r .alias)

if [ "${account}" = "null" ]; then
	echo "[-] Invalid Secrets at /now/secret.json"
	echo "[-] Please make sure to mount your nowsdk-secret-export.json to /now/secret.json"
	exit -1
fi

if [ -z "${account}" ]; then
	echo "[-] Invalid Secrets at /now/secret.json"
	echo "[-] Please make sure to mount your nowsdk-secret-export.json to /now/secret.json"
	exit -1
fi

echo "[+] Found Now-SDK Account: ${account}"
echo "[+] Importing Secrets"
now-sdk-helper import -f /now/secret.json

echo ""
echo "[+] Listing SN Accounts"
now-sdk auth list

echo "[+] Setting ${account} as Default."
now-sdk auth set-default ${account}

if [ ! -f /now/app/package.json ]; then
    echo "[-] No Now-SDK App Found"
    echo "[*] Exiting"
    exit -1
fi

cd /now/app
appname=$(cat package.json | jq -r .name)
appversion=$(cat package.json | jq -r .version)

echo ""
echo "[+] Now-SDK App: ${appname}@${appversion}"
echo "[+] Installing Dependencies"
npm ci

echo "[+] Building ${appname}@${appversion}"
npm run build

if [[ -v DEPLOY ]]; then
	echo "[+] Deploying to Instance"
	npm run deploy
fi

echo "Finished Successfully!"
