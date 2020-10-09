## vscode-snippet-generator

[![Build Status](https://img.shields.io/travis/cipchk/vscode-snippet-generator/master.svg?style=flat-square)](https://travis-ci.org/cipchk/vscode-snippet-generator)
[![Dependency Status](https://david-dm.org/cipchk/vscode-snippet-generator/status.svg?style=flat-square)](https://david-dm.org/cipchk/vscode-snippet-generator)
[![NPM version](https://img.shields.io/npm/v/vscode-snippet-generator.svg?style=flat-square)](https://www.npmjs.com/package/vscode-snippet-generator)

Generate a snippet extensions for vscode.

## Usage VSCode extension

1. Install [Dynamic Custom Snippets](https://marketplace.visualstudio.com/items?itemName=cipchk.vscode-snippet-generator) extension.
2. Add snippet files into `.vscode/snippets/` folder. (Please refer to the template content [Snippet tempalte](#Snippet-tempalte))
3. The first time create the `.vscode/snippets/` folder, need to restart vscode; otherwise you only need to trigger the `vscode-snippet-generator: Cache all dynamic snippets` command again.

Happy coding!!!

> Snippet tempalte
> You can configure `"vscode-snippet-generator.prefix": ""` in `settings.json` to change the prefix.
> You can configuae `"vscode-snippet-generator.languages": ["html", "typescript"]` in `settings.json` to support language list.

## Usage Command Line: Quick start

```sh
$ git clone --depth 1 https://github.com/cipchk/vscode-snippet-generator-tpl.git
$ cd vscode-snippet-generator-tpl
$ # build
$ npm run build
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
- `scope` Restrict template scope, if not specified, it means no restriction. In this case `typescript` and `html` document.
- markdown body is defines snippet code, muse be hava a code tag.

> How to writing snippet code, pls refre to [vscode-Creating your own snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

## I18n

The `description` support i18n, like this:

```markdown
---
prefix: button
description:
  zh-CN: 按钮
  en-US: Button
---
```

Specify language version to generate with `i18n` parameter.

```bash
vscode-snippet-generator --i18n=zh-CN --outFile=snippets-zh-CN.json
vscode-snippet-generator --i18n=en-US --outFile=snippets-en-US.json
```

If you want to display multiple languages in a snippet extension, you can use `i18nTpl`.

```bash
# window
vscode-snippet-generator --i18nTpl=\"{zh-CN}({en-US})\"
```

## License

The MIT License (see the [LICENSE](https://github.com/cipchk/vscode-snippet-generator/blob/master/LICENSE) file for the full text)
