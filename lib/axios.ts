import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // Removed global application/json header so Axios automatically detects FormData vs JSON
  withCredentials: true,
});