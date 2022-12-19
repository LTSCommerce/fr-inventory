# README

## QUICK START

To install the project, run these commands:

```bash
// spin up the containers
docker compose up -d

// go into backend folder
cd backend

// install packages
./run i

// generate ORM client files
./run g

// create DB structure
./run p

// seed DB with data
./run f
```

You can then access PHPMyAdmin on [http://localhost:8081] and you should see the database created and populated with seed data.



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

To run prisma commands, we need to use `docker compose run`, the commands can get quite verbose and so we have a helper script [./backend/run](./backend/run)

View the contents of the [./backend/run](./backend/run) to see the available commands



# Frontend
TODO