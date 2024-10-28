import api from "./api";

const pointService = {
  createPoint: async (scheduleId: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const body = { scheduleId };

    const res = await api.post("/api/Points/CreatePoint", body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res;
  },
};

export default pointService;
