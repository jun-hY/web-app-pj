FROM node:slim

WORKDIR /usr/src/

RUN mkdir app

WORKDIR /usr/src/app

RUN apt install git
RUN npm install express

CMD ["node", "server.js"]