FROM node:6.3.1

MAINTAINER Daniel J. Pritchett <daniel@clearfunction.com>

RUN npm install -g yarn

COPY package.json /opt/app/
COPY yarn.lock /opt/app/

WORKDIR /opt/app

RUN yarn

COPY . /opt/app

CMD bin/hubot
