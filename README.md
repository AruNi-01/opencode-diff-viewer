# OpenCode Diff Viewer Plugin

[![npm version](https://img.shields.io/npm/v/opencode-diff-viewer.svg)](https://www.npmjs.com/package/opencode-diff-viewer)
[![npm downloads](https://img.shields.io/npm/dm/opencode-diff-viewer.svg)](https://www.npmjs.com/package/opencode-diff-viewer)

一个 OpenCode 插件，使用 [lumen](https://github.com/jnsahaj/lumen) + [tmux](https://github.com/tmux/tmux) 提供美观的 TUI diff 查看功能。

## 功能特性

- ✨ **自动安装 tmux 和 lumen** - 插件会自动检测并安装依赖
- 🚀 **一键查看 diff** - 使用 `/diff` 命令快速查看代码变更
- 🔧 **tmux 集成** - 在后台 tmux 会话中运行 lumen
- 🤖 **LLM 工具集成** - LLM 可自动调用 `view_diff` 工具

## 快速开始

### 1. 安装插件

```bash
# npm
npm install -g opencode-diff-viewer

# pnpm
pnpm add -g opencode-diff-viewer

# bun
bun add -g opencode-diff-viewer
```

### 2. 配置 OpenCode

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

### 3. 启动 OpenCode（使用启动脚本）

```bash
# 使用启动脚本自动在 tmux 中启动 OpenCode
opencode-diff-viewer

# 或手动运行
./start-opencode.sh
```

启动脚本会自动：
- 检查并安装 tmux（如果未安装）
- 在 tmux 会话中启动 OpenCode
- 附加到 tmux 会话

## 使用方法

### 在 OpenCode 中使用 /diff

在 OpenCode TUI 中输入：

```bash
/diff              # 查看所有修改文件的 diff
/diff src/app.ts   # 查看指定文件的 diff
```

执行后，lumen 会在 tmux 会话 `opencode-diff-viewer` 中运行。

### 查看 lumen diff

**新开一个终端窗口**，运行：

```bash
tmux attach -t opencode-diff-viewer
```

查看完成后，按 `Ctrl+B` 然后 `D` 分离 tmux 会话，回到 OpenCode。

## tmux 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+B` 然后 `D` | 分离会话（回到终端） |
| `Ctrl+B` 然后 `?` | 查看所有快捷键 |
| `Ctrl+C` | 终止当前会话 |

## lumen 快捷键

| 快捷键 | 功能 |
|--------|------|
| `j` / `k` 或 `↑` / `↓` | 上/下移动 |
| `{` / `}` | 跳转到上/下一个变更块 |
| `Tab` | 切换侧边栏 |
| `e` | 在编辑器中打开文件 |
| `q` | 退出 |

## 前置条件

### tmux

启动脚本会自动安装 tmux。如果失败，手动安装：

```bash
brew install tmux
# or
apt install tmux
```

### lumen

插件会自动安装 lumen。如果失败，手动安装：

```bash
brew install jnsahaj/lumen/lumen
# or
cargo install lumen
```

## 故障排除

### 1. 没有修改的文件

```
📝 No modified files
```

**解决方案**: 确保文件已修改并暂存：

```bash
git add .
```

### 2. 插件未加载

检查配置：

```bash
cat ~/.config/opencode/opencode.json
```

### 3. tmux 会话丢失

重新运行启动脚本：

```bash
opencode-diff-viewer
```

## 工作原理

1. **启动脚本** - 用 tmux new-session 启动 OpenCode
2. **插件加载** - 在 OpenCode 启动时自动加载
3. **自动安装依赖** - 检查并安装 tmux 和 lumen
4. **执行 /diff** - 创建新的 tmux 会话 "opencode-diff-viewer"
5. **运行 lumen** - 在 tmux 会话中显示 diff

## 项目结构

```
opencode-diff-viewer/
├── start-opencode.sh      # 启动脚本
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
