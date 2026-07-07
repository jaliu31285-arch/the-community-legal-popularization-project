#!/bin/bash
# 法润青苗网站 - 云服务器一键部署脚本

echo "======================================"
echo "  法润青苗 - 云服务器部署脚本"
echo "======================================"

# 1. 更新系统
echo ""
echo "[1/6] 更新系统..."
apt update && apt upgrade -y

# 2. 安装 Node.js
echo ""
echo "[2/6] 安装 Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. 安装 PM2（进程管理器）
echo ""
echo "[3/6] 安装 PM2..."
npm install -g pm2

# 4. 创建网站目录
echo ""
echo "[4/6] 创建网站目录..."
mkdir -p /var/www/farunqingmiao

# 5. 安装项目依赖
echo ""
echo "[5/6] 安装项目依赖..."
cd /var/www/farunqingmiao
npm install

# 6. 构建前端并启动服务
echo ""
echo "[6/6] 构建前端并启动服务..."
npm run build
pm2 start npm --name "farunqingmiao" -- run server

# 设置开机自启
pm2 startup
pm2 save

echo ""
echo "======================================"
echo "  部署完成！"
echo "======================================"
echo ""
echo "网站地址: http://你的服务器IP:3001"
echo "后台管理: http://你的服务器IP:3001/admin/login"
echo ""
echo "常用命令:"
echo "  pm2 status          # 查看服务状态"
echo "  pm2 restart all     # 重启服务"
echo "  pm2 logs            # 查看日志"