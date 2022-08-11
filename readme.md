# about

* this comes from [Passport Sign-in with google tuto](https://www.passportjs.org/tutorials/google/)

# how to use
* visit `http://localhost:3000/auth/login/federated/google` with server running
* you'll then be presented with google's login screens, oauth stuff, etc.+

# gotchas
* webstorm's integrated database viewer locks up sql-lite, so can't both run the server & sql lite at the same time

# TODOS (rough order of priorities)
## Headless server &  auth strategies (passports)
* currently just a direct implt. of google Oauth 2.0
* need to develop
  * an API for a client to auth on different strategies, with proper params etc.
  * structure the code so it' easy to add/modify passport strats
### credential management for other 3rd party auth
* storing in .env file for now
* how to properly manage those creds & data?

## ORM or some db abstractions
* currently just directly coding for sql-lite3 requests, as per tutorial
* currently just a local DB, need to parametize for some cloud (aws?) integration

Options ot consider:
### Express database integration drivers (node-js drivers)
* currently what is used. could just re-structure the code for different dbs

### TypeORM
* see [docs](https://typeorm.io/) 

### Sequalize
* see [docs](https://sequelize.org/)