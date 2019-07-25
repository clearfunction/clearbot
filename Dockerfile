FROM node:6.3.1

MAINTAINER Daniel J. Pritchett <daniel@clearfunction.com>

RUN npm install -g yarn@1.5.1

COPY package.json yarn.lock /opt/app/

WORKDIR /opt/app

RUN yarn

COPY . /opt/app
