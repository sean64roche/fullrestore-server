ARG NODE_VERSION=23.4.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/

COPY package*.json ./
COPY . .

WORKDIR /usr/src/migration
RUN ls -a
RUN npm ci
RUN npx sequelize-cli db:migrate --debug

WORKDIR /usr/src/api
RUN npm ci
EXPOSE 3000
CMD ["npx", "tsx", "app/app.ts"]