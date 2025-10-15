FROM node:alpine AS development

WORKDIR /usr/src/app 


COPY package*.json ./

COPY  tsconfig.json ./


RUN npm install 

COPY . .

RUN npx prisma generate --schema=libs/common/src/postgresql-database/prisma/schema.prisma

RUN npm run build notifications

CMD ["npm", "run", "start:dev", "notifications"]