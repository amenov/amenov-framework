FROM node:14.17.1

WORKDIR /app

COPY . /app

ENV TZ=Asia/Almaty

RUN npm install pm2 -g && npm install

CMD pm2-runtime index.js