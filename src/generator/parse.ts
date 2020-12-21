import markdownit from 'markdown-it';
const yamlFront = require('yaml-front-matter');
// import * as path from 'path';
import { ConfigSchema, DEFAULT_LANG, Snippet } from './interfaces';

const it = new markdownit({});

function isUndefined(meta: Snippet, key: string): boolean {
  return meta[key] != null;
}

function genDescriptionAndCode(tokens: any[]): { description: string; body: string } {
  // description
  let description = '';
  const paragraphOpenTokenIndex = tokens.findIndex((w) => w.type === 'paragraph_open');
  if (paragraphOpenTokenIndex !== -1 && tokens.length >= paragraphOpenTokenIndex + 1) {
    const paragraphToken = tokens[paragraphOpenTokenIndex + 1];
    description = paragraphToken.content.trim();
  }
  // body
  let body = '';
  const codeToken = tokens.find((w) => w.tag === 'code');
  if (codeToken != null) {
    body = codeToken.content.trim();
  }
  return { description, body };
}

function fixPrefix(meta: Snippet, fileName: string): string | null {
  if (isUndefined(meta, 'prefix')) {
    return meta.prefix;
  }
  return null;
  // const name = fileName.split(path.sep).pop() as string;
  // return name.endsWith('.md') ? name.substr(0, name.length - 3) : name;
}

function fixDescription(tokens: any[], meta: Snippet, config: ConfigSchema) {
  if (!isUndefined(meta, 'description')) {
    meta.description = genDescriptionAndCode(tokens).description;
  } else if (typeof meta.description === 'object') {
    const source = meta.description as { [key: string]: string };
    if (typeof config.i18nTpl === 'string' && config.i18nTpl.length > 0) {
      meta.description = config.i18nTpl.replace(/\{([^}]+)\}/g, (word, lang) => {
        return source[lang] || source[DEFAULT_LANG];
      });
    } else {
      meta.description = source[config.i18n] || source[DEFAULT_LANG];
    }
  }
}

function fixBody(tokens: any[], meta: Snippet, config: ConfigSchema): any {
  const codeToken = tokens.find((w) => w.tag === 'code');
  if (!codeToken) {
    throw new Error(`Must have a code body`);
  }

  const headingTokenPos = tokens
    .map((w, index) => (w.type === 'heading_open' && (w.tag === 'h1' || w.tag === 'h2') ? index : -1))
    .filter((idx) => idx !== -1)
    .map((start) => {
      const end = tokens.slice(start).findIndex((w) => w.tag === 'code');
      return { start, end: start + end + 1 };
    });

  if (headingTokenPos.length === 0) {
    meta.body = codeToken.content.trim();
    return;
  }

  for (const pos of headingTokenPos) {
    if (tokens[pos.start + 1].content.trim() !== config.i18n) {
      continue;
    }
    const { body, description } = genDescriptionAndCode(tokens.slice(pos.start, pos.end));
    meta.body = body;
    meta.description = description;
    break;
  }
}

export function parse(md: string, fileName: string, config: ConfigSchema): Snippet {
  const meta: Snippet = yamlFront.loadFront(md);
  const tokens = it.parse(meta.__content.toString(), {});
  delete meta.__content;
  fixBody(tokens, meta, config);
  if (typeof meta.description === 'object' || !isUndefined(meta, 'description')) {
    fixDescription(tokens, meta, config);
  }
  meta.prefix = fixPrefix(meta, fileName);
  return meta;
}
