import { useEffect, useState } from "react";
import type { Order } from "../../L1-typed-order-utilities/types";

const API_URL = "http://localhost:3001/orders";

interface UseOrdersResult {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    retry: () => void;
}

export function useOrders(): UseOrdersResult {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadOrders() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(API_URL, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data: unknown = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid orders response");
                }

                if (!controller.signal.aborted) {
                    setOrders(data as Order[]);
                }
            } catch (err: unknown) {
                if (controller.signal.aborted) {
                    return;
                }

                setOrders([]);
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadOrders();

        return () => {
            controller.abort();
        };
    }, [retryCount]);

    function retry() {
        setRetryCount((prev) => prev + 1);
    }

    return {
        orders,
        isLoading,
        error,
        retry,
    };
}
