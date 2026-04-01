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
RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY server/prisma ./prisma
COPY server/ecosystem.config.js ./
COPY server/start.sh ./

RUN chmod +x start.sh

EXPOSE 4000

CMD ["./start.sh"]
