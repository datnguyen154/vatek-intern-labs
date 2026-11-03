import { describe, expect, it } from "vitest";
import {
    groupOrdersByStatus,
    sortOrdersByDate,
    sortOrdersByTotal,
    paginateOrders,
    calculateOrderSubtotal,
    formatCurrency,
    formatDate,
    calculateOrderTotal,
} from "./order-utils";
import type { Order, OrderLine } from "./types";

const createOrder = (id: number, status: Order["status"]): Order => ({
    id,
    code: `ORD-${id}`,
    customerId: 1,
    customerName: "Test Customer",
    createdBy: 1,
    status,
    lines: [],
    subtotal: 0,
    discountPercent: 0,
    discountAmount: 0,
    taxPercent: 10,
    taxAmount: 0,
    total: 0,
    currency: "VND",
    createdAt: "2026-07-01T08:00:00+07:00",
    updatedAt: "2026-07-01T08:00:00+07:00",
    paidAt: null,
    fulfilledAt: null,
    cancelledAt: null,
});

describe("groupOrdersByStatus", () => {
    it("groups orders by status", () => {
        const orders = [
            createOrder(1, "PAID"),
            createOrder(2, "DRAFT"),
            createOrder(3, "PAID"),
        ];

        const result = groupOrdersByStatus(orders);

        expect(result.PAID).toEqual([orders[0], orders[2]]);
        expect(result.DRAFT).toEqual([orders[1]]);
    });

    it("returns an empty object for an empty list", () => {
        expect(groupOrdersByStatus([])).toEqual({});
    });

    it("does not mutate the input array", () => {
        const orders = [createOrder(1, "PAID")];
        const original = [...orders];

        groupOrdersByStatus(orders);

        expect(orders).toEqual(original);
    });
});

describe("sortOrdersByDate", () => {
    const order1 = {
        ...createOrder(1, "PAID"),
        createdAt: "2026-07-03T10:00:00+07:00",
    };

    const order2 = {
        ...createOrder(2, "DRAFT"),
        createdAt: "2026-07-01T08:00:00+07:00",
    };

    const order3 = {
        ...createOrder(3, "PAID"),
        createdAt: "2026-07-02T12:00:00+07:00",
    };

    const orders = [order1, order2, order3];

    it("sorts orders by date ascending", () => {
        const result = sortOrdersByDate(orders, "asc");

        expect(result.map((order) => order.id)).toEqual([2, 3, 1]);
    });

    it("sorts orders by date descending by default", () => {
        const result = sortOrdersByDate(orders);

        expect(result.map((order) => order.id)).toEqual([1, 3, 2]);
    });

    it("does not mutate the original array", () => {
        const original = [...orders];

        sortOrdersByDate(orders, "asc");

        expect(orders).toEqual(original);
    });

    it("returns an empty array for empty input", () => {
        expect(sortOrdersByDate([])).toEqual([]);
    });
});

describe("sortOrdersByTotal", () => {
    const orders = [
        { ...createOrder(1, "PAID"), total: 500000 },
        { ...createOrder(2, "DRAFT"), total: 100000 },
        { ...createOrder(3, "PAID"), total: 300000 },
    ];

    it("sorts by total ascending", () => {
        const result = sortOrdersByTotal(orders, "asc");

        expect(result.map((order) => order.id)).toEqual([2, 3, 1]);
    });

    it("sorts by total descending by default", () => {
        const result = sortOrdersByTotal(orders);

        expect(result.map((order) => order.id)).toEqual([1, 3, 2]);
    });

    it("does not mutate the original array", () => {
        const original = [...orders];

        sortOrdersByTotal(orders);

        expect(orders).toEqual(original);
    });

    it("handles an empty array", () => {
        expect(sortOrdersByTotal([])).toEqual([]);
    });
});

