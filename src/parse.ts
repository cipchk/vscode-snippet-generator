import markdownit from 'markdown-it';
const yamlFront = require('yaml-front-matter');
import * as path from 'path';
import { Snippet } from './interfaces';

const it = new markdownit({});

function isUndefined(meta: Snippet, key: string): boolean {
  return meta[key] != null && meta[key].length > 0;
}

function fixPrefix(meta: Snippet, fileName: string) {
  if (isUndefined(meta, 'prefix')) {
    return meta.prefix;
  }
  const name = fileName.split(path.sep).pop() as string;
  return name.endsWith('.md') ? name.substr(0, name.length - 3) : name;
}

export function parse(md: string, fileName: string): Snippet {
  const meta: Snippet = yamlFront.loadFront(md);
  const tokens = it.parse(meta.__content.toString() || '', {});
  delete meta.__content;
  const codeToken = tokens.find(w => w.tag === 'code');
  if (!codeToken) {
    throw new Error(`Must have a code body`);
  }
  // fix description
  if (!isUndefined(meta, 'description')) {
    const paragraphOpenTokenIndex = tokens.findIndex(w => w.type === 'paragraph_open');
    if (paragraphOpenTokenIndex !== -1 && tokens.length >= (paragraphOpenTokenIndex + 1)) {
      const paragraphToken = tokens[paragraphOpenTokenIndex + 1];
      meta.description = paragraphToken.content.trim();
    }
  }
  meta.prefix = fixPrefix(meta, fileName);
  meta.body = codeToken.content.trim();
  return meta;
}