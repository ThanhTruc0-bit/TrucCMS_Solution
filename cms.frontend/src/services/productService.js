import axiosClient from "./axiosClient";

// 🔥 sản phẩm bán chạy
export const getHotProducts = () => {
    return axiosClient.get("/Products/hot");
};

// 🆕 sản phẩm mới
export const getLatestProducts = () => {
    return axiosClient.get("/Products/latest");
};

// 📦 danh sách có phân trang
export const getProducts = (params) => {
    return axiosClient.get("/Products/paging", { params });
};

// 🔍 chi tiết
export const getProductById = (id) => {
    return axiosClient.get(`/Products/${id}`);
};