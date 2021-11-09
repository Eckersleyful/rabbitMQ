# syntax=docker/dockerfile:1

FROM node:14.13.0
WORKDIR /
ENV NODE_ENV=production
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "server.js"]