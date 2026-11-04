import type { Order } from "../../L1-typed-order-utilities/types";
import StatusBadge from "./StatusBadge";

interface OrderRowProps {
    order: Order;
    onViewDetails?: (order: Order) => void;
}

export default function OrderRow({ order, onViewDetails }: OrderRowProps) {
    return (
        <li className="order-row">
            <div className="order-info">
                <strong>{order.code}</strong>
                <span>{order.customerName}</span>
            </div>

            <StatusBadge status={order.status} />

            {onViewDetails && (
                <button type="button" onClick={() => onViewDetails(order)}>
                    View Details
                </button>
            )}
        </li>
    );
}
