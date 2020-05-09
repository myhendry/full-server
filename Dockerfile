FROM node:10

WORKDIR /usr/src/app

COPY package*.json  ./

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=dockerized

COPY .env ./dist/

WORKDIR ./dist

EXPOSE 4000

CMD node src/index.js