#!/bin/bash

# Copy the new nginx config to the correct location
cp /opt/my-website/eduscalelab_nginx.conf /etc/nginx/sites-available/eduscalelab.com
ln -sf /etc/nginx/sites-available/eduscalelab.com /etc/nginx/sites-enabled/

# Test and restart nginx
nginx -t && systemctl restart nginx

echo "--- NGINX RESTARTED ---"
echo "Public URL is now available at http://eduscalelab.com/mcp-api/sse"
