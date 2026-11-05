import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import orderReducer from "./orderSlice";

export function createOrderStore() {
    return configureStore({
        reducer: {
            draftOrder: orderReducer,
        },
    });
}

export const store = createOrderStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
