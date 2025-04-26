FROM node:20 as builder

WORKDIR /usr/src/app 
COPY package*.json ./
RUN npm ci 

COPY . .

RUN npx prisma generate \
    --schema=libs/common/src/postgresql-database/prisma/schema.prisma

RUN npm run build auth


#-----------------------------------development-----------------------------------
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .
# COPY package*.json ./


RUN npm ci

COPY docker/prisma-init.sh /usr/src/app/prisma-init.sh

RUN chmod +x /usr/src/app/prisma-init.sh

ENTRYPOINT ["/usr/src/app/prisma-init.sh"]

CMD ["npm", "run", "start:dev", "auth"]

