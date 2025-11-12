# ---- build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for caching
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy app source
COPY . .

# Run vite build explicitly with npx
RUN npx vite build

# ---- production stage ----
FROM nginx:1.27-alpine

# Copy built files to nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
