import { tool } from "@opencode-ai/plugin";
/**
 * OpenCode Diff Viewer Plugin
 * Uses lumen (https://github.com/jnsahaj/lumen) for visual git diffs.
 * Automatically installs lumen if not present.
 */
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
    await ensureLumenInstalled();
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
        if (!await isLumenInstalled()) {
            return "❌ lumen is not installed.\n\nTo install:\n  brew install jnsahaj/lumen/lumen\n  # or\n  cargo install lumen";
        }
        const modifiedFiles = files && files.length > 0 ? files : await getModifiedFiles();
        if (modifiedFiles.length === 0) {
            return "📝 No modified files to show diff for.\n\nRun `git add .` to stage changes first.";
        }
        const platform = process.platform;
        const fileArgs = modifiedFiles.map(f => `"${f}"`).join(' ');
        const cmd = `cd "${directory}" && lumen diff ${fileArgs}`;
        try {
            if (platform === 'darwin') {
                await $ `osascript -e 'tell application "Terminal" to do script "${cmd}; exit"'`;
            }
            else if (platform === 'linux') {
                try {
                    await $ `which gnome-terminal && gnome-terminal -- bash -c "${cmd}; read -p 'Press Enter to close...'" `;
                }
                catch {
                    try {
                        await $ `which xterm && xterm -e "bash -c '${cmd}; read -p Press Enter to close...'" `;
                    }
                    catch {
                        return `❌ No terminal emulator found (gnome-terminal/xterm).\n\nPlease run manually:\n  ${cmd}`;
                    }
                }
            }
            else {
                await $ `${cmd}`;
            }
            return `✅ Opened lumen diff viewer for ${modifiedFiles.length} file(s):
${modifiedFiles.map(f => `  • ${f}`).join('\n')}

Keybindings:
  j/k or ↑/↓: Navigate    {/}: Jump between hunks
  tab: Toggle sidebar     e: Open in editor
  q: Quit`;
        }
        catch (error) {
            return `❌ Failed to launch diff viewer: ${error}\n\nTry running manually:\n  ${cmd}`;
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
                description: "Open the lumen diff viewer to show git diff for modified files. Use this when the user wants to see visual diffs of their changes.",
                args: {
                    file: tool.schema.string().optional().describe("Optional: specific file path to show diff for. If not provided, shows all modified files."),
                },
                async execute(args, ctx) {
                    return await launchDiffViewer(args.file ? [args.file] : undefined);
                },
            }),
        },
    };
};
