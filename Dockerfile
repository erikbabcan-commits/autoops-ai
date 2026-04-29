# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build the PWA
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built assets to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed (optional)
# For SPA/PWA support, we need a simple redirect to index.html
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
