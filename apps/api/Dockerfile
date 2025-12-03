# ---------- Stage 1: Build ----------
FROM node:14-alpine as build
WORKDIR /opt/app

# Копируем весь проект (чтобы nested tsconfigs, nest-cli, etc были доступны)
COPY ../../ ./

# Устанавливаем зависимости для всего монорепо
RUN npm install

# Собираем только API
RUN npm run build api

# ---------- Stage 2: Run ----------
FROM node:14-alpine
WORKDIR /opt/app

COPY package*.json ./
RUN npm install --only=prod

COPY --from=build /opt/app/dist/apps/api ./dist

CMD ["node", "./dist/main.js"]
