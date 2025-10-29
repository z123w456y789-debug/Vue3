#!/bin/bash
# auto_deploy_frontend.sh - Vue3 自动部署脚本

echo "=== 开始前端自动部署 ==="
echo "时间: $(date)"

# 检查Git更新
if git fetch origin 2>/dev/null; then
    LOCAL=$(git rev-parse HEAD)
    
    # 尝试获取main分支，如果失败则尝试master分支
    if REMOTE=$(git rev-parse origin/main 2>/dev/null); then
        BRANCH="main"
    elif REMOTE=$(git rev-parse origin/master 2>/dev/null); then
        BRANCH="master"
    else
        echo "❌ 无法读取远程分支"
        exit 1
    fi
    
    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "🔄 发现新版本: ${LOCAL:0:8} -> ${REMOTE:0:8}"
        
        # 拉取更新
        git pull origin $BRANCH
        
        echo "安装依赖..."
        npm install
        
        echo "重启Vue开发服务器..."
        # 停止现有开发服务器
        pkill -f 'vue-cli-service serve' || echo "没有运行中的开发服务器"
        sleep 2
        
        # 启动开发服务器
        nohup npm run dev > vue-dev.log 2>&1 &
        
        echo "等待服务器启动..."
        sleep 8
        
        echo "✅ Vue开发服务器启动完成!"
        echo "🌐 访问地址: http://localhost:3000"
    else
        echo "✅ 代码已是最新版本"
    fi
else
    echo "🌐 网络连接失败"
fi

echo "=== 前端自动部署完成 ==="
