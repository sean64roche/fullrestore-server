ARG NODE_VERSION=23

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY package.json /app/
COPY package-lock.json /app/
COPY src /app/

WORKDIR /app

RUN npm -i

CMD ["node", "index.js"]