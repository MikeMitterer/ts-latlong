#!/usr/bin/env bash
#------------------------------------------------------------------------------
# Config for updateDevTemplates.sh, created on Do 14 Sep 2023 15:12:16 CEST
# Project-Type: ts
#------------------------------------------------------------------------------

# Folder mit den Templates
# BASE_FOLDER="."
# BASE_FOLDER="${DEV_LOCAL}/Templates/Production"

# Names des Template-Folders
TEMPLATE_FOLDER="TypeScript"

# Der "Key" ist das Source-File und der "Value" ist das Remote-File
# FILES_TO_COPY["static/config.lenovo.js"]="config.js"
# FILES_TO_COPY["static/config.lenovo.js"]=""

FILES_TO_COPY[".browserslistrc"]=""
FILES_TO_COPY[".eslintrc.cjs"]=""
FILES_TO_COPY[".npmignore"]=""
FILES_TO_COPY[".gitignore"]=""

FILES_TO_COPY["babel.config.js"]=""
FILES_TO_COPY["postcss.config.js"]=""
FILES_TO_COPY["prettier.config.js"]=""

FILES_TO_COPY["jest.config.lib.js"]="jest.config.js"

FILES_TO_COPY["tsconfig.json"]=""
FILES_TO_COPY["tsconfig.lib.json"]=""

FILES_TO_COPY["webpack.node.js"]=""
FILES_TO_COPY["webpack.ts.js"]=""
FILES_TO_COPY["webpack.web.js"]=""

# Hängt von dem jeweiligen Projekt ab ob puppeteer benötigt wird oder nicht
# FILES_TO_COPY["jest-puppeteer.config.js"]=""

# Einfacher Installer für einige der Standard-Packages
FILES_TO_COPY["setup/install.default.packages.sh"]="install.default.packages.sh"
# FILES_TO_COPY["setup/install.puppeteer.packages.sh"]="install.puppeteer.packages.sh"

# ------------------------------------------------------------
# Updates

# Die Files werden nur kopiert wenn sie noch nicht existieren
FILES_TO_UPDATE["webpack.web.local.js"]=""

FILES_TO_UPDATE["jest.setup.js"]="tests/jest.setup.js"

# Wird mit
#     echo "${GH_ORG_MM}" > .gitorg
#     echo "${GH_ORG_MOBIAD}" > .gitorg
#     echo "${GH_ORG_WZE}" > .gitorg
#     echo "${GH_ORG_MANGO_LILA}" > .gitorg
# erstellt.
# Default ist GH_ORG_MM
FILES_TO_UPDATE[".gitorg.mobiad"]=".gitorg"


