import type { Order } from "../../L1-typed-order-utilities/types";
import StatusBadge from "./StatusBadge";

interface OrderRowProps {
    order: Order;
}

export default function OrderRow({ order }: OrderRowProps) {
    return (
        <li className="order-row">
            <div className="order-info">
                <strong>{order.code}</strong>
                <span>{order.customerName}</span>
            </div>

            <StatusBadge status={order.status} />
        </li>
    );
}
