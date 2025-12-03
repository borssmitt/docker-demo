FROM node:14-alpine as build
WORKDIR /opt/app

ADD package*.json ./
RUN npm install

ADD . .

# КОПИРУЕМ .env внутрь image
COPY .env /opt/app/.env

RUN npm run build api


FROM node:14-alpine
WORKDIR /opt/app

ADD package.json ./
RUN npm install --only=prod

COPY --from=build /opt/app/dist/apps/api ./dist

# КОПИРУЕМ .env в рантайм-образ
COPY .env /opt/app/.env

CMD ["node", "./dist/main.js"]
