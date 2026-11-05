import { create } from "zustand";

import type { DraftOrder, Product } from "../shared/orderTypes";

import { initialOrder, orderReducer } from "../shared/orderReducer";

interface OrderStore extends DraftOrder {
    addLine: (product: Product) => void;
    removeLine: (productId: number) => void;

    updateQuantity: (productId: number, quantity: number) => void;

    setDiscount: (discount: number) => void;
}

export const useOrderStore = create<OrderStore>()((set) => ({
    ...initialOrder,

    addLine: (product) =>
        set((state) =>
            orderReducer(state, {
                type: "ADD_LINE",
                payload: product,
            }),
        ),

    removeLine: (productId) =>
        set((state) =>
            orderReducer(state, {
                type: "REMOVE_LINE",
                payload: productId,
            }),
        ),

    updateQuantity: (productId, quantity) =>
        set((state) =>
            orderReducer(state, {
                type: "UPDATE_QUANTITY",
                payload: { productId, quantity },
            }),
        ),

    setDiscount: (discount) =>
        set((state) =>
            orderReducer(state, {
                type: "SET_DISCOUNT",
                payload: discount,
            }),
        ),
}));
