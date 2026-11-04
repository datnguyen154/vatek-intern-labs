import { useEffect, useState } from "react";
import type { Order } from "../L1-typed-order-utilities/types";
import OrderList from "./components/OrderList";
import OrderSearch from "./components/OrderSearch";

const API_URL = "http://localhost:3001/orders";

export default function OrderListPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [keyword, setKeyword] = useState("");
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
                    throw new Error("Invalid API response");
                }

                setOrders(data as Order[]);
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

    const normalizedKeyword = keyword.trim().toLowerCase();

    const filteredOrders = orders.filter((order) => {
        const matchesCode = order.code
            .toLowerCase()
            .includes(normalizedKeyword);

        const matchesCustomer = order.customerName
            .toLowerCase()
            .includes(normalizedKeyword);

        return matchesCode || matchesCustomer;
    });

    function handleRetry() {
        setRetryCount((prev) => prev + 1);
    }

    return (
        <main>
            <h1>OrderHub — Order List</h1>

            <OrderSearch keyword={keyword} onKeywordChange={setKeyword} />

            {isLoading ? (
                <p role="status">Loading orders...</p>
            ) : error ? (
                <div role="alert">
                    <p>Failed to load orders: {error}</p>
                    <button type="button" onClick={handleRetry}>
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    <p>{filteredOrders.length} orders found</p>
                    <OrderList orders={filteredOrders} />
                </>
            )}
        </main>
    );
}
