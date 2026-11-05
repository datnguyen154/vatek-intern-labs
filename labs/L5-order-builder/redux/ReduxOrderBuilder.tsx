import { Provider } from "react-redux";

import { products } from "../shared/products";
import { calculateOrderTotal } from "../shared/orderReducer";

import { addLine, removeLine, updateQuantity, setDiscount } from "./orderSlice";

import { store, useAppDispatch, useAppSelector } from "./store";

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")} ₫`;

function ProductCatalog() {
    const dispatch = useAppDispatch();

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
                        onClick={() => dispatch(addLine(product))}
                    >
                        Add Product
                    </button>
                </div>
            ))}
        </section>
    );
}

function DraftOrderLines() {
    const lines = useAppSelector((state) => state.draftOrder.lines);

    const dispatch = useAppDispatch();

    return (
        <section>
            <h2>Draft Order</h2>

            {lines.length === 0 ? (
                <p>No products added yet.</p>
            ) : (
                <ul>
                    {lines.map((line) => (
                        <li key={line.productId}>
                            <strong>{line.name}</strong>
                            {" — "}
                            {formatMoney(line.price)}

                            <div>
                                <button
                                    type="button"
                                    disabled={line.quantity <= 1}
                                    onClick={() =>
                                        dispatch(
                                            updateQuantity({
                                                productId: line.productId,
                                                quantity: line.quantity - 1,
                                            }),
                                        )
                                    }
                                >
                                    -
                                </button>

                                <span> {line.quantity} </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch(
                                            updateQuantity({
                                                productId: line.productId,
                                                quantity: line.quantity + 1,
                                            }),
                                        )
                                    }
                                >
                                    +
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch(removeLine(line.productId))
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
    const order = useAppSelector((state) => state.draftOrder);

    const dispatch = useAppDispatch();

    const { subtotal, discountAmount, total } = calculateOrderTotal(order);

    return (
        <section>
            <h2>Order Summary</h2>

            <label htmlFor="redux-discount">Discount (%)</label>

            <input
                id="redux-discount"
                type="number"
                min={0}
                max={100}
                value={order.discountPercent}
                onChange={(event) =>
                    dispatch(setDiscount(event.currentTarget.valueAsNumber))
                }
            />

            <p>Subtotal: {formatMoney(subtotal)}</p>
            <p>Discount: -{formatMoney(discountAmount)}</p>

            <strong>Total: {formatMoney(total)}</strong>
        </section>
    );
}

export default function ReduxOrderBuilder() {
    return (
        <Provider store={store}>
            <main>
                <h1>Order Builder — Redux Toolkit</h1>

                <ProductCatalog />
                <hr />
                <DraftOrderLines />
                <hr />
                <OrderSummary />
            </main>
        </Provider>
    );
}
