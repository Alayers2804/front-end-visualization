import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000",
  timeout: 1200000,
});

export default api;