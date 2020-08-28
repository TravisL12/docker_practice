### Docker practice

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
