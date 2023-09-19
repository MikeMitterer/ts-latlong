#!/usr/bin/env bash
## ---------------------------------------------------------------------------#
# Installiert einige der Packages die bei jedem Projekt benötigt werden.
# -------------------------------------------------------------------------- ##

yarn add -D \
  @types/jest@^27.5.1 \
  @types/node@^20.5.7 \
  @babel/plugin-transform-runtime@^7.22.10 \
  babel-plugin-transform-inline-environment-variables@^0.4.3 \
  date-fns@2.23.0 \
  path-browserify  \
  crypto-browserify  \
  stream-browserify \
  buffer \
  @typescript-eslint/parser@^6.6.0  \
  @typescript-eslint/eslint-plugin@^6.6.0 \
  eslint@^8.48.0 \
  typescript \
  clean-terminal-webpack-plugin \

# Files die nicht mehr benötigt werden:
rm -f \
  tslint.json \
  .babelrc

# Script löscht sich selbst
rm -f ./install.default.packages.sh

echo
echo "Fertig!"
echo