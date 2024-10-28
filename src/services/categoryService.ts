import api from "./api";

const categoryService = {
  getCategories: async () => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get(`/api/Category/ListCategories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  getCategoryById: async (id: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get(`/api/Category/CategoryById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  createCategory: async (name: string) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const body = {
        name
    }
    const res = await api.post(`/api/Category/CreateCategory`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  updateCategory: async (id: number, name: string) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const body = {
        id,
        name
    }
    const res = await api.put(`/api/Category/UpdateCategory`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  deleteCategory: async (id: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.delete(`/api/Category/DeleteCategory/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
};

export default categoryService;
