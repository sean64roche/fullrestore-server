ARG NODE_VERSION=23
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/

RUN --mount=type=bind,source=./packages/api/package.json,target=package.json \
    --mount=type=bind,source=./packages/api/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY package*.json ./
COPY packages/api ./
COPY packages/migration ./

WORKDIR /usr/src/migration
RUN npm install
RUN npx sequelize-cli db:migrate

WORKDIR /usr/src/api
RUN npm install

EXPOSE 3000
CMD ["npx", "tsx", "app/app.ts"]