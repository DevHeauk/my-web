FROM node:20-alpine AS builder

WORKDIR /app

COPY server/package*.json ./
RUN npm ci

COPY server/prisma ./prisma
RUN npx prisma generate

COPY server/src ./src
COPY server/tsconfig.json ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY server/prisma ./prisma

EXPOSE 4000

CMD ["sh", "-c", "timeout 30 npx prisma db push --accept-data-loss --skip-generate || true; node dist/index.js"]
