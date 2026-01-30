# Docker Deployment Guide

## 🐧 Quick Start with Docker

### Prerequisites

- Docker installed
- Docker Compose installed
- Telegram bot token
- Telegram user ID

---

## Method 1: Docker Compose (Recommended)

### 1. Create `.env` file

```bash
cat > .env << EOF
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_USER_ID=your_telegram_user_id
EOF
```

### 2. Start services

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f oh-my-telegram

# Stop services
docker-compose down
```

### 3. Check status

```bash
# List containers
docker-compose ps

# View logs
docker-compose logs -f
```

---

## Method 2: Docker Build & Run

### 1. Build image

```bash
docker build -t oh-my-telegram:latest .
```

### 2. Run container

```bash
docker run -d \
  --name oh-my-telegram \
  -e TELEGRAM_BOT_TOKEN=your_token \
  -e TELEGRAM_USER_ID=your_user_id \
  -v opencode-sessions:/root/.opencode \
  oh-my-telegram:latest
```

### 3. View logs

```bash
docker logs -f oh-my-telegram
```

### 4. Stop container

```bash
docker stop oh-my-telegram
docker rm oh-my-telegram
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ | - | Bot token from @BotFather |
| `TELEGRAM_USER_ID` | ✅ | - | Allowed Telegram user ID |
| `OPENCODE_SERVER_URL` | ❌ | http://localhost:4096 | Opencode server URL |
| `OPENCODE_DEFAULT_AGENT` | ❌ | sisyphus | Default AI agent |

---

## Volumes

Docker containers use these volumes:

- `opencode-sessions`: Session persistence
- `bot-logs`: Log files
- `opencode-work`: Working directory

---

## Troubleshooting

### Container not starting

```bash
# Check logs
docker-compose logs oh-my-telegram

# Check container status
docker-compose ps
```

### Permission issues

```bash
# Fix volume permissions
docker-compose exec oh-my-telegram chown -R node:node /root/.opencode
```

### Restart services

```bash
docker-compose restart
```

---

## Updating

```bash
# Pull latest code
git pull

# Rebuild
docker-compose up -d --build

# Or manually
docker-compose down
docker-compose up -d --build
```

---

## Backup & Migration

### Backup sessions

```bash
# Backup volume
docker run --rm \
  -v opencode-sessions:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/sessions-backup.tar.gz /data
```

### Restore sessions

```bash
# Restore volume
docker run --rm \
  -v opencode-sessions:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/sessions-backup.tar.gz -C /
```

### Move to another PC

1. Copy project folder
2. Copy `.env` file
3. Run `docker-compose up -d`

---

## Production Tips

### Auto-restart policy

```yaml
restart: unless-stopped
```

### Health check

```bash
docker ps
# STATUS should be "Up (healthy)"
```

### Log rotation

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

---

## Uninstall

```bash
# Stop and remove containers
docker-compose down -v

# Remove images
docker rmi eunoocho/oh-my-telegram:latest
```

---

**Questions? Check main [README.md](README.md)**
