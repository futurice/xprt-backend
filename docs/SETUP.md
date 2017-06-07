# Setup

[yarn](https://github.com/yarnpkg/yarn) 0.18+ must be present on your machine.

## Install project dependencies
```
$ yarn
```

## Install PostgreSQL

Look up instructions for your specific OS/distribution.

## Initialize DB
```
$ psql --user postgres
```

NOTE: If you get errors when running the above command:
[Troubleshooting PostgreSQL connection errors](/docs/POSTGRESQL.md)

```
postgres=# CREATE DATABASE xprt;
postgres=# \q
```

```
$ yarn db:migrate
```

## Insert seed data
```
$ yarn db:seed
```

## Register admin user (production environments)
```
# Get URL from e.g. Heroku dashboard
$ DATABASE_URL=postgres://user:pass@hostname/dbname yarn register:admin
```

## Environment variables (production environments)
### Environments
#### Heroku

Set environment variables using:

```
$ heroku config.set ENV_VAR=[value]
```

#### Others

We recommend creating a [.env](https://www.npmjs.com/package/dotenv) file in
the root of the repository. Change directory to the repository root and simply:

```
$ cat ENV_VAR=[value] >> .env
```

### JWT token generation secret
Backend will refuse to run if NODE_ENV=production and this is not set:
```
SECRET=[secret-string]
```

Recommendation for generating `[secret-string]`:
```
$ node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

### OAuth2 config parameters

Required to support OAuth2 logins:

```
OAUTH2_CLIENT_ID=[client-id]
OAUTH2_CLIENT_SECRET=[client-secret]
OAUTH2_HOST=https://example.com/oauth/authorize
OAUTH2_TOKEN_HOST=https://example.com/oauth/token

# Endpoint which we can fetch user data from once authenticated
OAUTH2_USER_ENDPOINT=https://example.com/api/v1/me.json
```

### Email config parameters

Required to support sending email:

```
# SMTP server connection details
SMTP_HOST=smtp.example.com
SMTP_USER=admin
SMTP_PASSWORD=foobar
SMTP_TLS=true

# Admin recepient email (e.g. feedback sent here)
ADMIN_EMAIL_TO=example@example.com

# Root of Web frontend (for links in emails)
WWW_DOMAIN=https://xprt.example.com
```

## Run backend
### Run in development, watching for changes
```
$ yarn watch
```

### Run in production
```
$ yarn start
```

Backend is now listening on port 3888 (or `$PORT` if set)
