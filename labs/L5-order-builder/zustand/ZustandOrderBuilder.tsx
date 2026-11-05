import { products } from "../shared/products";
import { calculateOrderTotal } from "../shared/orderReducer";
import { useOrderStore } from "./orderStore";

const formatMoney = (value: number) => `${value.toLocaleString("vi-VN")} ₫`;

function ProductCatalog() {
    const addLine = useOrderStore((state) => state.addLine);

    return (
        <section>
            <h2>Products</h2>

            {products.map((product) => (
                <div key={product.id}>
                    <span>
                        {product.name} — {formatMoney(product.price)}
                    </span>

                    <button type="button" onClick={() => addLine(product)}>
                        Add Product
                    </button>
                </div>
            ))}
        </section>
    );
}

function DraftOrderLines() {
    const lines = useOrderStore((state) => state.lines);

    const updateQuantity = useOrderStore((state) => state.updateQuantity);

    const removeLine = useOrderStore((state) => state.removeLine);

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
                                        updateQuantity(
                                            line.productId,
                                            line.quantity - 1,
                                        )
                                    }
                                >
                                    -
                                </button>

                                <span> {line.quantity} </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateQuantity(
                                            line.productId,
                                            line.quantity + 1,
                                        )
                                    }
                                >
                                    +
                                </button>

                                <button
                                    type="button"
                                    onClick={() => removeLine(line.productId)}
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
    const lines = useOrderStore((state) => state.lines);

    const discountPercent = useOrderStore((state) => state.discountPercent);

    const setDiscount = useOrderStore((state) => state.setDiscount);

    const { subtotal, discountAmount, total } = calculateOrderTotal({
        lines,
        discountPercent,
    });

    return (
        <section>
            <h2>Order Summary</h2>

            <label htmlFor="zustand-discount">Discount (%)</label>

            <input
                id="zustand-discount"
                type="number"
                min={0}
                max={100}
                value={discountPercent}
                onChange={(event) =>
                    setDiscount(event.currentTarget.valueAsNumber)
                }
            />

            <p>Subtotal: {formatMoney(subtotal)}</p>
            <p>Discount: -{formatMoney(discountAmount)}</p>

            <strong>Total: {formatMoney(total)}</strong>
        </section>
    );
}

export default function ZustandOrderBuilder() {
    return (
        <main>
            <h1>Order Builder — Zustand</h1>

            <ProductCatalog />
            <hr />
            <DraftOrderLines />
            <hr />
            <OrderSummary />
        </main>
    );
}
