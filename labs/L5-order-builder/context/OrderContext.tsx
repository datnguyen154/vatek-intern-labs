import { createContext, useContext, useReducer } from "react";
import type { ReactNode, Dispatch } from "react";

import type { DraftOrder, OrderAction } from "../shared/orderTypes";

import { initialOrder, orderReducer } from "../shared/orderReducer";

interface OrderContextValue {
    order: DraftOrder;
    dispatch: Dispatch<OrderAction>;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [order, dispatch] = useReducer(orderReducer, initialOrder);

    return (
        <OrderContext.Provider value={{ order, dispatch }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrderContext() {
    const context = useContext(OrderContext);

    if (!context) {
        throw new Error("useOrderContext must be used inside OrderProvider");
    }

    return context;
}
