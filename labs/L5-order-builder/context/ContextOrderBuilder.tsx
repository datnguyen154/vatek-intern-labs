import { OrderProvider, useOrderContext } from "./OrderContext";
import { products } from "../shared/products";
import { calculateOrderTotal } from "../shared/orderReducer";

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")} ₫`;

function ProductCatalog() {
    const { dispatch } = useOrderContext();

    return (
        <section>
            <h2>Products</h2>

            {products.map((product) => (
                <div key={product.id}>
                    <span>
                        {product.name} — {formatMoney(product.price)}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            dispatch({
                                type: "ADD_LINE",
                                payload: product,
                            })
                        }
                    >
                        Add Product
                    </button>
                </div>
            ))}
        </section>
    );
}

function DraftOrderLines() {
    const { order, dispatch } = useOrderContext();

    return (
        <section>
            <h2>Draft Order</h2>

            {order.lines.length === 0 ? (
                <p>No products added yet.</p>
            ) : (
                <ul>
                    {order.lines.map((line) => (
                        <li key={line.productId}>
                            <strong>{line.name}</strong>
                            {" — "}
                            {formatMoney(line.price)}

                            <div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch({
                                            type: "UPDATE_QUANTITY",
                                            payload: {
                                                productId: line.productId,
                                                quantity: line.quantity - 1,
                                            },
                                        })
                                    }
                                    disabled={line.quantity <= 1}
                                >
                                    -
                                </button>

                                <span> {line.quantity} </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch({
                                            type: "UPDATE_QUANTITY",
                                            payload: {
                                                productId: line.productId,
                                                quantity: line.quantity + 1,
                                            },
                                        })
                                    }
                                >
                                    +
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch({
                                            type: "REMOVE_LINE",
                                            payload: line.productId,
                                        })
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function OrderSummary() {
    const { order, dispatch } = useOrderContext();

    const { subtotal, discountAmount, total } = calculateOrderTotal(order);

    return (
        <section>
            <h2>Order Summary</h2>

            <label htmlFor="discount">Discount (%)</label>

            <input
                id="discount"
                type="number"
                min={0}
                max={100}
                value={order.discountPercent}
                onChange={(event) =>
                    dispatch({
                        type: "SET_DISCOUNT",
                        payload: event.currentTarget.valueAsNumber,
                    })
                }
            />

            <p>Subtotal: {formatMoney(subtotal)}</p>
            <p>Discount: -{formatMoney(discountAmount)}</p>

            <strong>Total: {formatMoney(total)}</strong>
        </section>
    );
}

export default function ContextOrderBuilder() {
    return (
        <OrderProvider>
            <main>
                <h1>Order Builder — Context API</h1>

                <ProductCatalog />
                <hr />
                <DraftOrderLines />
                <hr />
                <OrderSummary />
            </main>
        </OrderProvider>
    );
}
