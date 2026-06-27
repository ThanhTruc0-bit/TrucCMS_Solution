import axiosClient from "../api/axiosClient";

export const createOrder = (data) => {
    return axiosClient.post("/orders", data);
};

export const getOrdersByCustomer = (customerId) => {
    return axiosClient.get(`/orders/customer/${customerId}`);
};