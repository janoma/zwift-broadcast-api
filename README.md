# Zwift Broadcast API Library

Type-safe access to Zwift's broadcast APIs.

**Caveat**. This library does _not_ give you access to the APIs, but if you _do_ have access, it should make it easy to work with them, especially from a server environment. Your regular Zwift login _does not work_ here.

For the APIs you can access with your Zwift login, take a look at [zwift-api-wrapper](https://github.com/rally25rs/zwift-api-wrapper).

## Usage

### Prerequisites

You should have the URL of a Zwift relay host, plus your client ID and secret. At the very least, put the last two in environment variables.

```Dotenv filename=".env"
ZWIFT_RELAY_HOST=https://<...>/
ZWIFT_CLIENT_ID=<your_client_id>
ZWIFT_CLIENT_SECRET=<your_client_secret>
```

### Installation

As usual with your preferred package manager.

```sh
npm install zwift-broadcast-api
```

### Get the auth host (optional)

Use the relay host to obtain the URL of an auth host, if you don't have one. Should be safer, even if the response is not intended to change.

```ts
import { getAuthServer } from "zwift-broadcast-api";

const response = await getAuthServer(process.env.ZWIFT_RELAY_HOST);

// auth host URL is in response.authHost
```

### Get the auth token from the auth host

The following call assumes the auth host has a trailing slash (`/`).

```ts
import { getZwiftToken } from "zwift-broadcast-api";

const response = await getZwiftToken({
  authHost: process.env.ZWIFT_AUTH_HOST,
  clientId: process.env.ZWIFT_CLIENT_ID,
  clientSecret: process.env.ZWIFT_CLIENT_SECRET,
});

// token is in response.access_token, but also take a look at
// response.expires_in to know when to refresh it
```

### Call the broadcast APIs

You can now use the auth token and the relay host to call the various APIs.

```ts
import { getEventPlacement } from "zwift-broadcast-api";

const response = await getEventPlacement({
  eventId: 123456,
  from: 1,
  relayHost: env.ZWIFT_RELAY_HOST,
  subgroupId: 654321,
  to: 50,
  token: "<the_obtained_token>",
});
```

## Future work

Consider refactoring to standardize variable names and types. For example, use only `camelCase` and use `number` for numeric IDs that are returned as strings.

## License

[MIT](./LICENSE)
