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

### 自动安装

插件会在启动时自动检查并安装以下依赖：

1. **tmux** - 终端复用器
2. **lumen** - TUI diff 查看器

### 手动安装（如果自动安装失败）

**tmux**:
```bash
brew install tmux
# or
apt install tmux
```

**lumen**:
```bash
brew install jnsahaj/lumen/lumen
# or
cargo install lumen
```

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

安装完成后重启 OpenCode TUI，插件会自动加载。

## 使用方法

### 通过命令

在 OpenCode TUI 中直接输入：

```bash
/diff              # 查看所有修改文件的 diff
/diff src/app.ts   # 查看指定文件的 diff
```

### 通过 LLM

LLM 可以自动调用 `view_diff` 工具来展示代码变更。无需手动操作，LLM 会根据对话上下文智能判断何时需要展示 diff。

### 查看 lumen

执行 `/diff` 后，lumen 会在 tmux 会话中运行。要查看 lumen：

```bash
tmux attach -t opencode-diff-viewer
```

**tmux 快捷键**:
- `Ctrl+B` 然后 `D` - 分离会话（回到 OpenCode）
- `Ctrl+B` 然后 `?` - 查看所有快捷键

**lumen 快捷键**:
| 快捷键 | 功能 |
|--------|------|
| `j` / `k` 或 `↑` / `↓` | 上/下移动 |
| `{` / `}` | 跳转到上/下一个变更块 |
| `Tab` | 切换侧边栏 |
| `e` | 在编辑器中打开文件 |
| `q` | 退出 |

## 故障排除

### 1. tmux 未安装

```
❌ tmux is not installed
```

**解决方案**: 手动安装 tmux（见上方手动安装）

### 2. lumen 未安装

```
❌ lumen is not installed
```

**解决方案**: 手动安装 lumen（见上方手动安装）

### 3. 没有修改的文件

```
📝 No modified files
```

**解决方案**: 确保文件已修改并暂存：
```bash
git add .
```

### 4. 插件未加载

检查全局配置文件是否正确：
```bash
cat ~/.config/opencode/opencode.json
```

## 工作原理

1. **检测依赖** - 插件启动时检查 tmux 和 lumen
2. **自动安装** - 如果未安装，自动通过 brew 或 cargo 安装
3. **创建 tmux 会话** - 执行 `/diff` 时创建后台 tmux 会话
4. **运行 lumen** - 在 tmux 会话中运行 lumen diff

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