describe("paginateOrders", () => {
    const orders = Array.from({ length: 12 }, (_, index) =>
        createOrder(index + 1, "PAID"),
    );

    it("returns orders from the first page", () => {
        const result = paginateOrders(orders, 1, 5);

        expect(result.map((order) => order.id)).toEqual([1, 2, 3, 4, 5]);
    });

    it("returns orders from the second page", () => {
        const result = paginateOrders(orders, 2, 5);

        expect(result.map((order) => order.id)).toEqual([6, 7, 8, 9, 10]);
    });

    it("handles a partially filled last page", () => {
        const result = paginateOrders(orders, 3, 5);

        expect(result.map((order) => order.id)).toEqual([11, 12]);
    });

    it("returns an empty array for out-of-range pages", () => {
        expect(paginateOrders(orders, 5, 5)).toEqual([]);
    });

    it("handles invalid pagination parameters", () => {
        expect(paginateOrders(orders, 0, 5)).toEqual([]);
        expect(paginateOrders(orders, 1, 0)).toEqual([]);
        expect(paginateOrders(orders, 1.5, 5)).toEqual([]);
    });

    it("does not mutate the original array", () => {
        const original = [...orders];

        paginateOrders(orders, 2, 5);

        expect(orders).toEqual(original);
    });
});

describe("calculateOrderSubtotal", () => {
    const lines: OrderLine[] = [
        {
            lineNo: 1,
            productId: 1,
            sku: "PEN-001",
            productName: "Pen",
            quantity: 3,
            unitPrice: 20000,
            lineTotal: 60000,
        },
        {
            lineNo: 2,
            productId: 2,
            sku: "BOOK-001",
            productName: "Notebook",
            quantity: 2,
            unitPrice: 50000,
            lineTotal: 100000,
        },
    ];

    it("calculates subtotal from quantities and prices", () => {
        expect(calculateOrderSubtotal(lines)).toBe(160000);
    });

    it("returns zero for an empty array", () => {
        expect(calculateOrderSubtotal([])).toBe(0);
    });

    it("calculates from quantity and unitPrice", () => {
        const changedLines = [{ ...lines[0], lineTotal: 999999 }];

        expect(calculateOrderSubtotal(changedLines)).toBe(60000);
    });

    it("does not mutate the input", () => {
        const original = structuredClone(lines);

        calculateOrderSubtotal(lines);

        expect(lines).toEqual(original);
    });
});

describe("formatCurrency", () => {
    it("formats VND without decimal places", () => {
        const result = formatCurrency(1500000, "VND");

        expect(result).toContain("1.500.000");
        expect(result).toContain("₫");
    });

    it("formats USD with two decimal places", () => {
        const result = formatCurrency(1500.5, "USD");

        expect(result).toBe("$1,500.50");
    });

    it("uses VND as the default currency", () => {
        expect(formatCurrency(100000)).toContain("100.000");
    });
});

describe("formatDate", () => {
    const date = "2026-07-01T08:58:06+07:00";

    it("formats date using Vietnamese locale by default", () => {
        expect(formatDate(date)).toBe("01/07/2026");
    });

    it("formats date using US locale", () => {
        expect(formatDate(date, "en-US")).toBe("07/01/2026");
    });

    it("handles invalid date strings", () => {
        expect(formatDate("invalid")).toBe("Invalid Date");
    });

    it("uses Vietnam timezone consistently", () => {
        const utcDate = "2026-07-01T18:00:00Z";

        expect(formatDate(utcDate)).toBe("02/07/2026");
    });
});

describe("calculateOrderTotal", () => {
    const lines: OrderLine[] = [
        {
            lineNo: 1,
            productId: 1,
            sku: "TEST-001",
            productName: "Test Product",
            quantity: 2,
            unitPrice: 500000,
            lineTotal: 1000000,
        },
    ];

    it("calculates total with discount and tax", () => {
        expect(calculateOrderTotal(lines, 10, 10)).toBe(990000);
    });

    it("calculates total without discount", () => {
        expect(calculateOrderTotal(lines, 0, 10)).toBe(1100000);
    });

    it("handles empty order lines", () => {
        expect(calculateOrderTotal([], 10, 10)).toBe(0);
    });
});
