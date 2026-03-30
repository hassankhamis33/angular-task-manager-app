# Angular Task Manager - Docker Setup Instructions

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### Development Environment (Recommended for Development)
```bash
docker-compose -f docker-compose.dev.yml up
```
- Hot reloading enabled
- Source code mounted as volumes
- Angular dev server runs on http://localhost:4200
- Karma test runner available on port 9876

### Production Environment (Optimized Build)
```bash
docker-compose up
```
- Optimized production build
- Served by Nginx
- Application available at http://localhost:4200

---

## Development Setup

### 1. Build Development Image
```bash
docker-compose -f docker-compose.dev.yml build
```

### 2. Start Development Environment
```bash
docker-compose -f docker-compose.dev.yml up
```

The application will be available at: http://localhost:4200

Features:
- **Hot Reloading**: Changes to source files automatically reload
- **Live Reload**: Modify code in `src/` directory while container runs
- **Debug Port**: Access on http://localhost:4200
- **Test Runner**: Karma available on http://localhost:9876

### 3. Execute Commands in Development Container
```bash
# Run tests
docker-compose -f docker-compose.dev.yml exec app npm test

# Run linter
docker-compose -f docker-compose.dev.yml exec app npm run lint

# Install new packages
docker-compose -f docker-compose.dev.yml exec app npm install <package-name>
```

### 4. Stop Development Environment
```bash
docker-compose -f docker-compose.dev.yml down
```

### 5. View Development Logs
```bash
docker-compose -f docker-compose.dev.yml logs -f app
```

---

## Production Setup

### 1. Build Production Image
```bash
docker-compose build
```

### 2. Run Production Application
```bash
docker-compose up -d
```

The application will be available at: http://localhost:4200

### 3. Stop Production Application
```bash
docker-compose down
```

### 4. View Production Logs
```bash
docker-compose logs -f app
```

## Multi-stage Production Build Explanation

The production Dockerfile uses a multi-stage build process for optimization:

### Stage 1: Builder
- Uses `node:18-alpine` image
- Installs dependencies
- Builds the Angular application for production
- Creates optimized output in `dist/` folder

### Stage 2: Production
- Uses lightweight `nginx:alpine` image
- Copies only the built files from Stage 1
- Configures Nginx for SPA routing
- Sets up health checks
- Reduces final image size significantly

## Nginx Configuration

The Nginx configuration includes:
- **SPA Routing**: All requests route to index.html for Angular routing
- **Gzip Compression**: Reduces asset sizes by ~70%
- **Security Headers**: Prevents common web vulnerabilities
- **Static Asset Caching**: 1-year cache for versioned assets
- **Health Checks**: Container health monitoring

## Docker Compose Services

### Development Service (docker-compose.dev.yml)
- **Angular Dev Server**: Port 4200:4200
- **Karma Test Runner**: Port 9876:9876
- **Hot Reload**: Enabled with 2s poll interval
- **Volume Mounts**: `src/`, config files, node_modules
- **Environment**: NODE_ENV=development

### Production Service (docker-compose.yml)
- **Nginx Server**: Port 4200:80
- **Health Checks**: Every 30 seconds
- **Auto-restart**: Unless manually stopped
- **Environment**: NODE_ENV=production
- **Network**: Isolated app-network

## Image Optimization

The multi-stage build reduces image size:
- Full Node image ≈ 600MB
- Final production image ≈ 40-50MB
- No build tools in production image
- Only necessary files included

## Development vs Production Comparison

| Feature | Development | Production |
|---------|-------------|-----------|
| **Server** | Angular CLI dev server | Nginx |
| **Hot Reload** | ✓ Enabled | ✗ Disabled |
| **Source Maps** | ✓ Included | ✗ Excluded |
| **Image Size** | ~900MB | ~40-50MB |
| **Performance** | Dev-optimized | Fully optimized |
| **Port** | 4200 | 4200 (Nginx proxy) |

## Troubleshooting

### Port Already in Use
If port 4200 is already in use, modify docker-compose.yml or docker-compose.dev.yml:
```yaml
ports:
  - "8080:4200"  # For dev
  # OR
  - "8080:80"    # For production
```

### Build Issues
```bash
# For development
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml build --no-cache

# For production
docker-compose down -v
docker-compose build --no-cache
```

### Container Won't Start
```bash
# Check logs for detailed error messages
docker-compose -f docker-compose.dev.yml logs app

# Or for production
docker-compose logs app
```

### Hot Reload Not Working
- Ensure volume mounts are correct
- Check that polling interval is set to 2000ms
- Verify file system watching is supported on your OS
- Restart container: `docker-compose -f docker-compose.dev.yml restart app`

### Tests Won't Run
```bash
# Clear karma cache and run with verbose output
docker-compose -f docker-compose.dev.yml exec app npm test -- --no-cache --browsers=ChromeHeadless
```

## Environment Variables

### Development (.env.dev)
```
NODE_ENV=development
ANGULAR_CLI_ANALYTICS=false
```

### Production (.env.prod)
```
NODE_ENV=production
```

## Docker Commands Reference

### Development
```bash
# Build and start
docker-compose -f docker-compose.dev.yml up --build

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache

# Stop and remove
docker-compose -f docker-compose.dev.yml down

# Remove volumes (clean slate)
docker-compose -f docker-compose.dev.yml down -v

# Run specific command
docker-compose -f docker-compose.dev.yml exec app <command>

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production
```bash
# Build and start
docker-compose up --build -d

# Rebuild without cache
docker-compose build --no-cache

# Stop and remove
docker-compose down

# Restart
docker-compose restart

# View logs
docker-compose logs -f
```

## Performance Tips

### Development
1. Use named volumes for `node_modules` to improve performance
2. Set polling interval to match your system (2000ms is default)
3. Consider using WSL2 on Windows for better file system performance

### Production
1. Use multi-stage build to minimize final image size
2. Enable gzip compression in Nginx (configured)
3. Set cache headers for static assets (configured)
4. Use health checks to monitor container status (configured)
```

### Check Container Status
```bash
docker ps  # List running containers
docker logs angular-task-manager  # View logs
```
