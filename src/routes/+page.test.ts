import { render, fireEvent, screen } from "@testing-library/svelte";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Page from "./+page.svelte";

// Mock Tauri APIs
const mocks = vi.hoisted(() => {
    return {
        checkRequest: vi.fn(),
    }
});

// Mock Svelte CodeMirror Editor
vi.mock("svelte-codemirror-editor", async () => {
    const mock = await import("./MockEditor.svelte");
    return { default: mock.default };
});

// Mock Tauri Window
vi.mock("@tauri-apps/api/window", () => ({
    getCurrentWindow: () => ({
        minimize: vi.fn(),
        toggleMaximize: vi.fn(),
        close: vi.fn(),
    })
}));

// Mock Tauri Store
vi.mock("@tauri-apps/plugin-store", () => ({
    Store: {
        load: vi.fn().mockResolvedValue({
            get: vi.fn().mockResolvedValue(undefined),
            set: vi.fn(),
            save: vi.fn(),
            onKeyChange: vi.fn(),
        })
    }
}));

// Mock Request Logic
vi.mock("$lib/requestLogic", () => ({
    executeRequest: mocks.checkRequest
}));

describe.skip("Main Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.checkRequest.mockResolvedValue('{"status": "ok"}');
    });

    it("renders the send button", () => {
        render(Page);
        const button = screen.getByText("SEND");
        expect(button).toBeInTheDocument();
    });

    it("updates URL and sends request on button click", async () => {
        render(Page);

        const input = screen.getByPlaceholderText("https://api.example.com");
        await fireEvent.input(input, { target: { value: "https://test.com/api" } });

        const button = screen.getByText("SEND");
        await fireEvent.click(button);

        expect(mocks.checkRequest).toHaveBeenCalledWith(
            "GET",
            "https://test.com/api",
            expect.any(Object),
            expect.any(String), // body
            expect.any(String)  // script
        );
    });
});
