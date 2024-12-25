# ServiceNow Now SDK Helper CLI

Helper CLI tool for ServiceNow Now SDK (Fluent) to help with CI/CD deployment 
and patches some usability bugs for GNU/Linux distros.

## Why?

ServiceNow's new procode tool, Now-SDK helps maintain instance from ACLs to Scoped Applications
with Javascript which is cool but this tool is really new and they don't support Linux really well. This is really
bad because most of the CI/CD runners are GNU/Linux and lack of support was a show stopper for us.

As a quick resolution, We built this tool to help others who face the same issue to deploy instance config
right from GNU/Linux CI/CD runner using Docker.

This helper cli also has some usability patches for GNU/Linux which we don't know where to submit these
patches to get it merged in the upstream (please feel free ping us if you find a link).

## How

TODO

## Disclaimer

We have no association or affiliation to ServiceNow Inc. This is purely community work. We do want to
disclose that we are ServiceNow Technology Partners who specializes in building procode ServiceNow applications
for enterprise customers.

This tool helps us deploy ServiceNow apps from CI/CD and maintain all instance config with Javascript which
is amazing.

## License

The MIT License.

Copyright (C) 2024-Present, VectorMind Labs.
Maintained by Antony J.R <antony@ibconsultants.net>
