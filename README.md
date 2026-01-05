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

## 安装

### 方式一：npm / pnpm / bun 安装（推荐）

```bash
# npm
npm install opencode-diff-viewer

# pnpm
pnpm add opencode-diff-viewer

# bun
bun add opencode-diff-viewer
```

### 方式二：全局配置（适用于所有项目）

如果你想在所有项目中使用此插件，可以配置全局插件：

1. 创建全局配置目录：
   ```bash
   mkdir -p ~/.config/opencode
   ```

2. 创建 `~/.config/opencode/opencode.json`：
   ```json
   {
     "plugin": ["opencode-diff-viewer"]
   }
   ```

3. 重启 OpenCode，插件会自动加载

### 方式三：项目级别配置

在项目根目录创建 `.opencode` 目录（注意前面的点）：

```bash
# 项目根目录
mkdir -p .opencode/plugin
mkdir -p .opencode/command

# 复制插件文件
cp node_modules/opencode-diff-viewer/dist .opencode/plugin/diff-viewer
cp node_modules/opencode-diff-viewer/command-diff.md .opencode/command/diff.md

# 或使用 npm link
npm link opencode-diff-viewer
cd ~/.config/opencode
ln -s /path/to/your/project/node_modules/opencode-diff-viewer/dist ./plugin/diff-viewer
ln -s /path/to/your/project/node_modules/opencode-diff-viewer/command-diff.md ./command/diff.md
```

### 目录说明

| 目录 | 位置 | 作用 |
|------|------|------|
| `.opencode/` | 项目根目录 | 项目级别插件配置 |
| `~/.config/opencode/` | 用户主目录 | 全局插件配置（跨项目共享） |

**注意**：目录名称是 `.opencode`（带有点），不是 `opencode`。

## 配置 opencode.json

在项目的 `opencode.json` 中添加插件：

```json
{
  "command": {
    "diff": {
      "template": "Open the lumen diff viewer to show visual git diffs for modified files.",
      "description": "View diff of modified files using lumen TUI"
    }
  },
  "plugin": ["opencode-diff-viewer"]
}
```

## 使用方法

### 通过命令

在 OpenCode TUI 中直接输入：

```bash
/diff              # 查看所有修改文件的 diff
/diff src/app.ts   # 查看指定文件的 diff
/diff src/         # 查看目录下所有文件的 diff
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

检查配置文件是否正确：
```bash
# 检查 .opencode 目录是否存在
ls -la .opencode/

# 检查 opencode.json 配置
cat opencode.json
```

### 5. 全局配置不生效

确保全局配置路径正确：
```bash
# macOS / Linux
ls -la ~/.config/opencode/

# 检查配置内容
cat ~/.config/opencode/opencode.json
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

# 在测试项目中
npm link opencode-diff-viewer
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
