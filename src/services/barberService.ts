import api from "./api";

const barberService = {
  getBarbers: async () => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get("/api/Barbers/ListBarbers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  getBarbersbyId: async (id: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get(`/api/Barbers/FindBarberById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  createBarber: async (name: string) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const body = JSON.stringify({ name });

    const res = await api.post(`/api/Barbers/CreateBarber`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res;
  },
  updateBarber: async (id: number, name: string) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const body = {
      id,
      name,
    };
    const res = await api.put(`/api/Barbers/UpdateBarber`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
  deleteBarber: async (id: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.delete(`/api/Barbers/DeleteBarber/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  },
};

export default barberService;
