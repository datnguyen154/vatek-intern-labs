interface OrderSearchProps {
    keyword: string;
    onKeywordChange: (value: string) => void;
}

export default function OrderSearch({
    keyword,
    onKeywordChange,
}: OrderSearchProps) {
    return (
        <input
            type="search"
            className="order-search"
            placeholder="Search by order code or customer..."
            aria-label="Search orders"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
        />
    );
}
