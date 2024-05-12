import { ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

let inst: ByProjectKeyRequestBuilder | null = null;

export function getApiRoot(username?: string, password?: string) {
  const projectKey = process.env.PROJECT_KEY;
  const host = process.env.HOST;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const clientScopes = process.env.CLIENT_SCOPES;
  if (!projectKey || !host || !clientId || !clientSecret || !clientScopes) {
    throw new Error('Env parameters are undefined');
  }
  const scopes = clientScopes.split(' ');
  if (!inst) {
    if (!username || !password) throw new Error('Empty credentials');
    const ctpClient = new ClientBuilder()
      .withPasswordFlow({
        host,
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
      .withHttpMiddleware({ host, fetch })
      .withLoggerMiddleware() // надо додумать, чтобы только в девмоде было
      .build();

    inst = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
  }
  return inst as ByProjectKeyRequestBuilder;
}

export function destroyApiRoot() {
  inst = null;
}
