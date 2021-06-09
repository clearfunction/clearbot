FROM node:14-alpine as builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install
COPY src ./
RUN yarn run tsc

FROM node:14-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package.json package.json
COPY --from=builder /usr/src/app/node_modules node_modules
COPY --from=builder /usr/src/app/build build

CMD [ "yarn", "run", "start:prod" ]
