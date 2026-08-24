import axios from "axios";

export const apiClient = axios.create({
  // Fall back to empty string so requests are relative (e.g., "/api/register")
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "",
  withCredentials: true,
});