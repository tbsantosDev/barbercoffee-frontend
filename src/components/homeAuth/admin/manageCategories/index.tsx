/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import categoryService from "@/services/categoryService";
import Modal from "@/components/common/modal";
import { toast } from "react-toastify";
import PageSpinner from "@/components/common/pageSpinner";

interface Category {
  id: number;
  name: string;
}

const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data.dados);
    } catch (error) {
      console.log("Erro ao buscar categorias", error);
      toast.error("Erro ao buscar categorias.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const res = await categoryService.createCategory(newCategoryName);
      toast.success(res.data.message);
      fetchCategories();
      setIsAddModalOpen(false);
      setNewCategoryName("");
    } catch (error) {
      console.log("Erro ao adicionar categoria", error);
      toast.error("Erro ao adicionar categoria.");
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;
    try {
      await categoryService.updateCategory(selectedCategory.id, newCategoryName);
      toast.success("Categoria atualizada com sucesso!");
      fetchCategories();
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      setNewCategoryName("");
    } catch (error) {
      console.log("Erro ao atualizar categoria", error);
      toast.error("Erro ao atualizar categoria.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await categoryService.deleteCategory(selectedCategory.id);
      toast.success("Categoria excluída com sucesso!");
      fetchCategories();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.log("Erro ao excluir categoria", error);
      toast.error("Erro ao excluir categoria.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Gerenciar Categorias</h1>

      <div className="w-full flex justify-end mb-4">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Adicionar Categoria +
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
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-sky-600">
                  <td className="border border-gray-300 p-2">{category.name}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setNewCategoryName(category.name);
                          setIsEditModalOpen(true);
                        }}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
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
          <h2 className="text-xl font-bold mb-4 text-black">Adicionar Categoria</h2>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da Categoria"
            className="p-2 border border-gray-300 rounded-md w-full mb-4 text-black"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Criar
          </button>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-black">Editar Categoria</h2>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da Categoria"
            className="p-2 border border-gray-300 rounded-md w-full mb-4 text-black"
          />
          <button
            onClick={handleEditCategory}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            Salvar
          </button>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-black">Confirmar Exclusão</h2>
          <p className="mb-4 text-black">Tem certeza que deseja excluir esta categoria?</p>
          <button
            onClick={handleDeleteCategory}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Excluir
          </button>
        </Modal>
      )}
    </div>
  );
};

export default ManageCategories;
