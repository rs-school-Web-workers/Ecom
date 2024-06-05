import { BaseAddress, ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder, TokenCache, TokenStore } from '@commercetools/sdk-client-v2';
import type { /* SearchQuery, */ SearchSorting } from '@commercetools/platform-sdk';
import type { QueryExpression, SearchQuery } from './types';

let inst: ByProjectKeyRequestBuilder | null = null;
const projectKey = process.env.PROJECT_KEY;
const region = process.env.REGION;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientScopes = process.env.CLIENT_SCOPES;
const scopes = clientScopes?.split(' ');

const projectKeyAnon = process.env.ANON_PROJECT_KEY;
const regionAnon = process.env.ANON_REGION;
const clientIdAnon = process.env.ANON_CLIENT_ID;
const clientSecretAnon = process.env.ANON_CLIENT_SECRET;
const clientScopesAnon = process.env.ANON_SCOPES;
const scopesAnon = clientScopesAnon?.split(' ');

class MyTokenCache implements TokenCache {
  myCaсhe: TokenStore = {
    token: '',
    expirationTime: 0,
  };

  set(newCache: TokenStore) {
    this.myCaсhe = newCache;
    localStorage.setItem('token', JSON.stringify(newCache));
  }

  get() {
    return this.myCaсhe;
  }
}

const token = new MyTokenCache();

export function getClient() {
  return inst;
}

export function getAnonClient() {
  if (!projectKeyAnon || !regionAnon || !clientIdAnon || !clientSecretAnon || !clientScopesAnon) {
    throw new Error('Env parameters are undefined');
  }
  if (inst !== null) {
    return inst;
  }
  const ctpClient = new ClientBuilder()
    .withAnonymousSessionFlow({
      host: `https://auth.${regionAnon}.gcp.commercetools.com`,
      projectKey: projectKeyAnon,
      credentials: {
        clientId: clientIdAnon,
        clientSecret: clientSecretAnon,
      },
      scopes: scopesAnon,
      fetch,
    })
    .withHttpMiddleware({
      host: `https://api.${regionAnon}.gcp.commercetools.com`,
      fetch,
    });
  inst = createApiBuilderFromCtpClient(ctpClient.build()).withProjectKey({ projectKey: projectKeyAnon });
  return inst;
}

export function autoLoginCLient() {
  if (!projectKey || !region || !clientId || !clientSecret || !clientScopes) {
    throw new Error('Env parameters are undefined');
  }
  if (!localStorage.getItem('token')) {
    throw new Error('no token is found in localstorage');
  }
  token.set(JSON.parse(localStorage.getItem('token')!));
  const ctpClient = new ClientBuilder()
    .withRefreshTokenFlow({
      host: `https://auth.${region}.gcp.commercetools.com`,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
      },
      refreshToken: token.myCaсhe.refreshToken!,
      tokenCache: token,
      fetch,
    })
    .withExistingTokenFlow(`Bearer ${token.get().token}`, { force: true })
    .withHttpMiddleware({
      host: `https://api.${region}.gcp.commercetools.com`,
      fetch,
    });
  inst = createApiBuilderFromCtpClient(ctpClient.build()).withProjectKey({ projectKey });
  inst
    .get()
    .execute()
    .catch(() => {
      destroyClient();
      getAnonClient();
    });
  return inst;
}

/**
 * логинит пользователя
 * @param username email пользователя
 * @param password пароль
 * @returns ApiBuilder, который позволяет строить запрос на подобие
 * getApiRoot('asd@asd.asd', 'asd').me().orders().get().execute().catch(console.error);
 */
export async function loginClient(email: string, password: string) {
  if (!projectKey || !region || !clientId || !clientSecret || !clientScopes) {
    throw new Error('Env parameters are undefined');
  }
  await getAnonClient()
    .me()
    .login()
    .post({ body: { email, password } })
    .execute()
    .then(async () => {
      const ctpClient = new ClientBuilder()
        .withPasswordFlow({
          host: `https://auth.${region}.gcp.commercetools.com`,
          projectKey,
          credentials: {
            clientId,
            clientSecret,
            user: {
              username: email,
              password,
            },
          },
          tokenCache: token,
          scopes,
          fetch,
        })
        .withHttpMiddleware({
          host: `https://api.${region}.gcp.commercetools.com`,
          fetch,
        });

      inst = createApiBuilderFromCtpClient(ctpClient.build()).withProjectKey({ projectKey });
      await inst
        .get()
        .execute()
        .catch((err) => {
          inst = null;
          throw err;
        });
    })
    .catch((err) => {
      inst = null;
      throw err;
    });
  return inst;
}

/**
 * удаляет залогиненого пользователя
 */
export function destroyClient() {
  inst = null;
  token.set({
    token: '',
    expirationTime: 0,
  });
  localStorage.removeItem('token');
}

/**
 * проверка существования пользователя
 */
export function isLogged() {
  if (inst && token.get().token !== '') {
    return true;
  }
  return false;
}

/**
 * создание нового пользователя
 */
export async function signinClient(
  email: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  password: string,
  addresses: BaseAddress[],
  billingAddresses: number[],
  shippingAddresses: number[],
  defaultBillingAddress?: number,
  defaultShippingAddress?: number
) {
  if (!projectKey || !region || !clientId || !clientSecret || !clientScopes) {
    throw new Error('Env parameters are undefined');
  }
  await getAnonClient()
    .customers()
    .post({
      body: {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        addresses,
        billingAddresses,
        shippingAddresses,
        defaultBillingAddress,
        defaultShippingAddress,
      },
    })
    .execute()
    .then(async () => {
      await loginClient(email, password);
    })
    .catch((err) => {
      inst = null;
      throw err;
    });
  return inst;
}

