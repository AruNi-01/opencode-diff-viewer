import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"

export const DiffViewerPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  const isLumenInstalled = async (): Promise<boolean> => {
    try {
      await $`which lumen`
      return true
    } catch {
      return false
    }
  }

  const isBrewInstalled = async (): Promise<boolean> => {
    try {
      await $`which brew`
      return true
    } catch {
      return false
    }
  }

  const isCargoInstalled = async (): Promise<boolean> => {
    try {
      await $`which cargo`
      return true
    } catch {
      return false
    }
  }

  const installLumen = async (): Promise<{ success: boolean; method?: string; error?: string }> => {
    if (await isBrewInstalled()) {
      try {
        await $`brew install jnsahaj/lumen/lumen`
        return { success: true, method: "brew" }
      } catch (e) {
        console.warn(`brew install failed: ${e}`)
      }
    }

    if (await isCargoInstalled()) {
      try {
        await $`cargo install lumen`
        return { success: true, method: "cargo" }
      } catch (e) {
        console.warn(`cargo install failed: ${e}`)
      }
    }

    return {
      success: false,
      error: "Neither brew nor cargo available. Please install lumen manually:\n  brew install jnsahaj/lumen/lumen\n  # or\n  cargo install lumen"
    }
  }

  const ensureLumenInstalled = async (): Promise<{ installed: boolean; message?: string }> => {
    if (await isLumenInstalled()) {
      return { installed: true }
    }

    const result = await installLumen()
    if (result.success) {
      return { installed: true, message: `✅ lumen installed via ${result.method}` }
    }

    return { installed: false, message: `❌ ${result.error}` }
  }

  await ensureLumenInstalled()

  const getModifiedFiles = async (): Promise<string[]> => {
    try {
      const unstaged = await $`git diff --name-only`.text()
      const staged = await $`git diff --staged --name-only`.text()
      const files = new Set([
        ...unstaged.trim().split('\n').filter(Boolean),
        ...staged.trim().split('\n').filter(Boolean)
      ])
      return Array.from(files)
    } catch {
      return []
    }
  }

  const launchDiffViewer = async (files?: string[]): Promise<string> => {
    if (!await isLumenInstalled()) {
      return `❌ lumen is not installed.

To install:
  brew install jnsahaj/lumen/lumen
  # or
  cargo install lumen

Then restart OpenCode.`
    }

    const modifiedFiles = files && files.length > 0 ? files : await getModifiedFiles()
    
    if (modifiedFiles.length === 0) {
      return "📝 No modified files.\n\nRun \`git add .\` to stage changes first."
    }

    const fileList = modifiedFiles.map(f => `  • ${f}`).join('\n')
    const fileArgs = modifiedFiles.map(f => `"${f}"`).join(' ')
    const cmd = `cd "${directory}" && lumen diff ${fileArgs}`
    
    const platform = process.platform
    
    // Try to launch in new terminal
    let launched = false
    let errorMsg = ""
    
    try {
      if (platform === 'darwin') {
        await $`osascript -e 'tell application "Terminal" to do script "${cmd}; exit"'`
        launched = true
      } else if (platform === 'linux') {
        try {
          await $`which gnome-terminal && gnome-terminal -- bash -c "${cmd}; read -p 'Press Enter to close...'" `
          launched = true
        } catch {
          try {
            await $`which xterm && xterm -e "bash -c '${cmd}; read -p Press Enter to close...'" `
            launched = true
          } catch (e) {
            errorMsg = "No terminal emulator found (gnome-terminal/xterm)"
          }
        }
      }
    } catch (e: any) {
      errorMsg = e.message || "Unknown error"
    }

    if (launched) {
      return `✅ Opened lumen diff viewer:\n${fileList}\n\nKeybindings:\n  j/k: Navigate  {/}: Jump hunks  tab: Sidebar  e: Edit  q: Quit`
    }

    // If we couldn't launch, show manual instructions
    return `📺 Could not open terminal automatically.\n\nTo view diffs in lumen:\n1. Open a new terminal\n2. Run:\n   ${cmd}\n\nModified files:\n${fileList}`
  }

  return {
    "tui.command.execute": async (input: any, output: any) => {
      if (input.command === "diff") {
        const files = input.args?.trim() ? [input.args.trim()] : undefined
        output.handled = true
        output.result = await launchDiffViewer(files)
      }
    },

    "file.edited": async ({ event }: { event: { path: string } }) => {
      console.log(`File edited: ${event.path}`)
    },

    tool: {
      view_diff: tool({
        description: "Open the lumen diff viewer to show git diff for modified files.",
        args: {
          file: tool.schema.string().optional().describe("Optional: specific file path"),
        },
        async execute(args: any, ctx: any) {
          return await launchDiffViewer(args.file ? [args.file] : undefined)
        },
      }),
    },
  }
}
