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

## Important

If you are planning on using this tool, add this gitignore to your repo which you
will use this tool to avoid adding the secret export to git.

```
# Now-SDK Secret Exports
*-nowsdk-secret-export.json
```

## How

```
 npm i
 npx now-sdk # To use the patched now-sdk with fixes
 npx now-sdk-helper # To use additional help scripts for now-sdk for CI/CD
```

## Building and Deploying from CI/CD with Now-SDK

Before we begin you must create a nowsdk secret export json file and upload it to
your keyvault (in our case it was Azure Keyvault) then pull that file from your keyvault
and use it for deployment.

**IMPORTANT**: If you use OAuth, this is for most cases because every organization now has SSO. You should
first install ServiceNow IDE in your instance from the plugin manager.

Now you can login from your local machine with,
```
 npm i
 npx now-sdk auth save sn_prod_login --type oauth
 # If no browser is opened then copy the link in the terminal put it in
 # your browser and then copy the access token to the terminal back.
```

Let's export the secret now.

```
 npx now-sdk-helper export --account sn_prod_login
 # You should have a file named 'sn_prod_login-nowsdk-secret-export.json'
```

Now upload this secret export json file to your keyvault. And use it like this in your
linux CI/CD runner.

```
 docker run \
    -v $PWD:/now/app \
    -v sn_prod_login-nowsdk-secret-export.json:/now/secret.json \
    -it quay.io/vlpl/now-sdk-builder:latest
```

This will build your application and fail if the build fails.

Now to deploy you simply pass ```deploy``` to this command.


```
 docker run \
    -v $PWD:/now/app \
    -v sn_prod_login-nowsdk-secret-export.json:/now/secret.json \
    -it quay.io/vlpl/now-sdk-builder:latest deploy
```

## Disclaimer

We have no association or affiliation to ServiceNow Inc. This is purely community work. We do want to
disclose that we are ServiceNow Technology Partners who specializes in building procode ServiceNow applications
for enterprise customers.

This tool helps us deploy ServiceNow apps from CI/CD and maintain all instance config with Javascript which
is amazing.

## License

The MIT License.

Copyright (C) 2024-Present, VectorMind Labs.

Written by Antony J.R <antony@vectormindlabs.com>
