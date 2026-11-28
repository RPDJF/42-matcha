# Builder

FROM node:24-alpine

WORKDIR /app/frontend

COPY src ./src
COPY package.json ./
COPY package-lock.json ./

COPY tailwind.config.js ./tailwind.config.js
COPY .postcssrc.json ./.postcssrc.json
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.app.json ./tsconfig.app.json
COPY angular.json ./angular.json
COPY environments ./environments

EXPOSE 4200

RUN npm i

COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]