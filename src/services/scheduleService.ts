import { ScheduleRequest } from "@/types/schedule";
import api from "./api";

const scheduleService = {
  availableSlots: async (barberId: number, date: string) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const res = await api.get(`/api/Schedules/AvailableSlots`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        barberId,
        date,
      },
    });

    return res;
  },
  getSchedulesByCurrentUser: async (dateIni: string, dateFim: string) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const res = await api.get(`/api/Schedules/ListSchedulesByCurrentUserId`, {
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
  createSchedule: async (params: ScheduleRequest) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api
      .post("/api/Schedules/CreateSchedule", params, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 401) {
          return error.response;
        }
        return error;
      });
    return res;
  },
  updateSchedule: async (id: number, dateTime: string, barberId: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const body = { id, dateTime, barberId };
    const res = await api
      .put("/api/Schedules/UpdateSchedule", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 401) {
          return error.response;
        }
        return error;
      });
    return res;
  },
  deleteSchedule: async (id: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");
    const res = await api
      .delete("/api/Schedules/DeleteSchedule", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 401) {
          return error.response;
        }
        return error;
      });
    return res;
  },
  listSchedules: async (dateIni: string, dateFim: string, barberId: number) => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) throw new Error("Token não encontrado");

    const res = await api.get(`/api/Schedules/ListSchedules`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        dateIni,
        dateFim,
        barberId
      },
    });
    return res;
  },
};
export default scheduleService;
