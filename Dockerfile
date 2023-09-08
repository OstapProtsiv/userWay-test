FROM node:19-alpine
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .
ENTRYPOINT ["yarn", "start:dev"]