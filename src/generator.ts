import chalk from 'chalk';
import * as fs from 'fs';
import klaw from 'klaw-sync';
import * as path from 'path';
import { ConfigSchema, DEFAULT_CONFIG, Snippet } from './interfaces';
import { parse } from './parse';

function genPrefix(first: string, relativePath: string, ingoreDefaultMd: boolean): string[] {
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
  if (ingoreDefaultMd && res.length > 1 && res.includes('default')) {
    res.pop();
  }
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
  const sourcePaths: Array<{ rootPath: string, fullPath: string }> = [];
  (typeof cog.sourceRoot === 'string' ? [cog.sourceRoot] : cog.sourceRoot)
    .map(p => path.resolve(process.cwd(), p))
    .filter(p => fs.existsSync(p))
    .forEach(rootPath => {
      klaw(
        rootPath,
        {
          nodir: true,
          traverseAll: true,
          filter: (item: klaw.Item) => item.path.endsWith('.md')
        } as any)
        .map(item => item.path)
        .forEach(fullPath => {
          sourcePaths.push({ rootPath, fullPath });
        });
    });

  const res: { [key: string]: Snippet } = {};
  sourcePaths.forEach(sourceItem => {
    const relativePath = path.relative(sourceItem.rootPath, sourceItem.fullPath);
    const md = fs.readFileSync(sourceItem.fullPath).toString('utf8');
    try {
      const item = parse(md, sourceItem.fullPath, cog);
      const keys = genPrefix(cog.prefix, relativePath, cog.ingoreDefaultMd);
      item.prefix = keys.join(cog.separator);
      res[keys.join('_')] = item;
    } catch (err) {
      console.log(`>> File ${relativePath} parse error: ${chalk.red(err)}`);
    }
  });

  const successCount = Object.keys(res).length;
  const errorCount = sourcePaths.length - successCount;
  if (errorCount > 0) {
    console.log(`Find ${sourcePaths.length} markdowns, Success ${chalk.green(successCount + '')}, Error ${chalk.red(errorCount + '')}`);
  } else {
    console.log(`🌈  Find ${chalk.green(sourcePaths.length + '')} markdowns, ${chalk.green('All Success')}`);
  }

  return cleanObject(res);
}
