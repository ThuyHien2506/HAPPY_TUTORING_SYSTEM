// src/services/apiClient.js
import axios from "axios";

// Happy Tutoring System backend (port 8081)
export const happyApiClient = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// HCMUT Datacore backend (port 9001) - for subjects, tutors, enrollments
export const datacoreApiClient = axios.create({
  baseURL: "http://localhost:9001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Default export for backward compatibility
const apiClient = happyApiClient;
export default apiClient;

