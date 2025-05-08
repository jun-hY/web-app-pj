FROM node:slim

WORKDIR /usr/src/

RUN mkdir app

WORKDIR /usr/src/app

RUN apt install git
RUN npm install express
RUN npm i -D typescript @types/express @types/node
RUN git clone https://github.com/jun-hY/web-app-pj.git

WORKDIR /usr/src/app/web-app-pj

RUN npx tsc
RUN npm run start

CMD ["node", "server.ts"]