// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("uses the initial value when storage is empty", () => {
        const { result } = renderHook(() => useLocalStorage("status", "ALL"));

        expect(result.current[0]).toBe("ALL");
        expect(localStorage.getItem("status")).toBe('"ALL"');
    });

    it("restores a previously stored value", () => {
        localStorage.setItem("status", JSON.stringify("PAID"));

        const { result } = renderHook(() => useLocalStorage("status", "ALL"));

        expect(result.current[0]).toBe("PAID");
    });

    it("updates localStorage when state changes", () => {
        const { result } = renderHook(() => useLocalStorage("status", "ALL"));

        act(() => {
            result.current[1]("FULFILLED");
        });

        expect(result.current[0]).toBe("FULFILLED");
        expect(localStorage.getItem("status")).toBe('"FULFILLED"');
    });

    it("falls back to initial value for invalid JSON", () => {
        localStorage.setItem("status", "{invalid-json");

        const { result } = renderHook(() => useLocalStorage("status", "ALL"));

        expect(result.current[0]).toBe("ALL");
    });
});