export async function getProducts() {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  return await inst.products().get().execute();
}

export async function getProductById(id: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  return await inst.products().withId({ ID: id }).get().execute();
}

export async function getCategories() {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  return await inst.categories().get().execute();
}

export async function getCategorieById(id: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  return await inst.categories().withId({ ID: id }).get().execute();
}

/**
 * https://docs.commercetools.com/api/search-query-language#query-fields
 * exact	  Performs exact match on values of a specified field.
 * fullText Performs full-text search on a specified field.
 * prefix	  Searches for values starting with a specified prefix.
 * range	  Searches for values within a specified range.
 * wildcard Searches  for values with specified wildcards.
 * exists   Checks whether a specified field has a non-null value.
 * @param query
 * @param sort
 * @param limit сколько данных вернуть с сервера
 * @param offset смещение в общем массиве данных относительно начала
 * @returns
 */
export async function searchProducts(
  text: string,
  filter?: string[],
  sort?: string[],
  facet?: string[],
  limit: number = 0,
  offset?: number
) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  return await inst
    .productProjections()
    .search()
    .get({
      queryArgs: {
        'text.en': text,
        fuzzy: true,
        filter,
        sort,
        facet,
        limit,
        offset,
      },
    })
    .execute();
}

export async function getUserProfile() {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  return await inst.me().get().execute();
}

export async function passwordReset(version: number, currentPassword: string, newPassword: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  return await inst.me().password().post({ body: { version, currentPassword, newPassword } }).execute();
}

export async function changeUserProfile(
  version: number,
  firstName: string,
  lastName: string,
  email: string,
  dateOfBirth: string
) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  return await inst
    .me()
    .post({
      body: {
        version,
        actions: [
          { action: 'setFirstName', firstName },
          { action: 'setLastName', lastName },
          { action: 'changeEmail', email },
          { action: 'setDateOfBirth', dateOfBirth },
        ],
      },
    })
    .execute();
}

export async function addAddress(version: number, address: BaseAddress) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  return await inst
    .me()
    .post({
      body: {
        version,
        actions: [{ action: 'addAddress', address }],
      },
    })
    .execute();
}

export async function changeAddress(version: number, address: BaseAddress, addressId?: string, addressKey?: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  if (typeof addressId === 'undefined' && typeof addressKey === 'undefined') {
    throw new Error('id or key must be specified');
  }
  return await inst
    .me()
    .post({
      body: {
        version,
        actions: [{ action: 'changeAddress', addressId, addressKey, address }],
      },
    })
    .execute();
}

export async function removeAddress(version: number, addressId?: string, addressKey?: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  if (typeof addressId === 'undefined' && typeof addressKey === 'undefined') {
    throw new Error('id or key must be specified');
  }
  return await inst
    .me()
    .post({
      body: {
        version,
        actions: [{ action: 'removeAddress', addressId, addressKey }],
      },
    })
    .execute();
}

export async function setDefaultBillingAddress(version: number, addressId?: string, addressKey?: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  if (typeof addressId === 'undefined' && typeof addressKey === 'undefined') {
    throw new Error('id or key must be specified');
  }
  return await inst
    .me()
    .post({
      body: {
        version,
        actions: [{ action: 'setDefaultBillingAddress', addressId, addressKey }],
      },
    })
    .execute();
}

export async function addBillingAddress(version: number, addressId?: string, addressKey?: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  if (typeof addressId === 'undefined' && typeof addressKey === 'undefined') {
    throw new Error('id or key must be specified');
  }
  return await inst
    .me()
    .post({
      body: {
        version,
        actions: [{ action: 'addBillingAddressId', addressId, addressKey }],
      },
    })
    .execute();
}
export async function removeBillingAddress(version: number, addressId?: string, addressKey?: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  if (typeof addressId === 'undefined' && typeof addressKey === 'undefined') {
    throw new Error('id or key must be specified');
  }
  return await inst
    .me()
    .post({
      body: {
        version,
        actions: [{ action: 'removeBillingAddressId', addressId, addressKey }],
      },
    })
    .execute();
}

export async function setDefaultShippingAddress(version: number, addressId?: string, addressKey?: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  if (typeof addressId === 'undefined' && typeof addressKey === 'undefined') {
    throw new Error('id or key must be specified');
  }
  return await inst
    .me()
    .post({
      body: {
        version,
        actions: [{ action: 'setDefaultShippingAddress', addressId, addressKey }],
      },
    })
    .execute();
}

export async function addShippingAddress(version: number, addressId?: string, addressKey?: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  if (typeof addressId === 'undefined' && typeof addressKey === 'undefined') {
    throw new Error('id or key must be specified');
  }
  return await inst
    .me()
    .post({
      body: {
        version,
        actions: [{ action: 'addShippingAddressId', addressId, addressKey }],
      },
    })
    .execute();
}
export async function removeShippingAddress(version: number, addressId?: string, addressKey?: string) {
  if (inst === null) {
    throw new Error('client instance not found');
  }
  if (typeof addressId === 'undefined' && typeof addressKey === 'undefined') {
    throw new Error('id or key must be specified');
  }
  return await inst
    .me()
    .post({
      body: {
        version,
        actions: [{ action: 'removeShippingAddressId', addressId, addressKey }],
      },
    })
    .execute();
}
