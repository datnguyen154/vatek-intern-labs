import { beforeEach, describe, expect, it } from "vitest";

import { useOrderStore } from "./orderStore";
import { initialOrder, calculateOrderTotal } from "../shared/orderReducer";

const keyboard = {
    id: 1,
    name: "Keyboard",
    price: 500000,
};

describe("Zustand Order Builder", () => {
    beforeEach(() => {
        // Reset dữ liệu giữa các tests, giữ nguyên actions
        useOrderStore.setState(initialOrder);
    });

    it("starts with an empty draft", () => {
        const state = useOrderStore.getState();

        expect(state.lines).toEqual([]);
        expect(state.discountPercent).toBe(0);
    });

    it("adds a product", () => {
        useOrderStore.getState().addLine(keyboard);

        expect(useOrderStore.getState().lines).toHaveLength(1);
    });

    it("increases quantity for an existing product", () => {
        useOrderStore.getState().addLine(keyboard);
        useOrderStore.getState().addLine(keyboard);

        const lines = useOrderStore.getState().lines;

        expect(lines).toHaveLength(1);
        expect(lines[0].quantity).toBe(2);
    });

    it("updates quantity with minimum of 1", () => {
        useOrderStore.getState().addLine(keyboard);
        useOrderStore.getState().updateQuantity(1, 0);

        expect(useOrderStore.getState().lines[0].quantity).toBe(1);
    });

    it("removes a product", () => {
        useOrderStore.getState().addLine(keyboard);
        useOrderStore.getState().removeLine(1);

        expect(useOrderStore.getState().lines).toHaveLength(0);
    });

    it("applies discount and calculates total", () => {
        useOrderStore.getState().addLine(keyboard);
        useOrderStore.getState().setDiscount(10);

        const { lines, discountPercent } = useOrderStore.getState();

        const result = calculateOrderTotal({
            lines,
            discountPercent,
        });

        expect(result).toEqual({
            subtotal: 500000,
            discountAmount: 50000,
            total: 450000,
        });
    });
});
