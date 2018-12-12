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
    vscode-snippet-generator --outFile file.json

  Options
    --sourceRoot      Source file root directory, default: ${DEFAULT_CONFIG.sourceRoot}

    --outFile         Output file path, default: ${DEFAULT_CONFIG.outFile}

    --prefix          Unified prefix

    --separator       Multi-level directory separator, default: ${DEFAULT_CONFIG.separator}

    --i18n            Specify the language key name to generate, default: ${DEFAULT_CONFIG.i18n}

    --config          A filepath of your config script
                      Example of a config script: https://github.com/cipchk/vscode-snippet-generator-tpl/blob/master/snippet-config.json
  `,
  flags: {
    sourceRoot: {
      type: 'string',
      default: DEFAULT_CONFIG.sourceRoot
    },
    outFile: {
      type: 'string',
      default: DEFAULT_CONFIG.outFile,
    },
    prefix: {
      type: 'string'
    },
    separator: {
      type: 'string',
      default: DEFAULT_CONFIG.separator
    },
    i18n: {
      type: 'string',
      default: DEFAULT_CONFIG.i18n
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
  ...configInFile,
  ...cli.flags
} as ConfigSchema;

const res = generator(options);
const content = JSON.stringify(res, null, 2);
const saveFile = path.resolve(process.cwd(), options.outFile);
if (fs.existsSync(saveFile)) {
  fs.unlinkSync(saveFile);
}
fs.writeFileSync(saveFile, content);
