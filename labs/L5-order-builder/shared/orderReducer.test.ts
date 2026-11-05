import { describe, expect, it } from "vitest";

import {
    initialOrder,
    orderReducer,
    calculateOrderTotal,
} from "./orderReducer";

const keyboard = {
    id: 1,
    name: "Keyboard",
    price: 500000,
};

describe("orderReducer", () => {
    it("adds a new product", () => {
        const state = orderReducer(initialOrder, {
            type: "ADD_LINE",
            payload: keyboard,
        });

        expect(state.lines).toHaveLength(1);
        expect(state.lines[0].quantity).toBe(1);
    });

    it("increases quantity when adding an existing product", () => {
        const first = orderReducer(initialOrder, {
            type: "ADD_LINE",
            payload: keyboard,
        });

        const second = orderReducer(first, {
            type: "ADD_LINE",
            payload: keyboard,
        });

        expect(second.lines).toHaveLength(1);
        expect(second.lines[0].quantity).toBe(2);
    });

    it("removes a product", () => {
        const added = orderReducer(initialOrder, {
            type: "ADD_LINE",
            payload: keyboard,
        });

        const result = orderReducer(added, {
            type: "REMOVE_LINE",
            payload: keyboard.id,
        });

        expect(result.lines).toHaveLength(0);
    });

    it("updates quantity with minimum of 1", () => {
        const added = orderReducer(initialOrder, {
            type: "ADD_LINE",
            payload: keyboard,
        });

        const result = orderReducer(added, {
            type: "UPDATE_QUANTITY",
            payload: {
                productId: keyboard.id,
                quantity: 0,
            },
        });

        expect(result.lines[0].quantity).toBe(1);
    });

    it("clamps discount between 0 and 100", () => {
        const result = orderReducer(initialOrder, {
            type: "SET_DISCOUNT",
            payload: 120,
        });

        expect(result.discountPercent).toBe(100);
    });

    it("calculates total after discount", () => {
        const order = {
            lines: [
                {
                    productId: 1,
                    name: "Keyboard",
                    price: 500000,
                    quantity: 2,
                },
            ],
            discountPercent: 10,
        };

        expect(calculateOrderTotal(order)).toEqual({
            subtotal: 1000000,
            discountAmount: 100000,
            total: 900000,
        });
    });
});
