import axios from "axios";
import { API_BASE_URL } from "../config/appConfig";

const axiosClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosClient.interceptors.response.use(
    (res) => res.data,
    (err) => {
        console.log("API ERROR:", err.response?.data || err.message);
        return Promise.reject(err);
    }
);

export default axiosClient;