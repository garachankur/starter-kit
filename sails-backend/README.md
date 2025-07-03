# Project setup steps

## Node version 20 or higher

1. npm i

2. Migrations

   - change database connection in knexfile.js and config/env/development.js

   - create migration
     - npx knex migrate:make create_user_table
     - npx knex migrate:latest
   - Staging Server
     - npx knex migrate:latest --env staging
   - Production
     - npx knex migrate:latest --env production

3. Run the server

   - npm run start
