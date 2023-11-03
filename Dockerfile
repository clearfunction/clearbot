FROM node:14-alpine as builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json ./
RUN npm install
COPY src ./
RUN npm run tsc

FROM node:14-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package.json package.json
COPY --from=builder /usr/src/app/node_modules node_modules
COPY --from=builder /usr/src/app/build build

CMD [ "npm", "run", "start:prod" ]
