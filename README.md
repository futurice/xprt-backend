# SCOOL Backend

## Overview

This is a sample Node.js backend for the Pepperoni app kit.

## Running the server

1. Install and setup PostgreSQL

    On OSX with brew:

    ```
    brew install postgres
    brew services start postgresql
    ```

    Create DB for your user (had to do this before next step worked):

    ```
    createdb $(whoami)
    ```

    Create DB superuser `postgres` + empty DB for it:

    ```
    psql
    CREATE USER postgres SUPERUSER;
    CREATE DATABASE postgres WITH OWNER postgres;

    <ctrl-d>
    ```

2. Install npm dependencies `npm install`
3. Run db initialization script `npm run db:init`
4. Optional: Insert seed data into db for testing/demoing: `npm run db:seed`
5. Start server `npm run watch`
