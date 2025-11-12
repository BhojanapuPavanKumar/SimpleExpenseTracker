# -------- build --------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite build
RUN npm run build

# -------- nginx --------
FROM nginx:1.27-alpine
# default Vite build output folder "dist"
COPY --from=builder /app/dist /usr/share/nginx/html
# (optional) custom NGINX conf with SPA fallback
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
