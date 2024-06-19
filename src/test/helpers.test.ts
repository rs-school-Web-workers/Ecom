import { centsToDollar } from '../App/utils/helpers';

describe('centsToDollar functionality', () => {
  test(`it should be equal`, () => {
    expect(centsToDollar(5500)).toBe('55.00');
  });

  test(`it should be equal`, () => {
    expect(centsToDollar(5510)).toBe('55.10');
  });

  test(`it should be equal`, () => {
    expect(centsToDollar(5501)).toBe('55.01');
  });

  test(`it should be equal`, () => {
    expect(centsToDollar(-5500)).toBe('-55.00');
  });

  test(`it should be equal`, () => {
    expect(centsToDollar(5500)).toBe('55.00');
  });

  test(`it should be equal`, () => {
    expect(centsToDollar(55)).toBe('0.55');
  });
});
