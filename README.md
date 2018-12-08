## vscode-snippet-generator

[![Build Status](https://img.shields.io/travis/cipchk/vscode-snippet-generator/master.svg?style=flat-square)](https://travis-ci.org/cipchk/vscode-snippet-generator)
[![Dependency Status](https://david-dm.org/cipchk/vscode-snippet-generator/status.svg?style=flat-square)](https://david-dm.org/cipchk/vscode-snippet-generator)
[![GitHub Release Date](https://img.shields.io/github/release-date/cipchk/vscode-snippet-generator.svg?style=flat-square)](https://github.com/cipchk/vscode-snippet-generator/releases)
[![NPM version](https://img.shields.io/npm/v/vscode-snippet-generator.svg?style=flat-square)](https://www.npmjs.com/package/vscode-snippet-generator)

Generate a snippet extensions for vscode.

## Quick start

```sh
$ npm i -g vscode-snippet-generator
$ git clone --depth 1 https://github.com/cipchk/vscode-snippet-generator-tpl.git
$ cd vscode-snippet-generator-tpl
$ # build type 1
$ vscode-snippet-generator
$ # build type 2
$ npm run release
$ # package vscode extension
$ npm run release
```

## Cli Options

```sh
vscode-snippet-generator --help
```

## Snippet tempalte

Markdown file symbol of a specify snippet, like this:

```markdown
---
prefix: button
description: 按钮
scope: typescript,html
---

```html
<button${1: type="${2|text,tel|}"}>
  $0
<button>```
```

- `prefix` defines how this snippet is selected from IntelliSense and tab completion. In this case `button`.
- `description` is the description used in the IntelliSense drop down.
- markdown body is defines snippet code, muse be hava a code tag.

> How to writing snippet code, pls refre to [vscode-Creating your own snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

## License

The MIT License (see the [LICENSE](https://github.com/cipchk/vscode-snippet-generator/blob/master/LICENSE) file for the full text)
