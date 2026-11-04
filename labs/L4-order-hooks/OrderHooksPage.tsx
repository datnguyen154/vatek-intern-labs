import { useState } from "react";

import type { Order, OrderStatus } from "../L1-typed-order-utilities/types";

import OrderList from "../L3-react-order-list/components/OrderList";
import OrderSearch from "../L3-react-order-list/components/OrderSearch";
import OrderDetailDrawer from "./components/OrderDetailDrawer";

import { useDebounce } from "./hooks/useDebounce";
import { useOrders } from "./hooks/useOrders";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useDisclosure } from "./hooks/useDisclosure";

type StatusFilter = OrderStatus | "ALL";

const STATUS_OPTIONS: StatusFilter[] = [
    "ALL",
    "DRAFT",
    "PENDING_PAYMENT",
    "PAID",
    "FULFILLED",
    "CANCELLED",
];

function isStatusFilter(value: string): value is StatusFilter {
    return STATUS_OPTIONS.some((status) => status === value);
}

export default function OrderHooksPage() {
    // 1. Fetch dữ liệu từ API
    const { orders, isLoading, error, retry } = useOrders();

    // 2. Quản lý từ khóa và debounce
    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebounce(keyword, 300);

    // 3. Ghi nhớ trạng thái lọc
    const [storedStatus, setStoredStatus] = useLocalStorage<string>(
        "order-status-filter",
        "ALL",
    );

    const statusFilter: StatusFilter = isStatusFilter(storedStatus)
        ? storedStatus
        : "ALL";

    // 4. Quản lý drawer
    const { isOpen, open, close } = useDisclosure();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // 5. Tính danh sách đã lọc
    const normalizedKeyword = debouncedKeyword.trim().toLowerCase();

    const filteredOrders = orders.filter((order) => {
        const matchesKeyword =
            order.code.toLowerCase().includes(normalizedKeyword) ||
            order.customerName.toLowerCase().includes(normalizedKeyword);

        const matchesStatus =
            statusFilter === "ALL" || order.status === statusFilter;

        return matchesKeyword && matchesStatus;
    });

    function handleViewDetails(order: Order) {
        setSelectedOrder(order);
        open();
    }

    function handleCloseDetails() {
        close();
        setSelectedOrder(null);
    }

    return (
        <main>
            <h1>OrderHub — Order List</h1>

            <div className="order-filters">
                <OrderSearch keyword={keyword} onKeywordChange={setKeyword} />

                <label htmlFor="order-status-filter">Status</label>

                <select
                    id="order-status-filter"
                    value={statusFilter}
                    onChange={(event) => {
                        const nextStatus = event.target.value;

                        if (isStatusFilter(nextStatus)) {
                            setStoredStatus(nextStatus);
                        }
                    }}
                >
                    {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                            {status === "ALL"
                                ? "All statuses"
                                : status.replaceAll("_", " ")}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <p role="status">Loading orders...</p>
            ) : error ? (
                <div role="alert">
                    <p>Failed to load orders: {error}</p>

                    <button type="button" onClick={retry}>
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    <p>{filteredOrders.length} orders found</p>

                    <OrderList
                        orders={filteredOrders}
                        onViewDetails={handleViewDetails}
                    />
                </>
            )}

            {isOpen && selectedOrder && (
                <OrderDetailDrawer
                    order={selectedOrder}
                    onClose={handleCloseDetails}
                />
            )}
        </main>
    );
}
