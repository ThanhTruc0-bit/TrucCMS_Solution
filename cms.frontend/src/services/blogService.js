import axiosClient from "./axiosClient";

// 📰 danh sách bài viết
export const getPosts = () => {
    return axiosClient.get("/Posts");
};

// 🔍 chi tiết bài viết
export const getPostById = (id) => {
    return axiosClient.get(`/Posts/${id}`);
};