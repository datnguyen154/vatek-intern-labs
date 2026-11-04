// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns the initial value immediately", () => {
        const { result } = renderHook(() => useDebounce("ORD", 300));

        expect(result.current).toBe("ORD");
    });

    it("updates the value after the delay", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: "" } },
        );

        rerender({ value: "ORD" });

        expect(result.current).toBe("");

        act(() => {
            vi.advanceTimersByTime(299);
        });

        expect(result.current).toBe("");

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(result.current).toBe("ORD");
    });

    it("cancels the previous timer when value changes", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: "" } },
        );

        rerender({ value: "O" });

        act(() => {
            vi.advanceTimersByTime(200);
        });

        rerender({ value: "ORD" });

        act(() => {
            vi.advanceTimersByTime(100);
        });

      
        expect(result.current).toBe("");

        act(() => {
            vi.advanceTimersByTime(200);
        });

        expect(result.current).toBe("ORD");
    });

    it("clears the timer on unmount", () => {
        const { rerender, unmount } = renderHook(
            ({ value }) => useDebounce(value, 300),
            { initialProps: { value: "" } },
        );

        rerender({ value: "ORD" });
        unmount();

        expect(vi.getTimerCount()).toBe(0);
    });
});
