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
  it('should array in sourceRoot', () => {
    const res = generator({ ...DEFAULT, sourceRoot: ['examples/property', 'examples/ts'] });
    expect(res.ng).not.to.eq(undefined);
    expect(res.placeholder).not.to.eq(undefined);
  });
  it('should be ingore default name', () => {
    const res = generator({ ...DEFAULT });
    expect(res.default).not.to.eq(undefined);
    expect(res.property_default).to.eq(undefined);
    expect(res.property).not.to.eq(undefined);
  });
});