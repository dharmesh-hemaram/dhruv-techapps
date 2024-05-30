#!/bin/bash
az storage blob upload-batch --account-name autoclickerautofilla579 --destination acf-i18n --source ./locales --pattern "**/web-new.json" --auth-mode login --overwrite
