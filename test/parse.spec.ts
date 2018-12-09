import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from '../src/parse';

function getMd(name: string): string {
  const filePath = path.join(__dirname, '../examples', name);
  return fs.readFileSync(filePath).toString('utf8');
}

describe('parse', () => {
  it('should working', () => {
    const fileName = 'button.md';
    const res = parse(getMd(fileName), fileName);
    expect(res.prefix).to.be.eq('button');
    expect(res.description).to.be.eq('按钮');
    expect(res.scope).to.be.eq('typescript,html');
    expect(res.body).to.be.contain('<button>');
  });
  it('should be use file name as the prefix', () => {
    const fileName = 'no-meta.md';
    const res = parse(getMd(fileName), `c:${path.sep}mock${path.sep}${fileName}`);
    expect(res.prefix).to.be.eq('no-meta');
    expect(res.body).to.be.eq('<button>$0<button>');
  });
  it('should be use first paragraph as the description', () => {
    const fileName = 'description-in-body.md';
    const res = parse(getMd(fileName), `c:${path.sep}mock${path.sep}${fileName}`);
    expect(res.prefix).to.be.eq('description-in-body');
    expect(res.description).to.be.eq('这是一个按钮');
    expect(res.body).to.be.eq('<button1>$0</button1>');
  });
  it('should throw error when not found code body', () => {
    expect(() => {
      const fileName = 'no-body.md';
      parse(getMd(fileName), fileName);
    }).to.be.throw();
  });
});