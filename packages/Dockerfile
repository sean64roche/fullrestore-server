ARG NODE_VERSION=23
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/

RUN --mount=type=bind,source=./api/package.json,target=package.json \
    --mount=type=bind,source=./api/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

WORKDIR /usr/src/migration
RUN npm ci
RUN ls -a
RUN npx sequelize-cli db:migrate --debug

WORKDIR /usr/src/api
RUN npm ci

EXPOSE 3000
CMD ["npx", "tsx", "app/app.ts"]