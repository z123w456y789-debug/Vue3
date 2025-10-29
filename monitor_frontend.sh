#!/bin/bash
# monitor_frontend.sh - Vue3 监控脚本（包含自动提交）

echo "🚀 Vue3自动监控启动（包含自动提交）"
echo "📡 每30秒检查并提交本地更改"
echo "⏹️  按 Ctrl + C 停止监控"
echo "----------------------------------------"

while true; do
    echo "[$(date +%H:%M:%S)] 检查本地更改..."
    
    # 首先自动提交本地更改
    if git status --porcelain | grep -q .; then
        echo "🔄 发现本地更改，自动提交..."
        git add .
        git commit -m "前端自动提交: $(date '+%Y-%m-%d %H:%M:%S')"
        git push origin main
    fi
    
    # 然后检查远程更新
    echo "[$(date +%H:%M:%S)] 检查远程更新..."
    ./auto_deploy_frontend.sh
    
    echo "等待30秒..."
    sleep 30
    echo "----------------------------------------"
done
