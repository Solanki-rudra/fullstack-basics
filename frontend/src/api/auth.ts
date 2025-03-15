import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const registerUser = async (formData: FormData) => {
  try {
    const response = await api.post("/api/v1/users/register", formData);
    return response.data; 
  } catch (error: any) {
    throw error.response?.data || "Something went wrong";
  }
};

export default api;
