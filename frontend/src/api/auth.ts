import { apiHandler } from "../utils/apiHandler";
import api from "./api";

// Register User
export const registerUser = (formData: FormData) =>
    apiHandler(() =>
        api.post("/api/v1/users/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }).then(res => res.data)
    );

// Login User
export const loginUser = (data: { email: string; password: string }) =>
    apiHandler(() =>
        api.post("/api/v1/users/login", data).then(res => res.data)
    );

export default { registerUser, loginUser };
