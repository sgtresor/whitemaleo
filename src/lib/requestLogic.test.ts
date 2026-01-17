import { describe, it, expect, vi } from "vitest";
import { executeRequest } from "./requestLogic";

// Mock Tauri invoke
const mocks = vi.hoisted(() => {
    return {
        invoke: vi.fn(),
    }
})

vi.mock("@tauri-apps/api/core", () => {
    return {
        invoke: mocks.invoke
    };
});

describe("executeRequest", () => {
    it("should replace variables from pre-request script", async () => {
        const script = `pm.environment.set("userId", "123");`;
        const url = "https://api.example.com/users/{{userId}}";

        mocks.invoke.mockResolvedValue('{"status":"ok"}');

        await executeRequest("GET", url, {}, "", script);

        expect(mocks.invoke).toHaveBeenCalledWith("make_request", {
            request: {
                method: "GET",
                url: "https://api.example.com/users/123",
                headers: {},
                body: null
            }
        });
    });

    it("should handle mixed replacements in body", async () => {
        const script = `pm.environment.set("name", "Alice");`;
        const body = `{"name": "{{name}}"}`;

        mocks.invoke.mockResolvedValue('{}');

        await executeRequest("POST", "https://api.com", {}, body, script);

        expect(mocks.invoke).toHaveBeenCalledWith("make_request", {
            request: {
                method: "POST",
                url: "https://api.com",
                headers: {},
                body: `{"name": "Alice"}`
            }
        });
    });
});
