# Deployment Documentation - Digi Metalomecanica Frontend

## Overview

This documentation covers the complete CI/CD setup for deploying the Digi Metalomecanica frontend application with dual-environment configuration: staging and production.

## Architecture

- **Staging Environment**: `develop` branch → Direct access on port 8089
- **Production Environment**: `main` branch → `https://backoffice.filipemetalomecanica.pt` via Nginx reverse proxy on port 8087

## Prerequisites

- AWS EC2 instance with Docker and Nginx installed
- Domain `filipemetalomecanica.pt` managed by Amen
- SSL certificates for `backoffice.filipemetalomecanica.pt`
- CircleCI account configured for CI/CD
- Docker Hub account for image registry

## 1. Project Structure

```
digi-metalomec-fe/
├── .circleci/
│   └── config.yml                  # CircleCI configuration
├── Dockerfile/
│   ├── prod/
│   │   └── Dockerfile              # Production Dockerfile
│   └── staging/
│       └── Dockerfile              # Staging Dockerfile
├── docker-compose.yml              # Production compose file
├── docker-compose-staging.yml      # Staging compose file
├── app/                            # Next.js application
└── DEPLOYMENT.md                   # This file
```

## 2. Docker Configuration

### Production Setup

- **File**: `docker-compose.yml`
- **Image**: `gic2luis/digi-metalomec-fe-v1:prod`
- **Container**: `digi-metalomec-fe-v1-prod`
- **Port**: `8087:80`
- **Environment**: `NODE_ENV=production`

### Staging Setup

- **File**: `docker-compose-staging.yml`
- **Image**: `gic2luis/digi-metalomec-fe-v1:staging`
- **Container**: `digi-metalomec-fe-staging`
- **Port**: `8089:80`
- **Environment**: `NODE_ENV=staging`

## 3. DNS Configuration (Amen)

### Create A Record for Production Subdomain

In your Amen DNS management panel:

- **Type**: A Record
- **Name**: `backoffice`
- **Value**: Your EC2 instance public IP address
- **TTL**: 300 (or default)

This creates: `backoffice.filipemetalomecanica.pt` → Your EC2 IP

## 4. SSL Certificate Setup

### Certificate Files Required

Upload these files to your EC2 instance at `/home/ec2-user/`:

```
/home/ec2-user/backoffice-metalomec-certificate.crt     # Main certificate
/home/ec2-user/backoffice-metalomec-private.key         # Private key
/home/ec2-user/backoffice-metalomec-ca_bundle.crt       # Certificate authority bundle
```

### Installing Certificates

1. Upload certificates to your EC2 instance:

```bash
scp backoffice-metalomec-certificate.crt ec2-user@your-server:/home/ec2-user/
scp backoffice-metalomec-private.key ec2-user@your-server:/home/ec2-user/
scp backoffice-metalomec-ca_bundle.crt ec2-user@your-server:/home/ec2-user/
```

2. Set proper permissions:

```bash
sudo chmod 644 /home/ec2-user/backoffice-metalomec-certificate.crt
sudo chmod 600 /home/ec2-user/backoffice-metalomec-private.key
sudo chmod 644 /home/ec2-user/backoffice-metalomec-ca_bundle.crt
```

## 5. Nginx Configuration

### Add Server Blocks for Production Subdomain

Edit `/etc/nginx/nginx.conf` and add these server blocks before the closing `}` of the `http` block:

```nginx
    # HTTP server block for backoffice.filipemetalomecanica.pt (redirects to HTTPS)
    server {
        listen       80;
        listen       [::]:80;
        server_name  backoffice.filipemetalomecanica.pt;

        # Redirect all HTTP requests to HTTPS
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server block for backoffice.filipemetalomecanica.pt
    server {
        listen       443 ssl;
        listen       [::]:443 ssl;
        server_name  backoffice.filipemetalomecanica.pt;
        root         /usr/share/nginx/html;

        location / {
            proxy_pass http://localhost:8087;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 86400;
        }

        # SSL certificate paths
        ssl_certificate /home/ec2-user/backoffice-metalomec-certificate.crt;
        ssl_certificate_key /home/ec2-user/backoffice-metalomec-private.key;
        ssl_trusted_certificate /home/ec2-user/backoffice-metalomec-ca_bundle.crt;

        # SSL configuration
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout 10m;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers on;
        ssl_ecdh_curve secp384r1;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-XSS-Protection "1; mode=block";

        # OCSP stapling
        ssl_stapling on;
        ssl_stapling_verify on;
        resolver 8.8.8.8 8.8.4.4 valid=300s;
        resolver_timeout 5s;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```

### Test and Reload Nginx

```bash
# Test configuration
sudo nginx -t

# Reload if test passes
sudo systemctl reload nginx
```

## 6. AWS Security Groups

Ensure your EC2 security group allows these ports:

- **Port 22** (SSH) - For deployment access
- **Port 80** (HTTP) - For HTTP to HTTPS redirect
- **Port 443** (HTTPS) - For SSL traffic
- **Port 8087** (Production App) - Internal Docker container access
- **Port 8089** (Staging App) - Optional for direct staging access

## 7. CircleCI Environment Variables

### Required Environment Variables

