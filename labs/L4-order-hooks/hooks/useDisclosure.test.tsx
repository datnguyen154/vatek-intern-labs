// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDisclosure } from "./useDisclosure";

describe("useDisclosure", () => {
    it("is closed by default", () => {
        const { result } = renderHook(() => useDisclosure());

        expect(result.current.isOpen).toBe(false);
    });

    it("supports a custom initial state", () => {
        const { result } = renderHook(() => useDisclosure(true));

        expect(result.current.isOpen).toBe(true);
    });

    it("opens the disclosure", () => {
        const { result } = renderHook(() => useDisclosure());

        act(() => {
            result.current.open();
        });

        expect(result.current.isOpen).toBe(true);
    });

    it("closes the disclosure", () => {
        const { result } = renderHook(() => useDisclosure(true));

        act(() => {
            result.current.close();
        });

        expect(result.current.isOpen).toBe(false);
    });

    it("toggles the disclosure", () => {
        const { result } = renderHook(() => useDisclosure());

        act(() => {
            result.current.toggle();
        });

        expect(result.current.isOpen).toBe(true);

        act(() => {
            result.current.toggle();
        });

        expect(result.current.isOpen).toBe(false);
    });
});
