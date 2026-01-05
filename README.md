# OpenCode Diff Viewer Plugin

[![npm version](https://img.shields.io/npm/v/opencode-diff-viewer.svg)](https://www.npmjs.com/package/opencode-diff-viewer)
[![npm downloads](https://img.shields.io/npm/dm/opencode-diff-viewer.svg)](https://www.npmjs.com/package/opencode-diff-viewer)

一个 OpenCode 插件，使用 [lumen](https://github.com/jnsahaj/lumen) 提供美观的 TUI diff 查看功能。

## 功能特性

- ✨ **自动安装 lumen** - 插件会自动检测并安装 lumen 依赖
- 🚀 **一键查看 diff** - 使用 `/diff` 命令快速查看代码变更
- 🔧 **智能终端适配** - 自动检测操作系统，打开新终端窗口展示 diff
- 🤖 **LLM 工具集成** - LLM 可自动调用 `view_diff` 工具

## 前置条件

### 1. 安装 lumen

插件会自动尝试安装 lumen，如果自动安装失败，需要手动安装：

**macOS / Linux (Homebrew)**:
```bash
brew install jnsahaj/lumen/lumen
```

**macOS / Linux (Bun)**:
```bash
bun install jnsahaj/lumen/lumen
```

**Cargo (Rust)**:
```bash
cargo install lumen
```

**Windows**:
下载 [lumen releases](https://github.com/jnsahaj/lumen/releases) 并添加到 PATH

### 2. Git 仓库

确保项目是 git 仓库，并且有修改的文件：
```bash
git status  # 查看修改的文件
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
      "template": "View git diff using lumen TUI.",
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

## lumen 快捷键

在 lumen diff 查看器中：

| 快捷键 | 功能 |
|--------|------|
| `j` / `k` 或 `↑` / `↓` | 上/下移动 |
| `{` / `}` | 跳转到上/下一个变更块 |
| `Tab` | 切换侧边栏 |
| `e` | 在编辑器中打开文件 |
| `q` | 退出 |

## 故障排除

### 1. lumen 未安装

```
❌ lumen is not installed
```

**解决方案**: 手动安装 lumen（见上方前置条件）

### 2. 没有修改的文件

```
📝 No modified files to show diff for
```

**解决方案**: 确保文件已修改并暂存：
```bash
git add .
```

### 3. 新终端未打开

检查终端模拟器是否支持：
- macOS: Terminal.app
- Linux: gnome-terminal 或 xterm

### 4. 插件未加载

检查全局配置文件是否正确：
```bash
cat ~/.config/opencode/opencode.json
```

确保配置正确，包含 `command` 和 `plugin` 两部分：
```json
{
  "command": {
    "diff": {
      "template": "View git diff using lumen TUI.",
      "description": "View diff of modified files using lumen TUI"
    }
  },
  "plugin": ["opencode-diff-viewer"]
}
```

## 工作原理

1. **检测修改文件** - 插件使用 `git diff` 获取已暂存和未暂存的修改
2. **启动 lumen** - 在新终端窗口中运行 `lumen diff --file <files>`
3. **自动安装** - 插件启动时检查 lumen，未安装则自动安装

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
# 或
pnpm install
# 或
bun install

# 构建
npm run build

# 链接本地包
npm link

# 在全局使用
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

- [lumen](https://github.com/jnsahaj/lumen) - TUI Diff 查看器
- [@opencode-ai/plugin](https://www.npmjs.com/package/@opencode-ai/plugin) - OpenCode 插件 SDK

## License

MIT

## 作者

[AarynLu](https://github.com/AruNi-01)
