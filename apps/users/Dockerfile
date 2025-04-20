FROM node:20.12.2 as development
WORKDIR /usr/src/app 
COPY package*.json ./
RUN npm ci 

COPY . .

RUN npm run build users