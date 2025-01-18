### Docker practice

To run this just clone the repo, have Docker installed, and run `docker-compose up` from the repo root. This will spin up a node instance, `http-server` instance, and a `mysql` database instance.

Resources:

- [Jake Wright](https://www.youtube.com/watch?v=Qw9zlE3t8Ko&t=248s) has super easy Docker tutorials
- Remember to use `docker-compose up` (add the `--build` flag whenever changing the Dockerfiles!!!). This was an issue with getting `nodemon` to work, but then you built it again and it was fine.

### Web directory

Simple web server running on the [Linux Alpine image](https://hub.docker.com/_/alpine).

- Loads up `apt-get` and then installs `yarn`
- Then it runs `yarn` to install `node_modules`
- Then it starts the script.

### Server directory

Node running on `node:12` image ([from here](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/))

### Database directory

Using Docker compose image for MySQL 5.7

- Using [`mysql-migrations`](https://github.com/kawadhiya21/mysql-migrations) with [`mysql`](https://github.com/mysqljs/mysql) and [`node-mysql-helper`](https://github.com/gdbate/node-mysql-helper) to handle database.
- Checkout the MySQL [cheatsheet](https://devhints.io/mysql) too.
- Get database container name `docker ps` (use NAMES column value)
- Access CLI for mysql `docker exec -it backend_mysql-db_1 mysql -uroot -p` (or `-u<username used for db creation>` i.e. `-uuser`)
- Add migration `docker exec -it backend_node-server_1 node migrations.js add migration create_table_users`
- Run migrations `docker exec -it backend_node-server_1 node migrations.js up` (or `down`)
- Refresh migrations `docker exec -it backend_node-server_1 node migrations.js refresh`.

##### Login to MySQL CLI

- `docker exec -it backend_mysql-db_1 mysql -uroot -p`
- `show databases;`
- `use db;` (db name set in .env file)
- `delete from transactions where id > 100000;` (example for deleting)

#### TODO:

Check out https://github.com/gdbate/node-mysql-helper
