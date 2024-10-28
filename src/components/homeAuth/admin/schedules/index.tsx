import React, { useEffect, useState, useMemo } from "react";
import scheduleService from "@/services/scheduleService";
import barberService from "@/services/barberService";
import pointService from "@/services/pointService";
import { toast } from "react-toastify";
import { format, isBefore, parseISO } from "date-fns";
import PageSpinner from "@/components/common/pageSpinner";
import Modal from "@/components/common/modal";
import userService from "@/services/userService";

interface Schedule {
  id: number;
  userId: number;
  dateTime: string;
  cutTheHair: boolean;
}

const Schedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [barbers, setBarbers] = useState<{ id: number; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: number; firstName: string; email: string }[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const pageSize = 10;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    setStartDate(format(today, "yyyy-MM-dd"));
    setEndDate(format(today, "yyyy-MM-dd"));
    loadBarbers();
    loadUsers();
    //fetchSchedules();
  }, []);

  const loadBarbers = async () => {
    try {
      const res = await barberService.getBarbers();
      if (res.status === 200) {
        setBarbers(res.data.dados);
      } else {
        toast.error("Erro ao carregar barbeiros.");
      }
    } catch (error) {
      console.error("Erro ao buscar barbeiros:", error);
      toast.error("Erro ao carregar barbeiros.");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await userService.getListClientUsers();
      if (res.status === 200) {
        setUsers(res.data.dados);
      } else {
        toast.error("Erro ao carregar usuários.");
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar usuários.");
    }
  };

  const fetchSchedules = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor, preencha ambas as datas.");
      return;
    }

    const barberId = selectedBarber ?? 0;
    setLoading(true);

    try {
      const res = await scheduleService.listSchedules(
        `${startDate}T00:00:00`,
        `${endDate}T23:59:59`,
        barberId
      );

      if (res.status === 200) {
        setSchedules(res.data.dados ?? []);
        setPageIndex(0);
      } else {
        toast.error("Erro ao buscar agendamentos.");
        setSchedules([]);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      toast.error("Erro ao carregar agendamentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCut = async (scheduleId: number) => {
    try {
      const res = await pointService.createPoint(scheduleId);
      if (res.status === 200) {
        toast.success(res.data.message);
        fetchSchedules();
      } else {
        toast.error("Erro ao confirmar corte.");
      }
    } catch (error) {
      console.error("Erro ao confirmar corte:", error);
      toast.error("Erro ao adicionar ponto.");
    }
  };

  const openDeleteModal = (scheduleId: number) => {
    setScheduleToDelete(scheduleId);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      const res = await scheduleService.deleteSchedule(scheduleToDelete);
      if (res.status === 200) {
        toast.success("Agendamento excluído com sucesso!");
        fetchSchedules();
        setIsModalOpen(false);
      } else {
        toast.error("Erro ao excluir agendamento.");
      }
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      toast.error("Erro ao excluir agendamento.");
    }
  };

  const getUserName = (userId: number) => {
    const name = users.find((u => u.id == userId));
    return name ? name.firstName : "Usuário admin";
  };

  const getUserEmail = (userId: number) => {
    const email = users.find((u => u.id == userId))
    return email ? email.email : "Usuário admin";
  }

  const totalPages = Math.max(Math.ceil(users.length / pageSize), 1);

  const currentPageData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return schedules.slice(start, end);
  }, [schedules, pageIndex]);

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Agendamentos</h1>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-black w-full"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-black w-full"
        />
        <select
          value={selectedBarber ?? ""}
          onChange={(e) => {
            const barberId = parseInt(e.target.value, 10);
            setSelectedBarber(isNaN(barberId) ? null : barberId);
          }}
          className="p-2 border border-gray-300 rounded-md text-black w-full"
        >
          <option value="">Selecione</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchSchedules}
        className="w-full max-w-md bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors mb-6"
      >
        Buscar Agendamentos
      </button>

      {loading ? (
        <PageSpinner />
      ) : (
        <div className="w-full max-w-4xl overflow-x-auto">
          {currentPageData.length > 0 ? (
            <>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-sky-600">
                    <th className="border border-gray-300 p-2 text-left">Usuário</th>
                    <th className="border border-gray-300 p-2 text-left">E-mail</th>
                    <th className="border border-gray-300 p-2 text-left">Data e Hora</th>
                    <th className="border border-gray-300 p-2 text-center">Confirmar Corte</th>
                    <th className="border border-gray-300 p-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-sky-600">
                      <td className="border border-gray-300 p-2">
                        {getUserName(schedule.userId) || "Usuário Admin"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {getUserEmail(schedule.userId) || "N/A"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {format(parseISO(schedule.dateTime), "dd/MM/yyyy HH:mm")}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <input
                          type="checkbox"
                          checked={schedule.cutTheHair}
                          onChange={() => handleConfirmCut(schedule.id)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => openDeleteModal(schedule.id)}
                          className={`px-4 py-2 rounded-md transition-colors mr-2 ${
                            isBefore(parseISO(schedule.dateTime), new Date())
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                          disabled={isBefore(parseISO(schedule.dateTime), new Date())}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Quantidade de registros: {schedules.length}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={pageIndex === 0}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md mr-2"
                >
                  Anterior
                </button>
                <span>
                  Página {pageIndex + 1} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={pageIndex === totalPages - 1}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md ml-2"
                >
                  Próximo
                </button>
              </div>
            </>
          ) : (
            <p className="text-center">Nenhum agendamento encontrado.</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold text-black">Confirmação de Exclusão</h2>
          <p className="text-black">Tem certeza de que deseja excluir este agendamento?</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Schedules;
