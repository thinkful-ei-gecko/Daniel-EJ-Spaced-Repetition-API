# Spaced repetition API!

## Herzlich Willkommen! 

Welcome to the Clever German API, the back-end for a spaced-repetition app that helps you learn Deutsch... schnell!

Here you will find everything you need to get up and running, including:
1. Migration files
2. A seed file of 10 German words 
3. Integration tests to assist in setting up your project

## Organization

The endpoints are organized by their function, and are: 

1.api/language-Pertaining to all things relating to delivering the words to the user. 
	-api/language: Gets all of the users words to learn
	-/api/language/head: Gets the next word in line for the user
	-/api/language/guess: Processes a users answer to the question, and updated the user's score and correct/incorrect count. 

	The language endpoint makes use of a linked list to implement the spaced-repetition algorithm, and adjusts each word's place in the list based on their memory_value. If a user answers incorrectly, the memory value is reset to 1, and the word is moved back one spot in the list. If answered correctly, the word's memory value is doubled, and the word is moved back that many spaces in the list. 

2.api/auth- Handles user login and manages credentials. There is one endpoint: 
	-api/auth/token: Creates and updates bearer tokens. 

3. /api/user - Handles registering and onboarding new users. Again, one endpoint:
	-/api/user : Posts newly registered users. 


## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DB_NAME=spaced-repetition-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
