#!/bin/bash

# OpenCode Diff Viewer - 启动脚本
# 自动在 tmux 中启动 OpenCode

set -e

SESSION_NAME="opencode"

# 检查 tmux 是否安装
if ! command -v tmux &> /dev/null; then
    echo "❌ tmux 未安装，正在安装..."
    if command -v brew &> /dev/null; then
        brew install tmux
    else
        echo "❌ 请先安装 tmux: brew install tmux"
        exit 1
    fi
fi

# 检查 OpenCode 是否安装
if ! command -v opencode &> /dev/null; then
    echo "❌ OpenCode 未安装"
    exit 1
fi

# 检查是否有正在运行的 OpenCode 会话
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "📎 已存在 OpenCode 会话，正在附加..."
    tmux attach-session -t "$SESSION_NAME"
else
    echo "🚀 在 tmux 中启动 OpenCode..."
    tmux new-session -d -s "$SESSION_NAME" "opencode"
    echo "✅ OpenCode 已在 tmux 会话 '${SESSION_NAME}' 中启动"
    echo ""
    echo "下一步:"
    echo "  1. 运行: tmux attach -t ${SESSION_NAME}"
    echo "  2. 在 OpenCode 中使用 /diff 命令查看代码变更"
    echo "  3. lumen 会在后台 tmux 会话 'opencode-diff-viewer' 中运行"
    echo ""
    echo "tmux 快捷键:"
    echo "  Ctrl+B 然后 D - 分离会话"
    echo "  Ctrl+B 然后 ? - 查看帮助"
    echo ""
    tmux attach-session -t "$SESSION_NAME"
fi
