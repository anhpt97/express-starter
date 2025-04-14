FROM node:alpine

WORKDIR /app

COPY . .

RUN yarn global add pm2 && yarn --prod && yarn build

CMD ["pm2-runtime", "dist/app.js", "-i", "max"]
