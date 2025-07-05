# Build stage - for any build processes if needed in future
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files (if any build process is needed)
COPY package*.json ./

# Install dependencies (currently minimal, but ready for build process)
RUN npm install --only=production

# Copy source files
COPY . .

# Production stage with nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy static website files
COPY --from=builder /app/*.html /usr/share/nginx/html/
COPY --from=builder /app/css /usr/share/nginx/html/css
COPY --from=builder /app/js /usr/share/nginx/html/js
COPY --from=builder /app/*.json /usr/share/nginx/html/
COPY --from=builder /app/*.xml /usr/share/nginx/html/
COPY --from=builder /app/*.txt /usr/share/nginx/html/
COPY --from=builder /app/*.svg /usr/share/nginx/html/

# Copy assets directory safely (now has .gitkeep files)
COPY --from=builder /app/assets /usr/share/nginx/html/assets

# Copy custom nginx configuration
COPY config/nginx.conf /etc/nginx/nginx.conf
COPY config/default.conf /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
