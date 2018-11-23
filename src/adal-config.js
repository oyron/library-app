import { AuthenticationContext, adalFetch } from 'react-adal';

const clientId = 'b73ea05f-55ca-41e0-a246-2b26f1a4ce33';

export const adalConfig = {
    tenant: 'StatoilSRM.onmicrosoft.com',
    clientId,
    postLogoutRedirectUri: window.location.origin,
    endpoints: {
        api: clientId,
    },
    cacheLocation: 'localStorage',
};

export const authContext = new AuthenticationContext(adalConfig);

export const adalApiFetch = (fetch, url, options) =>
    adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);
