# README

## QUICK START

To install the project, clone this repo, then enter the root directory and run this command:

```bash
./run quickstart
```

This will run a sequence of commands to build the docker containers and install and generate required code. It will
also create and pre seed the database with data.

You can then access PHPMyAdmin on [http://localhost:8081] and you should see the database created and populated with seed data.

## ./run Script

Everything is being done in containers.

To make this easier, commands have been coded into the [./run](./run) script. If you run it without arguments you can see the help

### Run Production Server

To run a production server, use this command:

```bash
run prod
```

### Run Development Server

To get the system running in development mode, use this command:

```bash
./run dev
```

This will then spin up a hot reloading dev server. You can access the front end on [http://localhost:3000].

As you make changes and save them, the page will automatically update so you can see your changes in pretty close to
real time.

## Debugging

This project features client side (browser) and server side code. You can debug both of these code bases, or even both combined (docs TODO)

### Debugging Client Side Code

If you want to debug the code that is running the browser then you should use the `Next.js: debug client-side` configuration in [launch.json](.vscode/launch.json)

First, make sure the dev server is running (`./run dev`)

In the bottom bar of VSCode, you can see the debug options, choose teh correct one and launch it. 

This will then open a chrome window and attach to debugging. You can then set breakpoints and work on your code. Note this will only let you debug client side code, not anything backend (eg api pages).


### Debugging The Development Server Side Code

To debug the development server is a little more involved. The reason being that the actual process you want to debug is a child process of the command you have to run.

This is the code that runs the API backend and other backend code in Next.

To run the dev server in debug mode, use this command:

```bash
./run debug
```

You will see output like:

```
Run Dev Server with Debugging for local development and debugging
+ docker compose run -p 9229:9229 -p 9230:9230 -p 3000:3000 --rm runner bash -c ' node --inspect-brk=0.0.0.0:9229 ./node_modules/.bin/next dev'
[+] Running 1/0
 ⠿ Container fr-inventory-mysql-1  Running                                                        0.0s
Debugger listening on ws://0.0.0.0:9229/d9a84136-76ea-423c-9e51-7a7e6ac10bd9
For help, see: https://nodejs.org/en/docs/inspector
```

You then need to attach to the first debug session which is running on port 9229. You just simple connect and then press teh play button to get this one to continue. There is already a debug profile configured in the [launch.json](.vscode/launch.json) file called `Docker: Attach to Node` - use this one for this step

You should see multiple debugger attached messages

```
Debugger attached.
Debugger attached.
Debugger attached.
Debugger attached.
```

Once you connect and press play, a new debug session will be started on port 9230 - this is the one you actually want to debug

```
Debugger listening on ws://0.0.0.0:9230/29ea6bbb-1037-4b4e-a0a5-2a47af11999f
For help, see: https://nodejs.org/en/docs/inspector
```

For attaching to this one, we have another configuration in [launch.json](.vscode/launch.json) file called `Docker: Attach to Next Dev` - use this one to attach to the actual dev server.

Once this one is attached, you should hit breakpoints in your server side code.

---

# VSCode

This project is optimised to work with vscode.

## Recommended Extensions

There are some preconfigured recommended extensions for VSCode

To install these, open the command pallete (`[Ctrl]`+`[Shift]`+`[p]`) and then type "show recommended extensions" and you will be given an easy view to install them

Some are more essential than others, but they are all good

## Settings and Loader

There are pre defined configurations for vscode that will do things like automatically format on save. We also have a predefined debug runner which will allow you to debug code that is running inside the container. You can see all these files in the [.vscode](.vscode) folder.

### [.vscode/settings.json](.vscode/settings.json)

The settings file contains specific settings that are required for this project.

You can read more about this in the [vscode docs](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson)

### [.vscode/launch.json](.vscode/launch.json)

The launch file contains specific configs for debug running. The configuration has everything required to debug nodejs inside the container.

To debug something, you should use the command

```bash
./run node-debug path/to/script/or/args
```

This will run the node script and will break on the first line. Once that is running and paused at the first line, you can then connect to that debugger via the VSCode debugger and commence normal debugging.

---

# Next

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
./run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Docker

Using Docker Compose to manage required services and build an environment

## Variables

Things like usernames and passwords are managed in the .env file. This file is not tracked by Git, however there is a copy called .env-dist. You should copy this file to .env

```bash
cp .env-dist .env
```

## Build/Start/Update

To get it running, or to update the running version with the latest changes in the compose file, use

```bash
docker compose up -d
```

(If you need to see debug info from the containers, run without the `-d` flag)

## Stop / Cleanup

To stop the running containers but not destroy anyting, run

```bash
docker compose stop
```

To stop and remove containers

```bash
docker compose down
```

## Full Destroy (Danger)

To totally destroy containers and all data including DB etc

```bash
docker compose down -v
```

---

# ORM - Prisma

We're using [Prisma](https://www.prisma.io/) as the ORM

There are a few run commands to help manage the database

DB Push will force push the current model structure into to the database. It will not create migrations and it may destroy data if columns are removed. Whilst developing the MVP this is fine, there should not be any important data in the DB.

Generate will create the required client library files for our code to work with the ORM and access the database. This is required as a first step

```bash
 ./run generate
```

DB Push will force push the current model structure into to the database. It will not create migrations and it may destroy data if columns are removed. Whilst developing the MVP this is fine, there should not be any important data in the DB.

```bash
./run db-push
```

DB Fill will populate the database with data as defined in the [./prisma/seed.ts](./prisma/seed.ts) script

```bash
./run db-fill
```

## Testing Prisma

We're using https://www.npmjs.com/package/@quramy/jest-prisma

This gives us an easy way to do proper integration tests that really interact with the database so we get a lot more certainity that things really work.

Each test is wrapped in a transaction, and that transaction is then rolled back. This means that tests don't actually pollute the database and makes testing a lot easier.

---

# Frontend

The frontend is standard [NextJS](https://nextjs.org/) and used [React](https://reactjs.org/)

## Install the React Dev Tools

You will want to make sure you have this extension installed for Chrome

https://reactjs.org/blog/2015/09/02/new-react-developer-tools.html#installation

## MUI Components

This system is using [MUI components](https://mui.com/). This allows us to quickly add functionality using high quality components.

### Datagrid

The data grid provides a table/spreadsheet type functionality

https://mui.com/x/react-data-grid/

We are trying to implement full CRUD:
https://mui.com/x/react-data-grid/editing/#full-featured-crud-component

---

# Links/Docs/Resource

## Typescript

- https://basarat.gitbook.io/typescript/
- https://www.typescriptlang.org/docs/
- https://bobbyhadz.com/blog/typescript-instanceof-only-refers-to-type-but-is-being-used-as-value

## Linting etc automatically

- https://paulintrognon.fr/blog/typescript-prettier-eslint-next-js

## NextJS Docs

- https://nextjs.org/docs/getting-started
- https://nextjs.org/docs/testing#jest-and-react-testing-library

## MUI component library

- https://mui.com/material-ui/getting-started/overview/
- https://mui.com/x/introduction/
- https://mui.com/x/react-data-grid/editing/#full-featured-crud-component

## Prisma ORM

- https://www.prisma.io/nextjs
- https://www.prisma.io/docs

## Testing

- https://jestjs.io/docs/using-matchers

## Transactions for Tests

- https://selimb.hashnode.dev/speedy-prisma-pg-tests
- https://github.com/prisma/prisma/issues/12458
- https://github.com/chax-at/transactional-prisma-testing
- https://www.npmjs.com/package/@quramy/jest-prisma?activeTab=readme

## NextJS API

- https://giancarlobuomprisco.com/next/handling-api-errors-in-nextjs
- https://www.paigeniedringhaus.com/blog/how-to-unit-test-next-js-api-routes-with-typescript
- https://seanconnolly.dev/unit-testing-nextjs-api-routes

## Error Handling

- https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
