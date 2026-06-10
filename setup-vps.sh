#!/bin/bash
# WeeklyNaukri.com VPS Deployment Script
# Targets Ubuntu 22.04 / 24.04 LTS

set -e

# Update and upgrade system packages
echo "=== Updating System Packages ==="
sudo apt-get update -y

# Install git, curl, and build tools
echo "=== Installing Essential Tools ==="
sudo apt-get install -y git curl build-essential tar unzip

# Install Node.js v20
echo "=== Installing Node.js v20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node and npm installations
node -v
npm -v

# Install Nginx
echo "=== Installing Nginx ==="
sudo apt-get install -y nginx

# Install PM2 globally
echo "=== Installing PM2 ==="
sudo npm install -g pm2

# Clone / Update repository
TARGET_DIR="/var/www/weeklynaukri"
echo "=== Deploying Code to $TARGET_DIR ==="

if [ ! -d "$TARGET_DIR" ]; then
    sudo git clone https://github.com/Rohitgora09/weeklynaukri.git "$TARGET_DIR"
else
    cd "$TARGET_DIR"
    sudo git fetch origin
    sudo git reset --hard origin/main
fi

# Change owner to current user for building and npm installing
sudo chown -R $USER:$USER "$TARGET_DIR"
cd "$TARGET_DIR"

# Install app dependencies
echo "=== Installing Project Dependencies ==="
npm install

# Install Puppeteer system dependencies for headless Chrome
echo "=== Installing Puppeteer Dependencies ==="
npx puppeteer browsers install chrome --install-deps || {
    # Fallback manual install for Ubuntu 24.04 and 22.04 if the command fails
    echo "=== Falling back to manual package installation ==="
    sudo apt-get install -y ca-certificates fonts-liberation libasound2t64 libatk1.0-0t64 libatk-bridge2.0-0t64 libc6 libcairo2 libcups2t64 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc-s1 libglib2.0-0t64 libgtk-3-0t64 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils || true
}

# Build the Vite React Frontend
echo "=== Building Frontend ==="
npm run build

# Start the Node.js API with PM2
echo "=== Starting Backend API ==="
pm2 delete weeklynaukri-api 2>/dev/null || true
pm2 start backend/server.js --name "weeklynaukri-api"
pm2 save

# Setup PM2 startup script
echo "=== Setting up PM2 Startup ==="
pm2 startup | tail -n 1 | bash || true
pm2 save

# Set up Nginx Config
echo "=== Configuring Nginx ==="
NGINX_CONF="/etc/nginx/sites-available/weeklynaukri"

sudo tee "$NGINX_CONF" > /dev/null << 'EOF'
server {
    listen 80;
    server_name weeklynaukri.com www.weeklynaukri.com;

    root /var/www/weeklynaukri/dist;
    index index.html;

    # Serve built Vite frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the Nginx site
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/

# Test Nginx and restart
sudo nginx -t
sudo systemctl restart nginx

# Install Let's Encrypt Certbot
echo "=== Installing Certbot for SSL ==="
sudo apt-get install -y certbot python3-certbot-nginx

echo ""
echo "========================================================================"
echo " Deployment script completed successfully!"
echo " Next steps:"
echo " 1. Make sure your domain DNS A records point to this VPS IP address."
echo " 2. Run the following command to install SSL certificates (HTTPS):"
echo "    sudo certbot --nginx -d weeklynaukri.com -d www.weeklynaukri.com"
echo "========================================================================"
