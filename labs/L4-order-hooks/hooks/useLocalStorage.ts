import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

export function useLocalStorage<T>(
    key: string,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(key);

            return storedValue !== null
                ? (JSON.parse(storedValue) as T)
                : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
           
        }
    }, [key, value]);

    return [value, setValue];
}
