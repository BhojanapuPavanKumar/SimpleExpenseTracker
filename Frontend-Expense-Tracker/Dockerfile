# -------- build --------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install   # <-- change from npm ci
COPY . .
RUN npm run build

# -------- nginx --------
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
