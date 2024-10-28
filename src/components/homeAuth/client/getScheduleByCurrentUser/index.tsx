"use client";
import { useMemo, useState, useEffect } from "react";
import scheduleService from "@/services/scheduleService";
import barberService from "@/services/barberService";
import { ScheduleDataByCurrentUser } from "@/types/schedule";
import { Barber } from "@/types/barber";
import { toast } from "react-toastify";
import { format } from "date-fns";
import EditModal from "../editModal";
import PageSpinner from "@/components/common/pageSpinner";

const GetScheduleByCurrentUser = () => {
  const [schedules, setSchedules] = useState<ScheduleDataByCurrentUser[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [pageIndex, setPageIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<ScheduleDataByCurrentUser | null>(null);

  const pageSize = 10;

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const res = await barberService.getBarbers();
        if (res.status === 200) {
          setBarbers(res.data.dados);
        } else {
          toast.error("Erro ao carregar barbeiros.");
        }
      } catch (error) {
        console.error("Erro ao buscar barbeiros:", error);
        toast.error("Erro ao carregar dados dos barbeiros.");
      }
    };

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    setStartDate(format(startOfMonth, "yyyy-MM-dd"));
    setEndDate(format(today, "yyyy-MM-dd"));

    fetchBarbers();
  }, []);

  const fetchSchedules = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor, preencha as duas datas.");
      return;
    }

    setLoading(true);

    try {
      const res = await scheduleService.getSchedulesByCurrentUser(
        `${startDate}T00:00:00`,
        `${endDate}T23:59:59`
      );

      if (res.status === 200) {
        setSchedules(res.data.dados ?? []);
        setPageIndex(0);
      } else {
        toast.error(res.data.message);
        setSchedules([]);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      toast.error("Erro ao carregar histórico de agendamentos.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule: ScheduleDataByCurrentUser) => {
    setEditData(schedule);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (updatedSchedule: ScheduleDataByCurrentUser) => {
    try {
      const dateTime = new Date(updatedSchedule.dateTime);

      const localDateTime = new Date(
        dateTime.getTime() - dateTime.getTimezoneOffset() * 60000
      ).toISOString();

      const res = await scheduleService.updateSchedule(
        updatedSchedule.id,
        localDateTime,
        updatedSchedule.barberId
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        setIsEditModalOpen(false);
        fetchSchedules();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      toast.error("Erro no servidor.");
    }
  };

  const getBarberName = (barberId: number) => {
    const barber = barbers.find((b) => b.id === barberId);
    return barber ? barber.name : "Desconhecido";
  };

  const currentPageData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return schedules.slice(start, end);
  }, [schedules, pageIndex]);

  const totalPages = Math.ceil(schedules.length / pageSize);

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Histórico de Agendamentos.
      </h1>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2 text-black"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2 text-black"
        />
      </div>

      <button
        onClick={fetchSchedules}
        className="w-full max-w-md bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors mb-6"
      >
        Buscar Histórico
      </button>

      {loading ? (
        <PageSpinner />
      ) : currentPageData.length > 0 ? (
        <>
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-sky-600">
                  <th className="border border-gray-300 p-2 text-left">Data e Hora</th>
                  <th className="border border-gray-300 p-2 text-left">Corte Realizado</th>
                  <th className="border border-gray-300 p-2 text-left">Barbeiro</th>
                  <th className="border border-gray-300 p-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((schedule, index) => {
                  const isPastDate = new Date(schedule.dateTime) < new Date();
                  return (
                    <tr key={index} className="hover:bg-sky-600">
                      <td className="border border-gray-300 p-2">
                        {format(new Date(schedule.dateTime), "dd/MM/yyyy, HH:mm")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {schedule.cutTheHair ? "Sim" : "Não"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {getBarberName(schedule.barberId)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={() => !isPastDate && handleEdit(schedule)}
                          disabled={isPastDate}
                          className={`px-4 py-2 rounded ${
                            isPastDate
                              ? "bg-gray-300 text-black cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p>Quantidade de registros: {schedules.length}</p>
          </div>

          <div className="flex justify-between items-center mt-4 w-full">
            <button
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 text-black rounded-md disabled:bg-gray-300"
            >
              Anterior
            </button>
            <span>Página {pageIndex + 1} de {totalPages}</span>
            <button
              onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={pageIndex === totalPages - 1}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 text-black rounded-md disabled:bg-gray-300"
            >
              Próxima
            </button>
          </div>
        </>
      ) : (
        <p className="mt-4">Nenhum agendamento encontrado.</p>
      )}

      {isEditModalOpen && editData && (
        <EditModal
          schedule={editData}
          barbers={barbers}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default GetScheduleByCurrentUser;
