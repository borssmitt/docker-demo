# -------- Stage 1: Build --------
FROM node:18-alpine AS build

WORKDIR /opt/app

# Копируем весь монорепо-проект
COPY ../../../ ./

# Устанавливаем зависимости (dev + prod)
RUN npm install

# Собираем только API
RUN npm run build api


# -------- Stage 2: Run --------
FROM node:18-alpine

WORKDIR /opt/app

# Копируем только package.json (для prod зависимостей)
COPY package*.json ./

# Устанавливаем только продакшен зависимости
RUN npm install --only=prod

# Копируем собранный API
COPY --from=build /opt/app/dist/apps/api ./dist

# Копируем .env внутрь контейнера
COPY .env ./

CMD ["node", "./dist/main.js"]
