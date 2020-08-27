# Harrastuspassi Web UI

Part of the Harrastuspassi application. This repository provides the Web UI for managing hobbies for administrators.
Implemented in React, requires Harrastuspassi backend API.

## Requirements

- Node 10 LTS

## Development

- Run `npm install` to install dependencies
- Run `npm start` to start development server
- Run `npm test` to execute tests
- To access the application from browser, first add this row to your local hosts file:

```
127.0.0.1       harrastuspassiadmin.kehitys.fi
```

## Deployment

- Run `npm install` to install dependencies
- Create `.env.production.local` file with the following variables:
  - `REACT_APP_API_URL=<backend host>/api/<api_version>/`
  - `REACT_APP_TOKEN_URL=<backend host>/auth/token/`
  - `REACT_APP_LOGIN_URL=<backend host>/accounts/login/`
- Run `npm run build`
- Deploy the static content from `build/` to a webserver
- Make sure the backend host sends the following CORS headers:
  - `Access-Control-Allow-Origin: https:/this.service.com`
  - `Access-Control-Allow-Credentials: true`
