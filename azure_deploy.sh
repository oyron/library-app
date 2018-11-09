#!/bin/bash

set -e

az account set --subscription "VanDamme"
az webapp create --resource-group DataPlatformOYRONRGDev --plan LibrarySP --name library-web --runtime "NODE|10.1" --deployment-local-git
git remote add azure https://oyron@library-web.scm.azurewebsites.net:443/library-web.git
git push azure master