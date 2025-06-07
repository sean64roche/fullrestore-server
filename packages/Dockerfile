ARG NODE_VERSION=23.4.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/

COPY package*.json ./

WORKDIR /usr/src/packages/migration
RUN ls -a
RUN npx sequelize-cli db:migrate --debug

WORKDIR /usr/src/packages/api
EXPOSE 3000
CMD ["npx", "tsx", "app/app.ts"]