const API = "https://localhost:7194";
const BASE_URL = `${API}/api`;

const request = async (url, options = {}) => {
    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error("API ERROR:", error);
        throw error;
    }
};

// ===== AUTH =====
export const login = (data) => {
    return request(`${BASE_URL}/Auth/CustomerLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};

export const register = (data) => {
    return request(`${BASE_URL}/Auth/CustomerRegister`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};

// ===== PRODUCTS =====
export const getProducts = () => request(`${BASE_URL}/Products`);
export const getProductById = (id) => request(`${BASE_URL}/Products/${id}`);

// ===== CATEGORY =====
export const getCategories = () => request(`${BASE_URL}/CategoriesProducts`);

// ===== POSTS =====
export const getPosts = () => request(`${BASE_URL}/Posts`);

// ✅ FIX QUAN TRỌNG
export const getPostById = (id) => request(`${BASE_URL}/Posts/${id}`);

// ===== ORDER =====
export const createOrder = (data) => {
    return request(`${BASE_URL}/Orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
};

export const getOrdersByCustomer = (customerId) =>
    request(`${BASE_URL}/Orders/customer/${customerId}`);