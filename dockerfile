FROM node:11-alpine

ENV NODE_ENV=production 
ENV PORT=8080

WORKDIR /var/www/datarisk

COPY package* /var/www/datarisk/

RUN npm install --production

COPY . /var/www/datarisk

EXPOSE $PORT

CMD ["node", "server.js"]
