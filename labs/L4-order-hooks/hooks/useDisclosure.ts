import { useState } from "react";

interface UseDisclosureResult {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export function useDisclosure(initialState = false): UseDisclosureResult {
    const [isOpen, setIsOpen] = useState(initialState);

    function open() {
        setIsOpen(true);
    }

    function close() {
        setIsOpen(false);
    }

    function toggle() {
        setIsOpen((prev) => !prev);
    }

    return {
        isOpen,
        open,
        close,
        toggle,
    };
}
