// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useOrders } from "./useOrders";

const sampleOrders = [
    {
        id: 105,
        code: "ORD-2026-0105",
        customerName: "Riverside Clinic Network",
        status: "PAID",
    },
];

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("useOrders", () => {
    it("fetches orders successfully", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => sampleOrders,
        });

        vi.stubGlobal("fetch", fetchMock);

        const { result } = renderHook(() => useOrders());

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.orders).toEqual(sampleOrders);
        expect(result.current.error).toBeNull();
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("handles HTTP errors", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
            }),
        );

        const { result } = renderHook(() => useOrders());

        await waitFor(() => {
            expect(result.current.error).toBe("HTTP 500");
        });

        expect(result.current.orders).toEqual([]);
        expect(result.current.isLoading).toBe(false);
    });

    it("retries when retry is called", async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => sampleOrders,
            });

        vi.stubGlobal("fetch", fetchMock);

        const { result } = renderHook(() => useOrders());

        await waitFor(() => {
            expect(result.current.error).toBe("HTTP 500");
        });

        act(() => {
            result.current.retry();
        });

        await waitFor(() => {
            expect(result.current.orders).toEqual(sampleOrders);
        });

        expect(result.current.error).toBeNull();
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("aborts the request on unmount", () => {
        const fetchMock = vi
            .fn()
            .mockImplementation(() => new Promise(() => {}));

        vi.stubGlobal("fetch", fetchMock);

        const { unmount } = renderHook(() => useOrders());

        const options = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;

        const signal = options?.signal as AbortSignal | undefined;

        expect(signal?.aborted).toBe(false);

        unmount();

        expect(signal?.aborted).toBe(true);
    });
});
