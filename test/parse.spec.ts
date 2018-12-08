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
    const res = parse(getMd('button.md'));
    expect(res.name).to.be.eq('test name');
    expect(res.prefix).to.be.eq('button');
    expect(res.description).to.be.eq('按钮');
    expect(res.scope).to.be.eq('typescript,html');
    expect(res.body).to.be.contain('<button>');
  });
  it('should throw error when not found code body', () => {
    expect(() => {
      parse(getMd('no-body.md'));
    }).to.be.throw();
  });
});