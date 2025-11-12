# -------- build --------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

# Add DNS retry & npm configuration to prevent EAI_AGAIN
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 2 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set fetch-retry-maxtimeout 60000

RUN npm install
COPY . .

# Build frontend using Vite
RUN npx vite build

# -------- nginx --------
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
