#!/usr/bin/env bash
## ---------------------------------------------------------------------------#
# Einträge bei package.json und webpack.*.js auf .cjs umstellen
# -------------------------------------------------------------------------- ##

sed -i ".bak" -e 's/webpack.web.local.js/webpack.web.local.cjs/g' webpack.web.cjs
sed -i ".bak" -e 's/webpack.web.js/webpack.web.cjs/g' package.json
sed -i ".bak" -e 's/webpack.ts.js/webpack.ts.cjs/g' package.json
sed -i ".bak" -e 's/webpack.node.js/webpack.node.cjs/g' package.json

echo
echo -e ' - "type": "module", bei package.json einfügen'
echo -e ' - yarn build && yarn tc && yarn test && yarn start'
echo
echo "Fertig!"