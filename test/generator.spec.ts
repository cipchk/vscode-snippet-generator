import { expect } from 'chai';
import { generator } from '../src/generator';
import { DEFAULT_CONFIG } from '../src/interfaces';

const DEFAULT = {
  ...DEFAULT_CONFIG,
  sourceRoot: 'examples'
};

describe('generator', () => {
  it('should working', () => {
    const res = generator({ ...DEFAULT });
    expect(Object.keys(res).length).to.greaterThan(0);
  });
});