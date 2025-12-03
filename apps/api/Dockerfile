# -------- Stage 1: Build --------
FROM node:16-alpine AS build

WORKDIR /opt/app

# Копируем весь проект в контекст (монорепо)
COPY . .

# Устанавливаем зависимости
RUN npm install

# Собираем API
RUN npm run build api


# -------- Stage 2: Run --------
FROM node:18-alpine

WORKDIR /opt/app

COPY package*.json ./
RUN npm install --only=prod

# Копируем собранный API
COPY --from=build /opt/app/dist/apps/api ./dist

# Копируем env
COPY apps/api/.env .env

CMD ["node", "./dist/main.js"]
