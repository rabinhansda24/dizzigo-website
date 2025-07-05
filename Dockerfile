# Production nginx setup
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy static website files
COPY index.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY *.json /usr/share/nginx/html/
COPY *.xml /usr/share/nginx/html/
COPY *.txt /usr/share/nginx/html/
COPY *.svg /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

# Copy custom nginx configuration
COPY config/nginx.conf /etc/nginx/nginx.conf
COPY config/default.conf /etc/nginx/conf.d/default.conf

# Fix permissions for web files and required temp directories
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/cache/nginx

# Switch to nginx user
USER nginx

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
