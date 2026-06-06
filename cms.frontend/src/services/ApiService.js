const BASE_URL = "https://localhost:7194/api";

// ===== AUTH =====
export const login = async (data) => {
    const res = await fetch(`${BASE_URL}/Auth/CustomerLogin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.json();
};

export const register = async (data) => {
    const res = await fetch(`${BASE_URL}/Auth/CustomerRegister`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.json();
};

// ===== PRODUCTS =====
export const getProducts = async () => {
    const res = await fetch(`${BASE_URL}/Products`);
    return res.json();
};

export const getProductById = async (id) => {
    const res = await fetch(`${BASE_URL}/Products/${id}`);
    return res.json();
};

// ===== CATEGORY =====
export const getCategories = async () => {
    const res = await fetch(`${BASE_URL}/CategoriesProducts`);
    return res.json();
};

// ===== POSTS =====
export const getPosts = async () => {
    const res = await fetch(`${BASE_URL}/Posts`);
    return res.json();
};

// ===== ORDER =====
export const createOrder = async (data) => {
    const res = await fetch(`${BASE_URL}/Orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.json();
};

export const getOrdersByCustomer = async (customerId) => {
    const res = await fetch(`${BASE_URL}/Orders/customer/${customerId}`);
    return res.json();
};