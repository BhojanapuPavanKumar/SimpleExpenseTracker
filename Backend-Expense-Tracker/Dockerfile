# -------- base builder --------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# optional: run tests here
# RUN npm test

# -------- runtime --------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
# expose port your app uses (e.g., 4000)
EXPOSE 4000
# app reads config from env at runtime
CMD ["node", "app.js"]
