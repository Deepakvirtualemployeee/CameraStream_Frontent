# Camera Stream Frontend

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from the example:

```bash
copy .env.example .env
```

3. Start the app:

```bash
npm start
```

The frontend runs on `http://localhost:3000`.

## API configuration

The frontend reads the backend base URL from `REACT_APP_API_BASE_URL`.
Auth requests use `REACT_APP_AUTH_API_BASE_URL` because the main service exposes auth separately from the mounted Web VSS app.

Default local API URL:

```env
REACT_APP_API_BASE_URL=http://localhost:5001/apicamera/webvss/api
REACT_APP_AUTH_API_BASE_URL=http://localhost:5001/apicamera/auth
API_PROXY_TARGET=http://localhost:5001
REACT_APP_TENANT_ID=your-tenant-id-here
```

In development, the React dev server proxies stale `/api` requests to `/apicamera/webvss/api` on `http://localhost:5001`.

If your backend requires tenant scoping, set `REACT_APP_TENANT_ID` in `.env`. The frontend attaches it automatically as the `x-tenant-id` header on API requests through the shared Axios client.

## Login API

The login request used by this app is:

```bash
curl --location 'http://localhost:5001/apicamera/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{"email":"broker@gmail.com","password":"Broker@123"}'
```

## Test login

- Email: `broker@gmail.com`
- Password: `Broker@123`

## Scripts

- `npm start` runs the app in development
- `npm run build` creates a production build
- `npm test` starts the test runner
