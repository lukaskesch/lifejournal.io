#!/bin/bash

# Check if script is run with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "Please run with sudo"
    exit 1
fi

# Get the current working directory
WORKING_DIR=$(pwd)

# Create the service file content
cat > focus-app.service << EOL
[Unit]
Description=Focus App Docker Compose Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${WORKING_DIR}
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target
EOL

# Move the service file to systemd directory
mv focus-app.service /etc/systemd/system/

# Set proper permissions
chmod 644 /etc/systemd/system/focus-app.service

# Reload systemd daemon
systemctl daemon-reload

# Enable and start the service
systemctl enable focus-app.service
systemctl start focus-app.service

echo "Service has been created and started successfully!"
echo "You can check the status with: systemctl status focus-app.service"
