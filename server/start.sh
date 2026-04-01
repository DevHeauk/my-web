#!/bin/sh
echo "Waiting for database..."
sleep 3

echo "Running database migrations..."
npx prisma migrate deploy 2>/dev/null || npx prisma db push --accept-data-loss

echo "Starting server..."
exec npx pm2-runtime ecosystem.config.js
