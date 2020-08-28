FROM alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --no-cache yarn
RUN yarn
CMD ["yarn", "start"]