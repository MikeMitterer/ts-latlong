#!/usr/bin/env bash
# shellcheck disable=SC2034

#------------------------------------------------------------------------------
# Config for updateDevTemplates.sh, created on Do 14 Sep 2023 16:01:03 CEST
# Project-Type: ts
#------------------------------------------------------------------------------

# Folder mit den Templates
# BASE_FOLDER="."
# BASE_FOLDER="${DEV_LOCAL}/Templates/Production"

# Names des Template-Folders
# TEMPLATE_FOLDER="TypeScript"

# Files die umbenannt werden müssen -------------------------------------------

# Files die gelöscht werden ---------------------------------------------------

# FILES_TO_REMOVE+=("jest-puppeteer.config.cjs")

# Files die kopiert werden -----------------------------------------------------

# Der "Key" ist das Source-File und der "Value" ist das Remote-File
# FILES_TO_COPY["static/config.lenovo.js"]="config.js"
# FILES_TO_COPY["static/config.lenovo.js"]=""

# Hängt von dem jeweiligen Projekt ab ob puppeteer benötigt wird oder nicht
# FILES_TO_COPY["jest-puppeteer.config.cjs"]="false"

# Scripts ---------------------------------------------------------------------

# Updates ---------------------------------------------------------------------


# Wird mit
#     echo "${GH_ORG_MM}" > .gitorg
#     echo "${GH_ORG_MOBIAD}" > .gitorg
#     echo "${GH_ORG_WZE}" > .gitorg
#     echo "${GH_ORG_MANGO_LILA}" > .gitorg
# erstellt.
# Default ist GH_ORG_MM
FILES_TO_UPDATE[".gitorg.mm"]=".gitorg"


