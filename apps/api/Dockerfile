FROM node:16-alpine AS build

WORKDIR /opt/api

# 1. Копируем только API package.json
COPY apps/api/package*.json ./

# 2. Ставим только API зависимости
RUN npm install

# 3. Копируем весь проект (для контрактов и общих модулей)
COPY . .

# 4. Собираем API
WORKDIR /opt/api
RUN npm run build


FROM node:16-alpine

WORKDIR /opt/api

COPY --from=build /opt/api/dist ./dist
COPY apps/api/.env .env
COPY apps/api/package*.json ./
RUN npm install --only=prod

CMD ["node", "./dist/main.js"]
