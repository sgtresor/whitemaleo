# WhiteMaleo 🦅

> A lightweight, high-velocity HTTP client for Linux.

WhiteMaleo is a native desktop alternative to Postman. It strips away the cloud bloat, focusing on speed, local privacy, and "glass-morphic" aesthetics.

![Status](https://img.shields.io/badge/status-MVP-orange.svg)

## 🏗 Tech Stack

* **Core:** [Tauri v2](https://v2.tauri.app/) (Rust + Webview)
* **Frontend:** [SvelteKit](https://kit.svelte.dev/) + TypeScript
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Zinc & Rose "Maleo" Theme)
* **Editor:** [CodeMirror 6](https://codemirror.net/) (Syntax Highlighting)

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

## 🛠 Features

* **Methods:** GET, POST, PUT, DELETE.
* **Pre-Request Scripts:** JavaScript sandbox to set environment variables (e.g., `pm.environment.set("id", "1")`).
* **Visuals:** Custom "Glass" window with draggable regions and syntax-highlighted JSON editors.

## 📦 Building for Release

To create a standalone `.deb` or `AppImage`:

```bash
bun tauri build
```
