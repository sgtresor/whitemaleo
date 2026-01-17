# WhiteMaleo 🦅

> A lightweight, high-velocity HTTP client for Linux.

WhiteMaleo is a native desktop alternative to Postman. It strips away the cloud bloat, focusing on speed, local privacy, and "glass-morphic" aesthetics.

![Status](https://img.shields.io/badge/status-MVP-orange.svg)

## 🏗 Tech Stack

- **Core:** [Tauri v2](https://v2.tauri.app/) (Rust + Webview)
- **Frontend:** [SvelteKit](https://kit.svelte.dev/) + TypeScript
- **State Management:** [Tauri Store Plugin](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/store) (Local Persistence)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Zinc & Rose "Maleo" Theme)
- **Editor:** [CodeMirror 6](https://codemirror.net/) (Custom Extensions)

## ⚡ Prerequisites

Ensure you have the following installed on your Linux machine:

1.  **Rust & Cargo:** `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2.  **Bun (Runtime):** `curl -fsSL https://bun.sh/install | bash`
3.  **Linux Dependencies:**
    ```bash
    sudo apt-get update
    sudo apt-get install libwebkit2gtk-4.0-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
    ```

## 🚀 Getting Started

1.  **Install Frontend Dependencies:**

    ```bash
    bun install
    ```

2.  **Run in Development Mode:**
    (This compiles the Rust backend and launches the Svelte UI)
    ```bash
    bun tauri dev
    ```

## 👩‍💻 Development Workflows

To ensure code consistency and quality, we use **ESLint** and **Prettier**.

-   **Format Code:** (Auto-fixes styling issues like indentation and quotes)
    ```bash
    bun format
    ```

-   **Check Code Quality:** (Runs linter to catch unused variables and errors)
    ```bash
    bun lint
    ```

## 🛠 Features

### Core Request Engine

- **Methods:** GET, POST, PUT, DELETE.
- **Pre-Request Scripts:** JavaScript sandbox to set environment variables (e.g., `pm.environment.set("id", "1")`).
- **Response Viewer:** Syntax-highlighted JSON viewer with keyboard navigation support.

### Advanced Editor

- **CodeMirror 6:** Full integration for JSON Body and Scripts.
- **Undo/Redo:** Native `Ctrl + Z` and `Ctrl + Shift + Z` support.
- **Smart Shortcuts:**
  - `Ctrl + Enter`: Send Request (or Cancel if loading).
  - Prevents accidental newlines when sending.

### Persistence (Auto-Save)

- **Local Storage:** Automatically saves your work to `settings.dat` locally.
- **Debounced Save:** Writes to disk 1 second after you stop typing to ensure performance.
- **Restores State:** Remembers your URL, Method, Body, and Script on app restart.

### Visuals

- **Glass-morphism:** Custom translucent window with blur effects.
- **Custom Title Bar:** Integrated window controls (Minimize, Maximize, Close) that blend with the theme.

## 📦 Building for Release

To create a standalone `.deb` or `AppImage`:

```bash
bun tauri build
```
