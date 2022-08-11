# about
this file details the API that the express-auth-server exposes.

# authenticating
* route: `/auth/`

## federated login
this is used to delegate authentication to a 3rd party (such as google).

* route: `/login/federated/`

### google
* route: `/google/`
* thus to this point, the route is `/auth/login/federated/google/`

#### uses
See also [google's oauth 2.0 docs](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow?hl=en#oauth-2.0-endpoints)

* `envars_name` | google_strategy_paramname
  * `GOOGLE_CLIENT_ID` | clientID : your developper's client_id, obtained/created from the [API console credential page](https://console.cloud.google.com/apis/credentials?authuser=2&project=ytapi-357119). Obtained from envars on the server.
  * `GOOGLE_CLIENT_SECRET` | clientSecret: envars on the server.
* other google stategy paramname
  * callbackURL: the provider's (google, FB, etc.) callbackURL that they will use at the end of the process