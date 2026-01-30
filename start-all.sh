#!/bin/bash

echo "🚀 Starting oh-my-telegram services..."

echo "🛑 Stopping existing processes..."
pkill -f "opencode serve" 2>/dev/null
pkill -f "opencode web" 2>/dev/null
pkill -f "node.*cli.js" 2>/dev/null
sleep 2

echo "▶️  Starting opencode serve (port 4096)..."
nohup opencode serve --port 4096 > /tmp/opencode-server.log 2>&1 &
SERVE_PID=$!
echo "   PID: $SERVE_PID"

sleep 3

echo "▶️  Starting opencode web (port 55986)..."
nohup opencode web > /tmp/opencode-web.log 2>&1 &
WEB_PID=$!
echo "   PID: $WEB_PID"

sleep 2

echo "▶️  Starting oh-my-telegram bot..."
cd /Users/eunoo/projects/oh-my-telegram
nohup node dist/cli.js > /tmp/oh-my-telegram/bot.log 2>&1 &
BOT_PID=$!
echo "   PID: $BOT_PID"

echo ""
echo "✅ All services started!"
echo ""
echo "📊 PIDs:"
echo "   opencode serve: $SERVE_PID"
echo "   opencode web:   $WEB_PID"
echo "   telegram bot:   $BOT_PID"
echo ""
echo "📝 Logs:"
echo "   opencode server: tail -f /tmp/opencode-server.log"
echo "   opencode web:   tail -f /tmp/opencode-web.log"
echo "   telegram bot:    tail -f /tmp/oh-my-telegram/bot.log"
echo ""
echo "🌐 Web UI: http://127.0.0.1:55986/"
echo ""
echo "🛑 Stop all: pkill -f 'opencode|node.*cli.js'"
