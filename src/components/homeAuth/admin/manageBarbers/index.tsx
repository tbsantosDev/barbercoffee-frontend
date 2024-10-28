/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import barberService from "@/services/barberService";
import Modal from "@/components/common/modal";
import { toast } from "react-toastify";
import PageSpinner from "@/components/common/pageSpinner";

interface Barber {
  id: number;
  name: string;
}

const ManageBarbers = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [newBarberName, setNewBarberName] = useState<string>("");

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const res = await barberService.getBarbers();
      setBarbers(res.data.dados);
    } catch (error) {
      console.log("Erro ao buscar barbeiros", error);
      toast.error("Erro ao buscar barbeiros.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBarber = async () => {
    try {
      const res = await barberService.createBarber(newBarberName);
      toast.success(res.data.message);
      fetchBarbers();
      setIsAddModalOpen(false);
      setNewBarberName("");
    } catch (error) {
      console.log("Erro ao adicionar barbeiro", error);
      toast.error("Erro ao adicionar barbeiro.");
    }
  };

  const handleEditBarber = async () => {
    if (!selectedBarber) return;
    try {
      await barberService.updateBarber(selectedBarber.id, newBarberName);
      toast.success("Barbeiro atualizado com sucesso!");
      fetchBarbers();
      setIsEditModalOpen(false);
      setSelectedBarber(null);
      setNewBarberName("");
    } catch (error) {
      console.log("Erro ao atualizar barbeiro", error);
      toast.error("Erro ao atualizar barbeiro.");
    }
  };

  const handleDeleteBarber = async () => {
    if (!selectedBarber) return;
    try {
      await barberService.deleteBarber(selectedBarber.id);
      toast.success("Barbeiro excluído com sucesso!");
      fetchBarbers();
      setIsDeleteModalOpen(false);
      setSelectedBarber(null);
    } catch (error) {
      console.log("Erro ao excluir barbeiro", error);
      toast.error("Erro ao excluir barbeiro.");
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  return (
    <div className="p-4 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Gerenciamento de Barbeiros
      </h1>

      <div className="w-full flex justify-end mb-4">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Adicionar Barbeiro +
        </button>
      </div>

      {loading ? (
        <PageSpinner />
      ) : (
        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-sky-600">
                <th className="border border-gray-300 p-2 text-left">Nome</th>
                <th className="border border-gray-300 p-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map((barber) => (
                <tr key={barber.id} className="hover:bg-sky-600">
                  <td className="border border-gray-300 p-2">{barber.name}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedBarber(barber);
                          setNewBarberName(barber.name);
                          setIsEditModalOpen(true);
                        }}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBarber(barber);
                          setIsDeleteModalOpen(true);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-black">Adicionar Barbeiro</h2>
          <input
            type="text"
            value={newBarberName}
            onChange={(e) => setNewBarberName(e.target.value)}
            placeholder="Nome do Barbeiro"
            className="p-2 border border-gray-300 rounded-md w-full mb-4 text-black"
          />
          <button
            onClick={handleAddBarber}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Criar
          </button>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-black">Editar Barbeiro</h2>
          <input
            type="text"
            value={newBarberName}
            onChange={(e) => setNewBarberName(e.target.value)}
            placeholder="Nome do Barbeiro"
            className="p-2 border border-gray-300 rounded-md w-full mb-4 text-black"
          />
          <button
            onClick={handleEditBarber}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            Salvar
          </button>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-black">Confirmar Exclusão</h2>
          <p className="mb-4 text-black">Tem certeza que deseja excluir este barbeiro?</p>
          <button
            onClick={handleDeleteBarber}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Excluir
          </button>
        </Modal>
      )}
    </div>
  );
};

export default ManageBarbers;
