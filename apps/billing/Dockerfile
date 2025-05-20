FROM node:alpine AS development

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install 

COPY . .

RUN npx prisma generate \
    --schema=libs/common/src/postgresql-database/prisma/schema.prisma

RUN npm run build billing

#-----------------------------------production-----------------------------------

FROM node:alpine AS production 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --only=production

COPY . .


COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/billing/main"]