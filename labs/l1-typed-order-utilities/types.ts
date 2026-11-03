export type OrderStatus =
    | "DRAFT"
    | "PENDING_PAYMENT"
    | "PAID"
    | "FULFILLED"
    | "CANCELLED";

export type Currency = "VND";

export interface OrderLine {
    lineNo: number;
    productId: number;
    sku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

export interface Order {
    id: number;
    code: string;
    customerId: number;
    customerName: string;
    createdBy: number;
    status: OrderStatus;
    lines: OrderLine[];
    subtotal: number;
    discountPercent: number;
    discountAmount: number;
    taxPercent: number;
    taxAmount: number;
    total: number;
    currency: Currency;
    createdAt: string;
    updatedAt: string;
    paidAt: string | null;
    fulfilledAt: string | null;
    cancelledAt: string | null;
}
