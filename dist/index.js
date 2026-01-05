import { tool } from "@opencode-ai/plugin";
export const DiffViewerPlugin = async ({ project, client, $, directory, worktree }) => {
    const isLumenInstalled = async () => {
        try {
            await $ `which lumen`;
            return true;
        }
        catch {
            return false;
        }
    };
    const isTmuxInstalled = async () => {
        try {
            await $ `which tmux`;
            return true;
        }
        catch {
            return false;
        }
    };
    const isBrewInstalled = async () => {
        try {
            await $ `which brew`;
            return true;
        }
        catch {
            return false;
        }
    };
    const isCargoInstalled = async () => {
        try {
            await $ `which cargo`;
            return true;
        }
        catch {
            return false;
        }
    };
    const installLumen = async () => {
        if (await isBrewInstalled()) {
            try {
                await $ `brew install jnsahaj/lumen/lumen`;
                return { success: true, method: "brew" };
            }
            catch (e) {
                console.warn(`brew install failed: ${e}`);
            }
        }
        if (await isCargoInstalled()) {
            try {
                await $ `cargo install lumen`;
                return { success: true, method: "cargo" };
            }
            catch (e) {
                console.warn(`cargo install failed: ${e}`);
            }
        }
        return {
            success: false,
            error: "Neither brew nor cargo available. Please install lumen manually:\n  brew install jnsahaj/lumen/lumen\n  # or\n  cargo install lumen"
        };
    };
    const installTmux = async () => {
        if (await isBrewInstalled()) {
            try {
                await $ `brew install tmux`;
                return { success: true, method: "brew" };
            }
            catch (e) {
                console.warn(`brew install tmux failed: ${e}`);
            }
        }
        return {
            success: false,
            error: "Please install tmux manually:\n  brew install tmux\n  # or\n  apt install tmux"
        };
    };
    const ensureLumenInstalled = async () => {
        if (await isLumenInstalled()) {
            return { installed: true };
        }
        const result = await installLumen();
        if (result.success) {
            return { installed: true, message: `✅ lumen installed via ${result.method}` };
        }
        return { installed: false, message: `❌ ${result.error}` };
    };
    const ensureTmuxInstalled = async () => {
        if (await isTmuxInstalled()) {
            return { installed: true };
        }
        const result = await installTmux();
        if (result.success) {
            return { installed: true, message: `✅ tmux installed via ${result.method}` };
        }
        return { installed: false, message: `❌ ${result.error}` };
    };
    // Check and install dependencies on startup
    const tmuxCheck = await ensureTmuxInstalled();
    if (!tmuxCheck.installed) {
        console.warn(tmuxCheck.message);
    }
    const lumenCheck = await ensureLumenInstalled();
    if (!lumenCheck.installed) {
        console.warn(lumenCheck.message);
    }
    const getModifiedFiles = async () => {
        try {
            const unstaged = await $ `git diff --name-only`.text();
            const staged = await $ `git diff --staged --name-only`.text();
            const files = new Set([
                ...unstaged.trim().split('\n').filter(Boolean),
                ...staged.trim().split('\n').filter(Boolean)
            ]);
            return Array.from(files);
        }
        catch {
            return [];
        }
    };
    const launchDiffViewer = async (files) => {
        // Check tmux
        if (!await isTmuxInstalled()) {
            return `❌ tmux is not installed.

To install:
  brew install tmux
  # or
  apt install tmux

Then restart OpenCode.`;
        }
        // Check lumen
        if (!await isLumenInstalled()) {
            return `❌ lumen is not installed.

To install:
  brew install jnsahaj/lumen/lumen
  # or
  cargo install lumen

Then restart OpenCode.`;
        }
        const modifiedFiles = files && files.length > 0 ? files : await getModifiedFiles();
        if (modifiedFiles.length === 0) {
            return "📝 No modified files.\n\nRun \`git add .\` to stage changes first.";
        }
        const fileList = modifiedFiles.map(f => `  • ${f}`).join('\n');
        const fileArgs = modifiedFiles.map(f => `"${f}"`).join(' ');
        const sessionName = "opencode-diff-viewer";
        const cmd = `cd "${directory}" && lumen diff ${fileArgs}`;
        try {
            // Kill existing session if it exists
            await $ `tmux kill-session -t "${sessionName}" 2>/dev/null || true`;
            // Create new tmux session
            await $ `tmux new-session -d -s "${sessionName}" "${cmd}"`;
            return `✅ Opened lumen in tmux session "${sessionName}":\n${fileList}\n\nTo use lumen:
  1. Run: tmux attach -t "${sessionName}"
  2. Navigate: j/k or arrows, {/} for hunks
  3. Detach: Ctrl+B then D

Keybindings:
  j/k or ↑/↓: Navigate    {/}: Jump hunks
  tab: Sidebar           e: Edit file
  q: Quit`;
        }
        catch (e) {
            return `❌ Failed to launch tmux session: ${e.message || e}\n\nTry manually:
  tmux new-session -s "${sessionName}" "${cmd}"`;
        }
    };
    return {
        "tui.command.execute": async (input, output) => {
            if (input.command === "diff") {
                const files = input.args?.trim() ? [input.args.trim()] : undefined;
                output.handled = true;
                output.result = await launchDiffViewer(files);
            }
        },
        "file.edited": async ({ event }) => {
            console.log(`File edited: ${event.path}`);
        },
        tool: {
            view_diff: tool({
                description: "Open the lumen diff viewer in a tmux session.",
                args: {
                    file: tool.schema.string().optional().describe("Optional: specific file path"),
                },
                async execute(args, ctx) {
                    return await launchDiffViewer(args.file ? [args.file] : undefined);
                },
            }),
        },
    };
};
