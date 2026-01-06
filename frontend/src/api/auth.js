import axios from "axios";

const API = axios.create({
  baseURL: "https://lovit.vercel.app/api", // make sure your backend URL is correct
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getUserById = (id) => API.get(`/users/${id}`);
