import type { Order } from "../../L1-typed-order-utilities/types";
import StatusBadge from "../../L3-react-order-list/components/StatusBadge";

interface OrderDetailDrawerProps {
    order: Order;
    onClose: () => void;
}

export default function OrderDetailDrawer({
    order,
    onClose,
}: OrderDetailDrawerProps) {
    return (
        <div className="drawer-backdrop">
            <aside
                className="order-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="order-detail-title"
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        onClose();
                    }
                }}
            >
                <div className="drawer-header">
                    <h2 id="order-detail-title">Order Details</h2>

                    <button type="button" onClick={onClose} autoFocus>
                        Close
                    </button>
                </div>

                <dl className="order-detail-list">
                    <dt>Order code</dt>
                    <dd>{order.code}</dd>

                    <dt>Customer</dt>
                    <dd>{order.customerName}</dd>

                    <dt>Status</dt>
                    <dd>
                        <StatusBadge status={order.status} />
                    </dd>

                    <dt>Total</dt>
                    <dd>{order.total.toLocaleString("vi-VN")} VND</dd>

                    <dt>Created at</dt>
                    <dd>{new Date(order.createdAt).toLocaleString("vi-VN")}</dd>
                </dl>
            </aside>
        </div>
    );
}
