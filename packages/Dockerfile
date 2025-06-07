ARG NODE_VERSION=23
FROM node:${NODE_VERSION}-alpine

WORKDIR /

RUN --mount=type=bind,source=packages/api/package.json,target=package.json \
    --mount=type=bind,source=packages/api/package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

WORKDIR /usr/src/

COPY package*.json ./
COPY api ./
COPY migration ./
RUN npm install
RUN npx sequelize-cli db:migrate

EXPOSE 3000

CMD ["npx", "tsx", "app/app.ts"]