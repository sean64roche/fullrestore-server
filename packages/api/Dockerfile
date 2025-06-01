ARG NODE_VERSION=23
FROM node:${NODE_VERSION}-alpine

WORKDIR /

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

WORKDIR /usr/src/

COPY package*.json ./
COPY . .
RUN npm install
RUN npm install --save-dev sequelize-cli


EXPOSE 3000

CMD ["npx", "tsx", "app/app.ts"]