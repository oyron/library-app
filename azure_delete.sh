#!/usr/bin/env bash

set -e

az account set --subscription "VanDamme"
az webapp delete --name library-web --resource-group DataPlatformOYRONRGDev
