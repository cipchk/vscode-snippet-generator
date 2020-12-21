import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { DEFAULT_CONFIG } from '../src/generator/interfaces';
import { parse } from '../src/generator/parse';

function getMd(name: string): string {
  const filePath = path.join(__dirname, '../examples', name);
  return fs.readFileSync(filePath).toString('utf8');
}

describe('parse', () => {
  it('should working', () => {
    const fileName = 'button.md';
    const res = parse(getMd(fileName), fileName, DEFAULT_CONFIG);
    expect(res.prefix).to.be.eq('button');
    expect(res.description).to.be.eq('按钮');
    expect(res.scope).to.be.eq('typescript,html');
    expect(res.body).to.be.contain('<button>');
  });
  it('should be use file name as the prefix', () => {
    const fileName = 'no-meta.md';
    const res = parse(getMd(fileName), `c:${path.sep}mock${path.sep}${fileName}`, DEFAULT_CONFIG);
    // expect(res.prefix).to.be.eq('no-meta');
    expect(res.body).to.be.eq('<button>$0<button>');
  });
  it('should be use first paragraph as the description', () => {
    const fileName = 'description-in-body.md';
    const res = parse(getMd(fileName), `c:${path.sep}mock${path.sep}${fileName}`, DEFAULT_CONFIG);
    // expect(res.prefix).to.be.eq('description-in-body');
    expect(res.description).to.be.eq('这是一个按钮');
    expect(res.body).to.be.eq('<button1>$0</button1>');
  });
  it('should throw error when not found code body', () => {
    expect(() => {
      const fileName = 'no-body.md';
      parse(getMd(fileName), fileName, DEFAULT_CONFIG);
    }).to.be.throw();
  });
  it('should be i18n', () => {
    const fileName = 'i18n.md';
    const resCN = parse(getMd(fileName), `c:${path.sep}mock${path.sep}${fileName}`, DEFAULT_CONFIG);
    expect(resCN.description).to.be.eq('按钮');
    const resEN = parse(getMd(fileName), `c:${path.sep}mock${path.sep}${fileName}`, { ...DEFAULT_CONFIG, i18n: 'en-US' });
    expect(resEN.description).to.be.eq('Button');
  });
  it('should be i18n template', () => {
    const fileName = 'i18n.md';
    const res = parse(getMd(fileName), `c:${path.sep}mock${path.sep}${fileName}`, {
      ...DEFAULT_CONFIG,
      i18n: 'en-US',
      i18nTpl: '{zh-CN}({en-US})',
    });
    expect(res.description).to.be.eq('按钮(Button)');
  });
  it('should be i18n codes', () => {
    const fileName = 'i18n-code.md';
    const resCN = parse(getMd(fileName), `c:${path.sep}mock${path.sep}${fileName}`, DEFAULT_CONFIG);
    expect(resCN.description).to.be.eq('按钮');
    expect(resCN.body).to.be.eq('<a>zh</a>');
    const resEN = parse(getMd(fileName), `c:${path.sep}mock${path.sep}${fileName}`, { ...DEFAULT_CONFIG, i18n: 'en-US' });
    expect(resEN.description).to.be.eq('Button');
    expect(resEN.body).to.be.eq('<a>en</a>');
  });
});
