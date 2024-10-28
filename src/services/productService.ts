import api from "./api";

const productService = {
  getProducts: async () => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get(`/api/Products/ListProducts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  productsByCategoryId: async (id: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get(`/api/Products/ListProductsByCategoryId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  getProductsById: async (id: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get(`/api/Products/ProductsById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  createProduct: async (formData: FormData) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const res = await api.post(`/api/Products/CreateProduct`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res;
  },
  updateProduct: async (formData: FormData) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const res = await api.put(`/api/Products/UpdateProduct`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  },
  deleteProduct: async (id: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.delete(`/api/Products/DeleteProduct/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
};

export default productService;
