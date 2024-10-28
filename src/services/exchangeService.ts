import api from "./api";

const exchangeService = {
  createExchange: async (userId: number, productId: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const body = { userId, productId };
    const res = await api.post("/api/Exchanges/CreateExchange", body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res;
  },
  confirmExchange: async (exchangeId: number) => {
    const authToken = sessionStorage.getItem("barbercoffee-token");
    if (!authToken) throw new Error("Token não encontrado");
 
    const res = await api.put(
      `/api/Exchanges/ConfirmExchange?exchangeId=${exchangeId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    return res;
  },
  getExchangeByToken: async (token: string) => {
    const sessionToken = sessionStorage.getItem("barbercoffee-token");
    if (!sessionToken) throw new Error("Token não encontrado");
    console.log(`Parametros enviados para API: ExchangeID: ${token}`);
    const res = await api.get(`/api/Exchanges/GetExchangeByToken`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      params: {
        token
      }
    });
    return res;
  },
  exchangeByCurrentUser: async (dateIni: string, dateFim: string) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api.get("/api/Exchanges/GetExchangeByCurrentUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        dateIni,
        dateFim,
      },
    });
    return res;
  },
  getListExchangeByDate: async (dateIni: string, dateFim: string) => {
    const sessionToken = sessionStorage.getItem("barbercoffee-token");
    if (!sessionToken) throw new Error("Token não encontrado");

    const res = await api.get(`/api/Exchanges/ListExchangesByDate`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      params: {
        dateIni,
        dateFim
      }
    });
    return res;
  },
};

export default exchangeService;
