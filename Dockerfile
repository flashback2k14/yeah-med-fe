# ---------- Stage 1: Build ----------
FROM node:current-alpine AS build
WORKDIR /app

# 1) Cache deps
COPY package*.json ./
# NOTE: Angular needs devDependencies to build
RUN npm ci --legacy-peer-deps

# 2) Build
COPY . .
# Build in prod mode; add --output-path if you use a custom dist dir
RUN npm run build

# ---------- Stage 2: Runtime (Nginx, non-root) ----------
FROM nginx:1.27-alpine AS runtime

# Clean default site
RUN rm -rf /usr/share/nginx/html/*

# Copy build output (works for both v16 and v17+ output layouts)
COPY --from=build /app/dist/yeah-med-fe/browser /usr/share/nginx/html/

# Minimal SPA config + non-root port
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

# Use a high port so non-root can bind without extra caps
# USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
