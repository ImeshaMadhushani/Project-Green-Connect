import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000", // Replace with your backend's URL if not localhost
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
