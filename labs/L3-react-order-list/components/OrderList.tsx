import type { Order } from "../../L1-typed-order-utilities/types";
import OrderRow from "./OrderRow";

interface OrderListProps {
    orders: Order[];
    onViewDetails?: (order: Order) => void;
}

export default function OrderList({ orders, onViewDetails }: OrderListProps) {
    if (orders.length === 0) {
        return <p>No orders found.</p>;
    }

    return (
        <ul className="order-list">
            {orders.map((order) => (
                <OrderRow
                    key={order.id}
                    order={order}
                    onViewDetails={onViewDetails}
                />
            ))}
        </ul>
    );
}
