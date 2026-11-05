import { describe, expect, it } from "vitest";

import { createOrderStore } from "./store";
import { addLine, removeLine, updateQuantity, setDiscount } from "./orderSlice";

import { calculateOrderTotal } from "../shared/orderReducer";

const keyboard = {
    id: 1,
    name: "Keyboard",
    price: 500000,
};

describe("Redux Order Builder", () => {
    it("starts with an empty draft", () => {
        const store = createOrderStore();

        expect(store.getState().draftOrder).toEqual({
            lines: [],
            discountPercent: 0,
        });
    });

    it("adds a product", () => {
        const store = createOrderStore();

        store.dispatch(addLine(keyboard));

        expect(store.getState().draftOrder.lines).toHaveLength(1);
    });

    it("increases quantity for an existing product", () => {
        const store = createOrderStore();

        store.dispatch(addLine(keyboard));
        store.dispatch(addLine(keyboard));

        const lines = store.getState().draftOrder.lines;

        expect(lines).toHaveLength(1);
        expect(lines[0].quantity).toBe(2);
    });

    it("updates quantity", () => {
        const store = createOrderStore();

        store.dispatch(addLine(keyboard));
        store.dispatch(
            updateQuantity({
                productId: 1,
                quantity: 3,
            }),
        );

        expect(store.getState().draftOrder.lines[0].quantity).toBe(3);
    });

    it("removes a product", () => {
        const store = createOrderStore();

        store.dispatch(addLine(keyboard));
        store.dispatch(removeLine(1));

        expect(store.getState().draftOrder.lines).toHaveLength(0);
    });

    it("applies discount and calculates total", () => {
        const store = createOrderStore();

        store.dispatch(addLine(keyboard));
        store.dispatch(setDiscount(10));

        const result = calculateOrderTotal(store.getState().draftOrder);

        expect(result).toEqual({
            subtotal: 500000,
            discountAmount: 50000,
            total: 450000,
        });
    });
});
