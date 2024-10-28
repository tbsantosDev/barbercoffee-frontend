import React, { useState, useEffect } from "react";
import { Barber } from "@/types/barber";
import { ScheduleDataByCurrentUser } from "@/types/schedule";
import scheduleService from "@/services/scheduleService";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { pt } from "date-fns/locale";
import { isBefore, format } from "date-fns";

interface EditModalProps {
  schedule: ScheduleDataByCurrentUser;
  barbers: Barber[];
  onClose: () => void;
  onUpdate: (updatedSchedule: ScheduleDataByCurrentUser) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  schedule,
  barbers,
  onClose,
  onUpdate,
}) => {
  const [newDateTime, setNewDateTime] = useState<Date | null>(null);
  const [newBarberId, setNewBarberId] = useState<number>(schedule.barberId);
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);

  useEffect(() => {
    setNewDateTime(new Date(schedule.dateTime));
  }, [schedule]);

  useEffect(() => {
    if (newDateTime) {
      fetchAvailableSlots(newBarberId, newDateTime);
    }
  }, [newDateTime, newBarberId]);

  const fetchAvailableSlots = async (barberId: number, date: Date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd"); // Envia apenas a data sem hora
      const res = await scheduleService.availableSlots(barberId, formattedDate);
      if (res.status === 200) {
        const slots = res.data.dados.map((slot: string) => new Date(slot));
        setAvailableSlots(slots);
      } else {
        toast.error("Erro ao buscar horários disponíveis.");
      }
    } catch (error) {
      console.error("Erro ao carregar slots:", error);
      toast.error("Erro ao carregar horários.");
    }
  };

  const isDateValid = newDateTime && !isBefore(newDateTime, new Date());

  const handleSubmit = () => {
    if (!newDateTime) {
      toast.error("Por favor, selecione uma data válida.");
      return;
    }
  
    const formattedDate = newDateTime.toISOString();
  
    onUpdate({
      ...schedule,
      dateTime: formattedDate,
      barberId: newBarberId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">Editar Agendamento</h2>

        <label className="block mb-2 font-medium text-black">Data e Hora</label>
        <DatePicker
          selected={newDateTime}
          onChange={(date) => {
            if (date) {
              setNewDateTime(date);
            }
          }}
          showTimeSelect
          includeTimes={availableSlots}
          timeIntervals={45}
          dateFormat="Pp"
          locale={pt}
          placeholderText="Escolha uma data e hora"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md text-black"
        />

        <label className="block mb-2 font-medium text-black">Barbeiro</label>
        <select
          value={newBarberId}
          onChange={(e) => {
            const id = parseInt(e.target.value);
            setNewBarberId(id);
          }}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md text-black"
        >
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isDateValid}
            className={`px-4 py-2 rounded ${
              isDateValid
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-black cursor-not-allowed"
            }`}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
