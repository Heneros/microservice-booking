FROM node:alpine AS development

WORKDIR /usr/src/app 
COPY package*.json ./
RUN npm install 

COPY . .

RUN npx prisma generate \
    --schema=libs/common/src/postgresql-database/prisma/schema.prisma
    
RUN npm run build api-gateway
