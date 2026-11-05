import type { DraftOrder, OrderAction } from "./orderTypes";

export const initialOrder: DraftOrder = {
    lines: [],
    discountPercent: 0,
};

export function orderReducer(
    state: DraftOrder,
    action: OrderAction,
): DraftOrder {
    switch (action.type) {
        case "ADD_LINE": {
            const product = action.payload;

            const existingLine = state.lines.find(
                (line) => line.productId === product.id,
            );

            if (existingLine) {
                return {
                    ...state,
                    lines: state.lines.map((line) =>
                        line.productId === product.id
                            ? { ...line, quantity: line.quantity + 1 }
                            : line,
                    ),
                };
            }

            return {
                ...state,
                lines: [
                    ...state.lines,
                    {
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                    },
                ],
            };
        }

        case "REMOVE_LINE":
            return {
                ...state,
                lines: state.lines.filter(
                    (line) => line.productId !== action.payload,
                ),
            };

        case "UPDATE_QUANTITY":
            return {
                ...state,
                lines: state.lines.map((line) =>
                    line.productId === action.payload.productId
                        ? {
                              ...line,
                              quantity: Math.max(
                                  1,
                                  Math.floor(
                                      Number.isFinite(action.payload.quantity)
                                          ? action.payload.quantity
                                          : 1,
                                  ),
                              ),
                          }
                        : line,
                ),
            };

        case "SET_DISCOUNT":
            return {
                ...state,
                discountPercent: Math.min(
                    100,
                    Math.max(
                        0,
                        Number.isFinite(action.payload) ? action.payload : 0,
                    ),
                ),
            };

        default:
            return state;
    }
}

export function calculateOrderTotal(order: DraftOrder) {
    const subtotal = order.lines.reduce(
        (sum, line) => sum + line.price * line.quantity,
        0,
    );

    const discountAmount = Math.round((subtotal * order.discountPercent) / 100);

    const total = subtotal - discountAmount;

    return { subtotal, discountAmount, total };
}
