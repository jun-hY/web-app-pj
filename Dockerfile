FROM node:slim

WORKDIR /usr/src/

RUN mkdir app

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install git -y
RUN npm install express
RUN npm i -D typescript @types/express @types/node
RUN npm i -D sqlite3 @types/sqlite3
RUN npm i -D axios @types/axios
RUN npm i -D crypt
# RUN git clone https://github.com/jun-hY/web-app-pj.git
COPY ./ ./


# WORKDIR /usr/src/app/web-app-pj

RUN npx tsc

CMD ["node", "server.js"]