Microservice app for booking hotels/apartments, with elements E-commerce. using RMQ with RBAC.
Architecture CQRS.
Testing Unit(jest).
Swagger  Documentation



## Functionality.In module Auth 
- Register with validation email. with DTO/Entity
- Login.
- Resend Email with validation code
- Logout
- Reset password
- Request Password
- Verify User. In mailbox user should receive valid token during 15 min, he should visit this link.
- Verify Access user to account.


## Functionality.In module Users

- Get Profile(only logged user with cookie can see his page)
- Get AllUsers for only admin available 


## Functionality.In module Notifications 

- Registration  Send email to user
- Resend Email. Send email to user
- Request Password.  Send email to user

## Installation with docker-compose

Rename file .env.example to .env 

```bash
mv .env.example .env
```

Build project


```bash
  npm run docker:prod:build
```


Initialized Prisma 


```bash
  docker-compose -f docker-compose.dev.yaml exec auth npm run prisma:build
  docker-compose -f docker-compose.dev.yaml exec users npm run prisma:build
```

Unit tests

```bash
 npm run test:unit

```


## Modules
- api-gateway
- users (for only admin and users and etc)
- auth (registration, login, resend email, reset-password, request-resend-password and etc)
- booking 
- payment 
- Feedback. For commenting, CRUD operations. 
- notifications (SMTP module to send email to users)


## Packages/Libraries
- RabbitMQ
- PostgreSQL ORM(Prisma) 
- Redis
- Nginx
- Swagger
- Nest.js
- Mongodb
- Nodemailer
- JWT
- Throttler
- Passport.js
- Jest
- class-transformer
- class-validator



## In Future: 
- npx nx init
- Implement Shard DB
- Implement Cluster DB
- K8s
- Socket io.
- Chat module
- Elasticsearch 
- Cypress
- TensorFlow.js
- Prometheus
- AES encryption 
- Weekly newsletter with hotels recommendations
- CSRF token 
- Booking Later.
- Module Reviews to hotels 
- Module Coupons
- 2FA authentication
- Temp link for 20 minutes and after expire link deleted himself
- If you admin or editor, authorization through code. You should receive in mail box code and enter to proceed authorization
- Bash write script
- Export and import data(csv and pdf). should send to user mailbox to download data
- Integration with calender.
- Integrate api Amadeus