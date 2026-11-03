const API_URL = "http://localhost:3001/orders";

const orderList = document.querySelector("#order-list");
const statusElement = document.querySelector("#status");
const searchInput = document.querySelector("#search-input");
const retryButton = document.querySelector("#retry-btn");
let activeController = null;
let latestRequestId = 0;

function renderOrders(orders) {
    orderList.replaceChildren();

    orders.forEach((order) => {
        const item = document.createElement("li");

        item.textContent = `${order.code} — ${order.customerName} — ${order.status}`;

        orderList.appendChild(item);
    });
}

function updateStatus(message, showRetry = false) {
    statusElement.textContent = message;
    retryButton.hidden = !showRetry;
}

async function loadOrders(keyword = "") {
    activeController?.abort();

    const controller = new AbortController();
    activeController = controller;

    const requestId = ++latestRequestId;

    const query = keyword.trim();

    const url = query ? `${API_URL}?q=${encodeURIComponent(query)}` : API_URL;

    orderList.replaceChildren();
    updateStatus("Loading orders...");

    try {
        const response = await fetch(url, {
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const orders = await response.json();

        const normalizedQuery = query.toLowerCase();

        const filteredOrders = orders.filter((order) => {
            return (
                order.code.toLowerCase().includes(normalizedQuery) ||
                order.customerName.toLowerCase().includes(normalizedQuery)
            );
        });

        if (requestId !== latestRequestId) {
            return;
        }

        if (filteredOrders.length === 0) {
            updateStatus("No orders found");
            return;
        }

        renderOrders(filteredOrders);
        updateStatus(`Found ${filteredOrders.length} orders`);
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            return;
        }

        if (requestId !== latestRequestId) {
            return;
        }

        console.error("Failed to load orders:", error);

        orderList.replaceChildren();
        updateStatus("Failed to load orders. Please try again.", true);
    } finally {
        if (requestId === latestRequestId) {
            activeController = null;
        }
    }
}

function debounce(callback, delay) {
    let timerId;

    return function (...args) {
        clearTimeout(timerId);

        timerId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

const debouncedSearch = debounce((keyword) => {
    loadOrders(keyword);
}, 300);

searchInput.addEventListener("input", (event) => {
    activeController?.abort();
    latestRequestId++;

    const keyword = event.target.value;

    orderList.replaceChildren();
    updateStatus("Waiting for search...");

    debouncedSearch(keyword);
});

retryButton.addEventListener("click", () => {
    loadOrders(searchInput.value);
});

loadOrders();
