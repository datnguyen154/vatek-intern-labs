import type { Order } from "../../L1-typed-order-utilities/types";
import OrderRow from "./OrderRow";

interface OrderListProps {
    orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
    if (orders.length === 0) {
        return <p>No orders found.</p>;
    }

    return (
        <ul className="order-list">
            {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
            ))}
        </ul>
    );
}
