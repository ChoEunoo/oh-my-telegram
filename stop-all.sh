#!/bin/bash

echo "🛑 Stopping all oh-my-telegram services..."

pkill -f "opencode serve"
pkill -f "opencode web"
pkill -f "node.*cli.js"

echo "✅ All services stopped"
echo ""
echo "🔍 Check remaining:"
ps aux | grep -E "opencode|node.*cli.js" | grep -v grep || echo "   None running"
