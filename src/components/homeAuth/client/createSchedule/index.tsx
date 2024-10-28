"use client";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { pt } from "date-fns/locale/pt"; 
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import scheduleService from "@/services/scheduleService";
import barberService from "@/services/barberService";
import { Barber } from "@/types/barber";
import { ScheduleAvailableSlots } from "@/types/schedule";

registerLocale("pt", pt);

const CreateSchedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [barberId, setBarberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAvailableSlots = async (barberId: number, date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    try {
      const res = await scheduleService.availableSlots(barberId, formattedDate);

      if (res.status === 200) {
        const slots: ScheduleAvailableSlots = res.data;
        const formattedSlots = slots.dados.map((slot) => new Date(slot));
        setAvailableSlots(formattedSlots);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
      toast.error("Erro ao carregar horários disponíveis.");
    }
  };

  useEffect(() => {
    const loadBarbers = async () => {
      try {
        const barberResponse = await barberService.getBarbers();

        if (barberResponse.status === 200) {
          setBarbers(barberResponse.data.dados);
          setBarberId(barberResponse.data.dados[0]?.id);
        } else {
          toast.error(barberResponse.data.message);
        }
      } catch (error) {
        console.error("Erro ao carregar barbeiros:", error);
        toast.error("Erro ao carregar barbeiros.");
      }
    };

    loadBarbers();
  }, []);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date && barberId) {
      fetchAvailableSlots(barberId, date);
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !barberId) {
      toast.error("Por favor, selecione uma data, hora e barbeiro.");
      return;
    }

    setLoading(true);

    const localDateTime = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    ).toISOString();

    const scheduleData = {
      dateTime: localDateTime,
      barberId,
    };

    try {
      const res = await scheduleService.createSchedule(scheduleData);

      if (res.status === 200) {
        toast.success(res.data.message);

        await fetchAvailableSlots(barberId, selectedDate);

        setSelectedDate(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Erro ao realizar agendamento:", error);
      toast.error("Erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Agende seu próximo serviço aqui!
      </h1>

      <div className="mb-4 w-full max-w-md">
        <label className="block text-lg font-medium mb-2">
          Selecione a Data e Hora
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          showTimeSelect
          includeTimes={availableSlots}
          timeIntervals={45}
          dateFormat="Pp"
          locale="pt"
          placeholderText="Escolha uma data e hora"
          className="p-2 border border-gray-300 rounded-md w-full text-black"
        />
      </div>

      <div className="mb-4 w-full max-w-md">
        <label className="block text-lg font-medium mb-2">
          Selecione o Barbeiro
        </label>
        <select
          value={barberId ?? ""}
          onChange={(e) => setBarberId(parseInt(e.target.value))}
          className="p-2 border border-gray-300 rounded-md text-black w-full"
        >
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSchedule}
        disabled={loading}
        className="w-full max-w-md bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        {loading ? "Agendando..." : "Confirmar Agendamento"}
      </button>
    </div>
  );
};

export default CreateSchedule;
