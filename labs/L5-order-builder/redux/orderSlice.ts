import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Product, DraftOrder } from "../shared/orderTypes";

import { initialOrder, orderReducer } from "../shared/orderReducer";

const orderSlice = createSlice({
    name: "draftOrder",
    initialState: initialOrder,

    reducers: {
        addLine(state, action: PayloadAction<Product>): DraftOrder {
            return orderReducer(state, {
                type: "ADD_LINE",
                payload: action.payload,
            });
        },

        removeLine(state, action: PayloadAction<number>): DraftOrder {
            return orderReducer(state, {
                type: "REMOVE_LINE",
                payload: action.payload,
            });
        },

        updateQuantity(
            state,
            action: PayloadAction<{
                productId: number;
                quantity: number;
            }>,
        ): DraftOrder {
            return orderReducer(state, {
                type: "UPDATE_QUANTITY",
                payload: action.payload,
            });
        },

        setDiscount(state, action: PayloadAction<number>): DraftOrder {
            return orderReducer(state, {
                type: "SET_DISCOUNT",
                payload: action.payload,
            });
        },
    },
});

export const { addLine, removeLine, updateQuantity, setDiscount } =
    orderSlice.actions;

export default orderSlice.reducer;
