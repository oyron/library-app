import { AuthenticationContext, adalFetch } from 'react-adal';

const clientId = "13fd846e-088a-4014-8843-a7a539ec4c4c";

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
