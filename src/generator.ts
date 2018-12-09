import chalk from 'chalk';
import * as fs from 'fs';
import klaw from 'klaw-sync';
import * as path from 'path';
import { ConfigSchema, DEFAULT_CONFIG, Snippet } from './interfaces';
import { parse } from './parse';

function genPrefix(first: string, relativePath: string): string[] {
  const res: string[] = [];
  if (typeof first === 'string' && first.length > 0) {
    res.push(first);
  }
  res.push(
    ...relativePath
      .split(path.sep)
      .filter(w => w.length > 0)
      .map(w => w.endsWith('.md') ? w.substr(0, w.length - 3) : w)
      .filter(w => w.length > 0)
  );
  return res;
}

function cleanObject(obj: { [key: string]: Snippet }) {
  const res: { [key: string]: Snippet } = {};
  Object.keys(obj).forEach(key => {
    const { prefix, body, description, scope } = obj[key];
    res[key] = {
      prefix, body, description, scope
    } as Snippet;
  });
  return res;
}

export function generator(config?: ConfigSchema) {
  const cog = {
    ...DEFAULT_CONFIG,
    ...config
  } as ConfigSchema;
  const sourceRoot = path.resolve(process.cwd(), cog.sourceRoot);
  const allPaths = klaw(
    sourceRoot,
    {
      nodir: true,
      traverseAll: true,
      filter: (item: klaw.Item) => item.path.endsWith('.md')
    } as any)
    .map(item => item.path);

  const res: { [key: string]: Snippet } = {};
  allPaths.forEach(filePath => {
    const relativePath = path.relative(sourceRoot, filePath);
    const md = fs.readFileSync(filePath).toString('utf8');
    try {
      const item = parse(md, filePath);
      const keys = genPrefix(cog.prefix, relativePath);
      item.prefix = keys.join(cog.separator);
      res[keys.join('_')] = item;
    } catch (err) {
      console.log(`>> File ${relativePath} parse error: ${chalk.red(err)}`);
    }
  });

  const successCount = Object.keys(res).length;
  console.log(`Find ${allPaths.length} markdowns, Success ${chalk.green(successCount + '')}, Error ${chalk.red((allPaths.length - successCount) + '')}`);

  return cleanObject(res);
}
