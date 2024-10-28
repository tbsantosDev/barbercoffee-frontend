import { LoginRequest, RegisterRequest, ResetPassword } from "@/types/auth";
import api from "./api";

const loginService = {
  login: async (params: LoginRequest) => {
    const res = await api.post("/api/Auth/login", params).catch((error) => {
      if (error.response.status === 400 || error.response.status === 401) {
        return error.response;
      }
      return error;
    });

    if (res.status === 200 || res.status === 204) {
      sessionStorage.setItem("barbercoffee-token", res.data.token);
    }
    return res;
  },
  register: async (params: RegisterRequest) => {
    const res = await api.post("/api/Auth/register", params).catch((error) => {
      if (error.response.status === 400 || error.response.status === 401) {
        return error.response;
      }
      return error;
    });
    return res;
  },
  RequestPasswordReset: async (email: string) => {  
      const res = await api.post("/api/Users/requestPasswordReset", email, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res;
    },
  ResetPassword: async (params: ResetPassword) => {
    const res = await api
      .post("/api/Users/resetPassword", params)
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 401) {
          return error.response;
        }
        return error;
      });
    return res;
  },
  confirmEmail: async (token: string) => {
    console.log(`Token enviado à API: ${token}`);
    
    const res = await api.patch(`/api/Auth/confirm-email`, null, {
      params: { token },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    return res;
  },
};

export default loginService;
