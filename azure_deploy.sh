#!/bin/bash

set -e

az account set --subscription "VanDamme"
az appservice plan create --name LibraryWebSP --resource-group DataPlatformOYRONRGDev --sku B1 --is-linux --location "North Europe"
az webapp create --resource-group DataPlatformOYRONRGDev --plan LibraryWebSP --name library-web --runtime "NODE|10.10" --deployment-local-git
git remote add azure https://oyron@library-web.scm.azurewebsites.net:443/library-web.git
git push azure master
az ad app create --display-name library-web --homepage https://library-web.azurewebsites.net --identifier-uris https://www.equinor.com/library-web