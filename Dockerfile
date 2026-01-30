FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY dist/ ./dist/
COPY README.md LICENSE ./

RUN chmod +x dist/cli.js

RUN echo "TELEGRAM_BOT_TOKEN=your_bot_token_here" > .env.example && \
    echo "TELEGRAM_USER_ID=your_telegram_user_id" >> .env.example

ENV NODE_ENV=production
ENV OPENCODE_SERVER_URL=http://localhost:4096
ENV OPENCODE_DEFAULT_AGENT=sisyphus

VOLUME ["/root/.opencode", "/app/logs"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

CMD ["node", "dist/cli.js"]
