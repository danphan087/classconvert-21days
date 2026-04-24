#!/bin/bash
echo "Dang sua loi Nginx va SSE..."
cp -r f/* /opt/my-website/
cp /opt/my-website/eduscalelab_nginx.conf /etc/nginx/sites-available/eduscalelab.com
systemctl restart nginx
systemctl restart mcp-server
echo "====================================="
echo "   DA SUA XONG! VUI LONG REFRESH GoClaw"
echo "====================================="
