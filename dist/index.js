import { tool } from "@opencode-ai/plugin";
export const DiffViewerPlugin = async ({ project, client, $, directory, worktree }) => {
    const isDeltaInstalled = async () => {
        try {
            await $ `which delta`;
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
    const installDelta = async () => {
        if (await isBrewInstalled()) {
            try {
                await $ `brew install delta`;
                return { success: true, method: "brew" };
            }
            catch (e) {
                console.warn(`brew install failed: ${e}`);
            }
        }
        if (await isCargoInstalled()) {
            try {
                await $ `cargo install delta`;
                return { success: true, method: "cargo" };
            }
            catch (e) {
                console.warn(`cargo install failed: ${e}`);
            }
        }
        return {
            success: false,
            error: "Neither brew nor cargo available. Please install delta manually:\n  brew install dandavison/delta/delta\n  # or\n  cargo install delta"
        };
    };
    const ensureDeltaInstalled = async () => {
        if (await isDeltaInstalled()) {
            return { installed: true };
        }
        const result = await installDelta();
        if (result.success) {
            return { installed: true, message: `✅ delta installed via ${result.method}` };
        }
        return { installed: false, message: `❌ ${result.error}` };
    };
    await ensureDeltaInstalled();
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
    const showDiff = async (files) => {
        if (!await isDeltaInstalled()) {
            return `❌ delta is not installed.

To install:
  brew install dandavison/delta/delta
  # or
  cargo install delta

Then restart OpenCode.`;
        }
        const modifiedFiles = files && files.length > 0 ? files : await getModifiedFiles();
        if (modifiedFiles.length === 0) {
            return "📝 No modified files.\n\nRun \`git add .\` to stage changes first.";
        }
        try {
            // Get diff output with delta
            let diffOutput = "";
            // Show staged diff
            const stagedDiff = await $ `cd "${directory}" && git diff --staged`.text();
            if (stagedDiff.trim()) {
                diffOutput += "=== STAGED CHANGES ===\n\n";
                diffOutput += await $ `cd "${directory}" && git diff --staged | delta --pager=never`.text();
            }
            // Show unstaged diff
            const unstagedDiff = await $ `cd "${directory}" && git diff`.text();
            if (unstagedDiff.trim()) {
                if (diffOutput)
                    diffOutput += "\n=== UNSTAGED CHANGES ===\n\n";
                diffOutput += await $ `cd "${directory}" && git diff | delta --pager=never`.text();
            }
            if (!diffOutput.trim()) {
                return "📝 No changes to show.";
            }
            const fileList = modifiedFiles.map(f => `  • ${f}`).join('\n');
            return `✅ Modified files (${modifiedFiles.length}):\n${fileList}\n\n${diffOutput}`;
        }
        catch (e) {
            return `❌ Error showing diff: ${e.message || e}`;
        }
    };
    return {
        "tui.command.execute": async (input, output) => {
            if (input.command === "diff") {
                const files = input.args?.trim() ? [input.args.trim()] : undefined;
                output.handled = true;
                output.result = await showDiff(files);
            }
        },
        "file.edited": async ({ event }) => {
            console.log(`File edited: ${event.path}`);
        },
        tool: {
            view_diff: tool({
                description: "Show git diff with syntax highlighting using delta.",
                args: {
                    file: tool.schema.string().optional().describe("Optional: specific file path"),
                },
                async execute(args, ctx) {
                    return await showDiff(args.file ? [args.file] : undefined);
                },
            }),
        },
    };
};
