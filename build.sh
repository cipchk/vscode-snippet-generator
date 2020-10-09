#!/usr/bin/env bash

set -u -e -o pipefail

PWD=`pwd`
DIST=${PWD}/dist
SRC=${PWD}/src

TEST=false
for ARG in "$@"; do
  case "$ARG" in
    -t)
      TEST=true
      ;;
  esac
done

rm -rf ${DIST}
rm -rf publish

VERSION=$(node -p "require('./package.json').version")

$(npm bin)/tsc

genNode() {
  mkdir -p publish/node/src
  rsync -a dist/src/generator/ publish/node/src
  cp config/schema.json publish/node/schema.json
  cp LICENSE publish/node/LICENSE
  cp src/generator/package.json publish/node/package.json
  cp README.md publish/node/README.md
}

genExtension() {
  mkdir -p publish/vscode-extension/src
  rsync -a dist/src/vscode-extension/ publish/vscode-extension/src
  cp LICENSE publish/node/LICENSE
  cp src/vscode-extension/package.json publish/vscode-extension/package.json
  cp README.md publish/vscode-extension/README.md
  cp icon.png publish/vscode-extension/icon.png
  # copy generator
  rsync -a dist/src/generator/ publish/vscode-extension/generator/
}

fixVersion() {
  cd publish
  perl -p -i -e "s/0\.0\.0\-PLACEHOLDER/${VERSION}/g" $(grep -ril 0\.0\.0\-PLACEHOLDER .) < /dev/null 2> /dev/null
  cd ..
}

genNode
genExtension
fixVersion

if [[ ${TEST} == true ]]; then
  cp -fr publish/node/* ../ng-zorro-vscode/node_modules/vscode-snippet-generator
fi
