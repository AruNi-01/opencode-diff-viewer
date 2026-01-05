# OpenCode Diff Viewer Plugin

[![npm version](https://img.shields.io/npm/v/opencode-diff-viewer.svg)](https://www.npmjs.com/package/opencode-diff-viewer)
[![npm downloads](https://img.shields.io/npm/dm/opencode-diff-viewer.svg)](https://www.npmjs.com/package/opencode-diff-viewer)

一个 OpenCode 插件，使用 [lumen](https://github.com/jnsahaj/lumen) + [tmux](https://github.com/tmux/tmux) 提供美观的 TUI diff 查看功能。

## 功能特性

- ✨ **自动安装 tmux 和 lumen** - 插件会自动检测并安装依赖
- 🚀 **一键查看 diff** - 使用 `/diff` 命令快速查看代码变更
- 🔧 **tmux 集成** - 在后台 tmux 会话中运行 lumen
- 🤖 **LLM 工具集成** - LLM 可自动调用 `view_diff` 工具

## 前置条件

### 安装 tmux

如果未安装 tmux，请先安装：

```bash
brew install tmux
# or
apt install tmux
```

lumen 会在插件启动时自动安装。

## 使用流程

### 第 1 步：用 tmux 启动 OpenCode

```bash
# 创建 tmux 会话并启动 OpenCode
tmux new -s opencode -d && tmux send-keys -t opencode 'opencode' Enter
```

然后进入 tmux 会话查看 OpenCode：

```bash
tmux attach -t opencode
```

### 第 2 步：在 OpenCode 中使用 /diff

在 OpenCode TUI 中输入：

```bash
/diff              # 查看所有修改文件的 diff
/diff src/app.ts   # 查看指定文件的 diff
```

### 第 3 步骤：查看 lumen diff

执行 `/diff` 后，lumen 会在 tmux 会话 `opencode-diff-viewer` 中运行。

**新开一个终端窗口**，运行：

```bash
tmux attach -t opencode-diff-viewer
```

查看 lumen diff。

### tmux 快捷键

在 tmux 中：

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+B` 然后 `D` | 分离会话（回到终端） |
| `Ctrl+B` 然后 `?` | 查看所有快捷键 |
| `Ctrl+C` | 终止当前会话 |

**lumen 快捷键**:
| 快捷键 | 功能 |
|--------|------|
| `j` / `k` 或 `↑` / `↓` | 上/下移动 |
| `{` / `}` | 跳转到上/下一个变更块 |
| `Tab` | 切换侧边栏 |
| `e` | 在编辑器中打开文件 |
| `q` | 退出 |

## 安装（全局配置）

### 1. 安装 npm 包

```bash
# npm
npm install -g opencode-diff-viewer

# pnpm
pnpm add -g opencode-diff-viewer

# bun
bun add -g opencode-diff-viewer
```

### 2. 配置全局 opencode.json

创建或编辑 `~/.config/opencode/opencode.json`：

```bash
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/opencode.json << 'EOF'
{
  "command": {
    "diff": {
      "template": "View git diff using lumen in tmux.",
      "description": "View diff of modified files using lumen TUI"
    }
  },
  "plugin": ["opencode-diff-viewer"]
}
EOF
```

### 3. 重启 OpenCode

安装完成后重启 OpenCode TUI（在 tmux 中），插件会自动加载。

## 完整使用示例

```bash
# 1. 安装插件
npm install -g opencode-diff-viewer

# 2. 配置 OpenCode
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/opencode.json << 'EOF'
{
  "command": {
    "diff": {
      "template": "View git diff using lumen in tmux.",
      "description": "View diff of modified files using lumen TUI"
    }
  },
  "plugin": ["opencode-diff-viewer"]
}
EOF

# 3. 用 tmux 启动 OpenCode
tmux new -s opencode -d && tmux send-keys -t opencode 'opencode' Enter

# 4. 进入 tmux 会话
tmux attach -t opencode

# 5. 在 OpenCode 中使用 /diff 命令
# /diff

# 6. 新终端窗口查看 lumen
tmux attach -t opencode-diff-viewer
```

## 故障排除

### 1. tmux 未安装

```bash
brew install tmux
```

### 2. lumen 未安装

插件会自动安装。如果失败，手动安装：

```bash
brew install jnsahaj/lumen/lumen
# or
cargo install lumen
```

### 3. 没有修改的文件

```
📝 No modified files
```

**解决方案**: 确保文件已修改并暂存：

```bash
git add .
```

### 4. 插件未加载

检查配置：

```bash
cat ~/.config/opencode/opencode.json
```

## 工作原理

1. **tmux 启动 OpenCode** - OpenCode 在 tmux 会话中运行
2. **插件自动安装依赖** - 检查并安装 tmux 和 lumen
3. **执行 /diff** - 创建新的 tmux 会话 "opencode-diff-viewer"
4. **运行 lumen** - 在 tmux 会话中显示 diff

## 项目结构

```
opencode-diff-viewer/
├── src/
│   ├── index.ts           # 插件主逻辑
│   └── command-diff.md    # /diff 命令定义
├── dist/                  # 编译输出（发布用）
├── package.json           # npm 配置
└── tsconfig.json          # TypeScript 配置
```

## 开发

### 本地开发

```bash
# 克隆项目
git clone https://github.com/AruNi-01/opencode-diff-viewer.git
cd opencode-diff-viewer

# 安装依赖
npm install

# 构建
npm run build

# 链接本地包
npm link -g opencode-diff-viewer
```

### 发布新版本

```bash
# 更新版本号
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0

# 发布
npm publish
```

## 依赖

- [tmux](https://github.com/tmux/tmux) - 终端复用器
- [lumen](https://github.com/jnsahaj/lumen) - TUI Diff 查看器
- [@opencode-ai/plugin](https://www.npmjs.com/package/@opencode-ai/plugin) - OpenCode 插件 SDK

## License

MIT

## 作者

[AarynLu](https://github.com/AruNi-01)
