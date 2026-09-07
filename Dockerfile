FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=3555
EXPOSE 3555

CMD ["node", "src/server.js"]
