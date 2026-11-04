import type { OrderStatus } from "../../L1-typed-order-utilities/types";

interface StatusBadgeProps {
    status: OrderStatus;
}

const statusLabels: Record<OrderStatus, string> = {
    DRAFT: "Draft",
    PENDING_PAYMENT: "Pending Payment",
    PAID: "Paid",
    FULFILLED: "Fulfilled",
    CANCELLED: "Cancelled",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={`status-badge status-${status.toLowerCase()}`}>
            {statusLabels[status]}
        </span>
    );
}
