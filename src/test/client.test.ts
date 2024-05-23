import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { getAnonClient } from '../App/utils/api/Client';

describe('client functionality', () => {
  test(`should be created anonymous client`, () => {
    const anonClient = getAnonClient();
    expect(anonClient).toBeInstanceOf(ByProjectKeyRequestBuilder);
  });
});
