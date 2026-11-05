export interface Product {
    id: number;
    name: string;
    price: number;
}

export interface OrderLine {
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

export interface DraftOrder {
    lines: OrderLine[];
    discountPercent: number;
}

export type OrderAction =
    | { type: "ADD_LINE"; payload: Product }
    | { type: "REMOVE_LINE"; payload: number }
    | {
          type: "UPDATE_QUANTITY";
          payload: { productId: number; quantity: number };
      }
    | { type: "SET_DISCOUNT"; payload: number };
