// src/services/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:9001",   // <– HCMUT_DATACORE backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

