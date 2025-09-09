FROM node:alpine AS development

WORKDIR /usr/src/app 
COPY package*.json ./
RUN npm install 
COPY . .

RUN npx prisma generate --schema=libs/common/src/postgresql-database/prisma/schema.prisma

RUN npm run build api-gateway

CMD ["npm", "run", "start:dev", "api-gateway"]

#-----------------------------------builder-----------------------------------
FROM node:alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate \
    --schema=libs/common/src/postgresql-database/prisma/schema.prisma

RUN npm run build api-gateway

#-----------------------------------production-----------------
FROM node:alpine as production 

WORKDIR /usr/src/app 

COPY package*.json ./
RUN npm ci --only=production


COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/libs ./libs


RUN npx prisma generate --schema=libs/common/src/postgresql-database/prisma/schema.prisma

COPY *.env* ./

EXPOSE 3000

CMD ["npm", "run", "start:prod", "api-gateway"]
