FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NUXT_PUBLIC_API_BASE=/api/v1
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_ENV=production
ENV NUXT_API_BASE=http://api:8000/api/v1

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
