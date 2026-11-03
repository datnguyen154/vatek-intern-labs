import type { Order, OrderStatus, OrderLine } from "./types";

export function groupOrdersByStatus(
    orders: Order[],
): Partial<Record<OrderStatus, Order[]>> {
    return orders.reduce<Partial<Record<OrderStatus, Order[]>>>(
        (groups, order) => {
            const status = order.status;

            if (!groups[status]) {
                groups[status] = [];
            }

            groups[status].push(order);

            return groups;
        },
        {},
    );
}

export function sortOrdersByDate(
    orders: Order[],
    direction: "asc" | "desc" = "desc",
): Order[] {
    return [...orders].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return direction === "asc" ? dateA - dateB : dateB - dateA;
    });
}

export function sortOrdersByTotal(
    orders: Order[],
    direction: "asc" | "desc" = "desc",
): Order[] {
    return [...orders].sort((a, b) =>
        direction === "asc" ? a.total - b.total : b.total - a.total,
    );
}

export function paginateOrders(
    orders: Order[],
    page: number,
    pageSize: number,
): Order[] {
    if (
        !Number.isInteger(page) ||
        !Number.isInteger(pageSize) ||
        page < 1 ||
        pageSize < 1
    ) {
        return [];
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return orders.slice(startIndex, endIndex);
}

export function calculateOrderSubtotal(lines: OrderLine[]): number {
    return lines.reduce((subtotal, line) => {
        return subtotal + line.quantity * line.unitPrice;
    }, 0);
}

export function formatCurrency(
    amount: number,
    currency: "VND" | "USD" = "VND",
): string {
    const locale = currency === "VND" ? "vi-VN" : "en-US";

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}

export function formatDate(
    dateString: string,
    locale: "vi-VN" | "en-US" = "vi-VN",
): string {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Invalid Date";
    }

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
    }).format(date);
}

export function calculateOrderTotal(
    lines: OrderLine[],
    discountPercent: number,
    taxPercent: number,
): number {
    const subtotal = calculateOrderSubtotal(lines);

    const discountAmount = Math.round((subtotal * discountPercent) / 100);

    const taxableAmount = subtotal - discountAmount;

    const taxAmount = Math.round((taxableAmount * taxPercent) / 100);

    return taxableAmount + taxAmount;
}
