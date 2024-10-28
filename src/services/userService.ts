import api from "./api";

const userService = {
  pointsByUser: async () => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get("/api/Users/ListPointsByUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  loggedUser: async () => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get("/api/Users/LoggedUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  getListClientUsers: async () => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get("/api/Users/ListUsersClient", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  getListUsersAdmin: async () => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get("/api/Users/ListUsersAdmin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  createUserAdmin: async (firstName: string, lastName: string, email: string, phoneNumber: string, password: string) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const body = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password
    };
    const res = await api.post("/api/Users/CreateUserAdmin", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  updateLoggedUser: async (firstName: string, lastName: string, phoneNumber: string) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const body = {
      firstName,
      lastName,
      phoneNumber,
    };
    const res = await api.put("/api/Users/UpdateUser", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  updatePasswordLoggedUser: async (newPassword: string, passwordConfirmation: string) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const body = {
      newPassword,
      passwordConfirmation,
    };
    const res = await api.put("/api/Users/UpdateUserPassword", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  deleteUser: async (id: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const res = await api.delete("/api/Users/DeleteUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id
      }
    });
    return res;
  },
};

export default userService;
