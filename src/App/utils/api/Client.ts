import { BaseAddress, ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder, TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

let inst: ByProjectKeyRequestBuilder | null = null;
const projectKey = process.env.PROJECT_KEY;
const region = process.env.REGION;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientScopes = process.env.CLIENT_SCOPES;
const scopes = clientScopes?.split(' ');

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
  if (!projectKey || !region || !clientId || !clientSecret || !clientScopes) {
    throw new Error('Env parameters are undefined');
  }
  if (inst !== null) {
    return inst;
  }
  const ctpClient = new ClientBuilder()
    .withAnonymousSessionFlow({
      host: `https://auth.${region}.gcp.commercetools.com`,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
      },
      scopes,
      fetch,
    })
    .withHttpMiddleware({
      host: `https://api.${region}.gcp.commercetools.com`,
      fetch,
    });
  inst = createApiBuilderFromCtpClient(ctpClient.build()).withProjectKey({ projectKey });
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
    .catch((err) => {
      inst = null;
      throw err;
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

export function getUserProfile() {
  throw new Error('not implemented');
}
