FROM node:23.4.0-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npx sequelize-cli db:migrate

CMD ["node", "models/index.js"]
