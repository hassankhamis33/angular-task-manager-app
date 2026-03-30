# Docker Development Environment - Quick Start Guide

## One-Liner Quick Start

### Development (Hot Reload)
```bash
docker-compose -f docker-compose.dev.yml up
```
Application available at: http://localhost:4200

### Production (Optimized)
```bash
docker-compose up
```
Application available at: http://localhost:4200

---

## Common Development Commands

```bash
# Start development environment with live reload
docker-compose -f docker-compose.dev.yml up

# Start in background
docker-compose -f docker-compose.dev.yml up -d

# View logs in real-time
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Run tests
docker-compose -f docker-compose.dev.yml exec app npm test

# Run linter
docker-compose -f docker-compose.dev.yml exec app npm run lint

# Install new package
docker-compose -f docker-compose.dev.yml exec app npm install <package-name>

# Rebuild images
docker-compose -f docker-compose.dev.yml build --no-cache
```

---

## Common Production Commands

```bash
# Build production image
docker-compose build

# Start production container in background
docker-compose up -d

# Check container status
docker-compose ps

# View real-time logs
docker-compose logs -f

# Stop and remove containers
docker-compose down

# Remove all volumes (clean slate)
docker-compose down -v
```

---

## File Structure

```
.
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development image
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development setup with hot reload
├── .dockerignore          # Files to ignore in Docker build
├── .env.example           # Environment variables template
├── DOCKER.md              # Detailed Docker documentation
├── nginx.conf             # Nginx server configuration
├── nginx-default.conf     # Nginx default site config
├── src/                   # Angular source code
├── dist/                  # Built application (production only)
└── node_modules/          # Dependencies (mounted volume in dev)
```

---

## Key Features

### Development (`docker-compose.dev.yml`)
✓ Hot reloading on file changes
✓ Source code mounted as volume
✓ Real-time debugging
✓ Access to test runner
✓ Full dev tools included

### Production (`docker-compose.yml`)
✓ Optimized multi-stage build
✓ Lightweight Nginx server
✓ ~40MB total image size
✓ Health checks enabled
✓ Auto-restart on failure

---

## Troubleshooting

**Q: Port 4200 already in use?**
A: Edit the port mapping in docker-compose files to use a different port (e.g., 8080:4200)

**Q: Changes not reflecting in dev?**
A: Check volume mounts are correct, restart container: `docker-compose -f docker-compose.dev.yml restart app`

**Q: Build takes too long?**
A: Use `.dockerignore` to exclude unnecessary files from build context

**Q: Need to clear everything?**
A: Run `docker-compose down -v` to remove containers and volumes

---

## Performance Tips

- Development: Uses fast file watching with 2s poll interval
- Production: Multi-stage build reduces image size by 90%
- Both: Named volumes optimize file I/O performance
- Nginx: Gzip compression reduces transfer size by ~70%

---

For detailed documentation, see [DOCKER.md](DOCKER.md)
