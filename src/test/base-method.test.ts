import { IsUndefinedType, isNull } from '../App/utils/base-methods';

describe('base-method functionality', () => {
  test(`it shouldn't throw error`, () => {
    expect(() => IsUndefinedType(undefined)).toThrow('Element is undefined');
  });

  test(`it shouldn't throw error`, () => {
    expect(() => isNull(null)).toThrow('Element is null');
  });
});