Set these in your CircleCI project settings under **Project Settings → Environment Variables**:

#### Staging Variables:

```
NEXTAUTH_SECRET_STAGING=your_staging_nextauth_secret
NEXT_PUBLIC_API_URL_STAGING=https://your-staging-api-url
NEXTAUTH_URL_STAGING=https://your-staging-url-or-ip:8089
SSH_USER_STAGING=ec2-user
SSH_HOST_STAGING=your-staging-server-ip
```

#### Production Variables:

```
NEXTAUTH_SECRET_PROD=your_production_nextauth_secret
NEXT_PUBLIC_API_URL_PROD=https://your-production-api-url
NEXTAUTH_URL_PROD=https://backoffice.filipemetalomecanica.pt
SSH_USER_PROD=ec2-user
SSH_HOST_PROD=your-production-server-ip
```

#### Docker Registry Variables:

```
DOCKERHUB_USER=your_dockerhub_username
DOCKERHUB_PASS=your_dockerhub_password_or_token
```

## 8. Deployment Flow

### Staging Deployment (develop branch):

1. **Trigger**: Push to `develop` branch
2. **Build**: CircleCI builds staging image with tag `:staging`
3. **Deploy**: Container deployed to port 8089 on staging server
4. **Access**: Direct access via `http://staging-server-ip:8089`

### Production Deployment (main branch):

1. **Trigger**: Push to `main` branch
2. **Build**: CircleCI builds production image with tag `:prod`
3. **Deploy**: Container deployed to port 8087 on production server
4. **Access**: Public access via `https://backoffice.filipemetalomecanica.pt`

## 9. CircleCI Pipeline Jobs

### Build Jobs:

- **build-staging**: Builds and pushes staging Docker image
- **build-production**: Builds and pushes production Docker image

### Deploy Jobs:

- **deploy-staging**: SSH deployment to staging server
- **deploy-production**: SSH deployment to production server with Nginx proxy

### Workflow Configuration:

- **deploy-staging**: Runs only on `develop` branch
- **deploy-production**: Runs only on `main` branch

## 10. Troubleshooting

### Check Deployment Status:

```bash
# Check CircleCI pipeline status in the web interface
# Check container status on server
docker ps
docker logs digi-metalomec-fe-v1-prod
docker logs digi-metalomec-fe-staging
```

### Check Nginx Status:

```bash
sudo systemctl status nginx
sudo nginx -t
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Check SSL Certificate:

```bash
openssl x509 -in /home/ec2-user/backoffice-metalomec-certificate.crt -text -noout
openssl s_client -connect backoffice.filipemetalomecanica.pt:443
```

### Common Issues:

#### SSH Connection Failed:

- Verify SSH key is added to CircleCI project
- Check SSH_USER and SSH_HOST environment variables
- Ensure EC2 security group allows SSH (port 22)

#### Container Start Failed:

- Check environment variables are set correctly
- Verify Docker image was built and pushed successfully
- Check container logs for application errors

#### SSL Certificate Issues:

- Verify certificate files exist and have correct permissions
- Check certificate expiration date
- Ensure domain matches certificate CN/SAN

#### Application Not Loading:

- Verify Nginx is running and configured correctly
- Check if container is running on correct port
- Verify DNS A record points to correct IP

## 11. Monitoring & Maintenance

### Health Checks:

- **Production**: Monitor `https://backoffice.filipemetalomecanica.pt`
- **Staging**: Monitor staging server directly
- **SSL**: Set up SSL certificate expiration monitoring
- **Containers**: Monitor Docker container status and logs

### Certificate Renewal:

When SSL certificates expire:

1. Obtain new certificates from your SSL provider
2. Replace the three certificate files on the server
3. Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Log Rotation:

Configure log rotation for:

- Nginx access/error logs
- Docker container logs
- Application logs

## 12. Security Considerations

- SSL certificates with strong cipher suites
- Security headers configured in Nginx
- HTTPS redirect for all HTTP traffic
- Regular security updates for EC2 instance
- Restricted security group access
- SSH key-based authentication only

## 13. Backup Strategy

### Application Code:

- Source code backed up in Git repository
- Docker images stored in Docker Hub registry

### Configuration:

- Nginx configuration backed up
- Environment variables documented
- SSL certificates backed up securely

### Database:

- Ensure backend API database backups are configured separately

---

## Quick Reference Commands

### Deploy to Staging:

```bash
git checkout develop
git push origin develop
# Monitor CircleCI pipeline
```

### Deploy to Production:

```bash
git checkout main
git merge develop  # or cherry-pick specific commits
git push origin main
# Monitor CircleCI pipeline
```

### Manual Container Management:

```bash
# Production
docker stop digi-metalomec-fe-v1-prod
docker rm digi-metalomec-fe-v1-prod
docker pull gic2luis/digi-metalomec-fe-v1:prod
# Run with production environment variables...

# Staging
docker stop digi-metalomec-fe-staging
docker rm digi-metalomec-fe-staging
docker pull gic2luis/digi-metalomec-fe-v1:staging
# Run with staging environment variables...
```

---

This deployment setup provides a robust, secure, and scalable CI/CD pipeline with proper environment separation and SSL-secured production access.
