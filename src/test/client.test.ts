import {
  autoLoginCLient,
  destroyClient,
  getAnonClient,
  getCategorieById,
  getClient,
  getProductById,
  getUserProfile,
  isLogged,
  loginClient,
} from '../App/utils/api/Client';

describe('client functionality', () => {
  destroyClient();
  test(`getclient should work`, async () => {
    expect(getClient()).toBeNull();
  });
  test(`anon client should work`, async () => {
    expect((await getAnonClient().get().execute()).body.key).toBe('web-workers');
  });
  test(`getclient should work`, async () => {
    expect(getClient()).not.toBeNull();
  });
  test(`login client should work`, async () => {
    destroyClient();
    await loginClient('asd@asd.asd', 'ASDasdasd1');
    expect(getClient()).not.toBeNull();
    expect((await getClient()?.get().execute())?.body.key).toBe('web-workers');
  });
  test(`autologin client should work`, async () => {
    destroyClient();
    await loginClient('asd@asd.asd', 'ASDasdasd1');
    autoLoginCLient();
    expect(getClient()).not.toBeNull();
  });
  test(`isLogged should work`, async () => {
    expect(isLogged()).toBe(true);
  });
  test(`getProductById should work`, async () => {
    expect((await getProductById('1aee5a92-16b0-4d09-a317-7b7043bb49be')).body.masterData.current.name['en-US']).toBe(
      'Sterling Silk Blazer'
    );
  });
  test(`getCategoryById should work`, async () => {
    expect((await getCategorieById('f56ec474-3dc5-428d-83c6-e92c16f4a342')).body.name['en-US']).toBe('Casual');
  });
  test(`getUserProfile should work`, async () => {
    expect((await getUserProfile()).body.firstName).toBe('asd');
  });
});
