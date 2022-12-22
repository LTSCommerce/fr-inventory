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


### Run Development Server
To get the system running in development mode, use this command:

```bash
./run dev
```

This will then spin up a hot reloading dev server. You can access the front end on [http://localhost:3000].

As you make changes and save them, the page will automatically update so you can see your changes in pretty close to 
real time.


---


# Next 

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
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

# Backend

The backend handles the CRUD to MySQL

### ORM - Prisma

We're using [Prisma](https://www.prisma.io/) as the ORM 

To run prisma commands, we need to use `docker compose run`, the commands can get quite verbose and so we have a helper script [./run](run)

View the contents of the [./run](run) to see the available commands





# Frontend
TODO