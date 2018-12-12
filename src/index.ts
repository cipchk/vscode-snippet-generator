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
    -s, --sourceRoot  Source file root directory, can be set "src" "src1,src2", default: ${DEFAULT_CONFIG.sourceRoot}

    -o, --outFile     Output file path, default: ${DEFAULT_CONFIG.outFile}

    -p, --prefix      Unified prefix

    --separator       Multi-level directory separator, default: ${DEFAULT_CONFIG.separator}

    --ingoreDefaultMd Whether to ignore "default.md" of the secondary directory, only keep directory name, default: ${DEFAULT_CONFIG.ingoreDefaultMd}

    --i18n            Specify the language key name to generate, default: ${DEFAULT_CONFIG.i18n}

    --config          A filepath of your config script
                      Example of a config script: https://github.com/cipchk/vscode-snippet-generator-tpl/blob/master/snippet-config.json
  `,
  flags: {
    sourceRoot: {
      type: 'string',
      default: DEFAULT_CONFIG.sourceRoot,
      alias: 's'
    },
    outFile: {
      type: 'string',
      default: DEFAULT_CONFIG.outFile,
      alias: 'o'
    },
    prefix: {
      type: 'string',
      alias: 'p'
    },
    separator: {
      type: 'string',
      default: DEFAULT_CONFIG.separator
    },
    ingoreDefaultMd: {
      type: 'boolean',
      default: DEFAULT_CONFIG.ingoreDefaultMd
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

const sourceRoot: string = options.sourceRoot.toString().trim();
if (sourceRoot.includes(',')) {
  options.sourceRoot = sourceRoot.split(',').map(p => p.trim());
}

generator(options);
