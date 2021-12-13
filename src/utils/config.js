const configuration = {
  authority: `https://${process.env.REACT_APP_DEX_DOMAIN}/dex`,
  clientId: process.env.REACT_APP_DEX_CLIENT_ID,
  autoSignIn: true,
  responseType: 'id_token',
  scope: 'openid profile email',
  redirectUri: `${window.location.origin}/callback`,
  policyRoot: process.env.REACT_APP_POLICY_ROOT,
  audience: process.env.REACT_APP_DEX_AUDIENCE,
  apiOrigin: process.env.apiOrigin || `http://localhost:3001`
}

if (!process.env.REACT_APP_NETLIFY) {
  if (!configuration.apiOrigin) {
    const url = new URL(window.location.origin);
    if (url.port === '3000') {
      url.port = '3001';
    }
    const urlstring = url + '';
    configuration.apiOrigin =
      urlstring.substr(-1) === '/' ?
        urlstring.substr(0, urlstring.length - 1) :
        urlstring;
  }
} else {
  configuration.apiOrigin = `${window.location.origin}/.netlify/functions/api-server`;
}


export default configuration

