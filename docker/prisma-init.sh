#!/bin/sh

until nc -z postgres 5432; do
  echo "⏳ Waiting for postgres..."
  sleep 1
done

echo "Postgres is up — running migrations"

npx prisma migrate deploy \
    --schema=libs/common/src/postgresql-database/prisma/schema.prisma

echo "🚀 Starting application"
exec "$@"
