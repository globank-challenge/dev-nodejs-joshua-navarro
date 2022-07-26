FROM node:alpine AS development

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:alpine AS production

RUN apk --no-cache add curl

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --prod

COPY . .

COPY --from=development /app/dist ./dist

CMD ["yarn", "start:prod"]
