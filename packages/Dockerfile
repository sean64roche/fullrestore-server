ARG NODE_VERSION=23
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/

RUN --mount=type=bind,source=./api/package.json,target=package.json \
    --mount=type=bind,source=./api/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY package*.json ./

WORKDIR /usr/src/packages/migration
RUN ls -a
RUN npx sequelize-cli db:migrate --debug

WORKDIR /usr/src/packages/api
EXPOSE 3000
CMD ["npx", "tsx", "app/app.ts"]