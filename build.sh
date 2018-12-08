#!/usr/bin/env bash

set -u -e -o pipefail

$(npm bin)/tsc

cp LICENSE dist/LICENSE
cp package.json dist/package.json
cp README.md dist/README.md