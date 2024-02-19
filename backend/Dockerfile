
FROM node:20-alpine As build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine As production
WORKDIR /app
COPY package*.json ./
RUN npm i --omit=dev --no-audit --no-fund && npm i pm2 -g
COPY --from=build /app/dist ./dist
COPY ./ecosystem.config.js ./
EXPOSE 3001

CMD ["pm2-runtime", "start", "ecosystem.config.js"]