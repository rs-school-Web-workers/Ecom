import { ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

let inst: ByProjectKeyRequestBuilder | null = null;

export function getApiRoot(username?: string, password?: string) {
  const projectKey = process.env.PROJECT_KEY;
  const region = process.env.REGION;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const clientScopes = process.env.CLIENT_SCOPES;
  if (!projectKey || !region || !clientId || !clientSecret || !clientScopes) {
    throw new Error('Env parameters are undefined');
  }
  const scopes = clientScopes.split(' ');
  if (!inst) {
    if (!username || !password) throw new Error('Empty credentials');
    let ctpClient = new ClientBuilder()
      .withPasswordFlow({
        host: `https://auth.${region}.gcp.commercetools.com`,
        projectKey,
        credentials: {
          clientId,
          clientSecret,
          user: {
            username,
            password,
          },
        },
        scopes,
        fetch,
      })
      .withHttpMiddleware({
        host: `https://api.${region}.gcp.commercetools.com`,
        fetch,
      });
    if (process.env.NODE_ENV === 'development') {
      ctpClient = ctpClient.withLoggerMiddleware();
    }

    inst = createApiBuilderFromCtpClient(ctpClient.build()).withProjectKey({ projectKey });
  }
  return inst as ByProjectKeyRequestBuilder;
}

export function destroyApiRoot() {
  inst = null;
}

export function isLogged() {
  if (inst) return true;
  return false;
}
