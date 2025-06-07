ARG NODE_VERSION=23
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/

RUN --mount=type=bind,source=./api/package.json,target=package.json \
    --mount=type=bind,source=./api/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY package*.json ./
COPY api ./
COPY migration ./

WORKDIR /usr/src/migration
RUN npm ci
RUN npx sequelize-cli db:migrate

WORKDIR /usr/src/api
RUN npm ci

EXPOSE 3000
CMD ["npx", "tsx", "app/app.ts"]