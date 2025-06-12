FROM node:slim

WORKDIR /usr/src/

RUN mkdir app

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install git -y
RUN npm install express
# RUN git clone https://github.com/jun-hY/web-app-pj.git
COPY ./ ./
RUN npm ci


# WORKDIR /usr/src/app/web-app-pj

RUN npx tsc

CMD ["node", "server.js"]