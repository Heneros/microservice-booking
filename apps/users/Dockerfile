FROM node:alpine AS development

WORKDIR /usr/src/app 
COPY package*.json ./
COPY  tsconfig.json ./
RUN npm install 
COPY . .

RUN npx prisma generate --schema=libs/common/src/postgresql-database/prisma/schema.prisma

RUN npm run build users

CMD ["npm", "run", "start:dev", "users"]

#-----------------------------------builder-----------------------------------
FROM node:alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate \
    --schema=libs/common/src/postgresql-database/prisma/schema.prisma

RUN npm run build users

#-----------------------------------production-----------------
FROM node:alpine as production 

WORKDIR /usr/src/app 

COPY package*.json ./
RUN npm ci --only=production


COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/libs ./libs


RUN npx prisma generate --schema=libs/common/src/postgresql-database/prisma/schema.prisma

COPY *.env* ./

CMD ["npm", "run", "start:prod", "users"]
