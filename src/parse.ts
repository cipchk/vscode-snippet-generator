import markdownit from 'markdown-it';
const yamlFront = require('yaml-front-matter');
import { Snippet } from './interfaces';

const it = new markdownit({});

export function parse(md: string, fileName: string = ''): Snippet {
  const meta: Snippet = yamlFront.loadFront(md);
  const tokens = it.parse(meta.__content.toString() || '', {});
  delete meta.__content;
  const codeToken = tokens.find(w => w.tag === 'code');
  if (!codeToken) {
    throw new Error(`Must have a code body`);
  }
  meta.body = codeToken.content.trim();
  return meta;
}