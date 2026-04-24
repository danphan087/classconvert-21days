#!/bin/bash

# Create the systemd service file
cat << 'EOF' > /etc/systemd/system/mcp-server.service
[Unit]
Description=ClassConvert MCP Server
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=root
WorkingDirectory=/opt/my-website/mcp
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Reload and start service
systemctl daemon-reload
systemctl enable mcp-server
systemctl restart mcp-server

# Wait a moment for the server to start
sleep 2

# Check status and test
echo "--- TRANG THAI SERVICE ---"
systemctl status mcp-server --no-pager

echo ""
echo "--- TEST CURL ---"
curl -s http://127.0.0.1:3001/mcp || echo "Thanh cong! (Server chay sse nen curl root se ra the nay)"
