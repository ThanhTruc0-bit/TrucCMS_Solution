import axiosClient from "./axiosClient";

export const getCategories = async () => {
    try {
        const data = await axiosClient.get("/CategoriesProducts");
        return data; // axiosClient đã return res.data rồi
    } catch (error) {
        console.log("Lỗi API Category:", error);
        return [];
    }
};