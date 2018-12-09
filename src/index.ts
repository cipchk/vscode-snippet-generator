#!/usr/bin/env node

import * as fs from 'fs';
import meow from 'meow';
import * as path from 'path';
import { generator } from './generator';
import { ConfigSchema, DEFAULT_CONFIG } from './interfaces';

const cli = meow({
  help: `
  Usage
    vscode-snippet-generator

  Example
    vscode-snippet-generator -i CHANGELOG.md --same-file

  Options
    --sourceRoot      Source file root directory, default: src

    --outFile         Output file path, default: snippets.json

    --prefix          Unified prefix

    --separator       Multi-level directory separator, default: -

    --config          A filepath of your config script
                      Example of a config script: https://github.com/cipchk/vscode-snippet-generator-tpl/blob/master/snippet-config.json
  `,
  flags: {
    sourceRoot: {
      type: 'string',
      default: 'src'
    },
    outFile: {
      type: 'string',
      default: 'snippets.json'
    },
    prefix: {
      type: 'string'
    },
    separator: {
      type: 'string',
      default: '-'
    },
    config: {
      type: 'string',
      default: 'snippet-config.json'
    }
  }
});

let configInFile;

try {
  const { config } = cli.flags;
  const configFile = path.resolve(process.cwd(), config);
  if (fs.existsSync(configFile)) {
    configInFile = require(configFile);
  }
} catch (err) {
  console.error('Invalid config file', err);
  process.exit(1);
}

const options = {
  ...DEFAULT_CONFIG,
  ...cli.flags,
  ...configInFile
} as ConfigSchema;

const res = generator(options);
const content = JSON.stringify(res, null, 2);
const saveFile = path.resolve(process.cwd(), options.outFile);
if (fs.existsSync(saveFile)) {
  fs.unlinkSync(saveFile);
}
fs.writeFileSync(saveFile, content);
