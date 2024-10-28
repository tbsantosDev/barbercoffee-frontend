/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState } from "react";
import exchangeService from "@/services/exchangeService";
import userService from "@/services/userService";
import productService from "@/services/productService";
import { toast } from "react-toastify";
import { User, UserResponse } from "@/types/user";
import PageSpinner from "@/components/common/pageSpinner";
import Modal from "@/components/common/modal";

interface Item {
  id: number;
  name: string;
  amountInPoints: number;
  image: string;
  points: number;
  userId: number;
}

const convertBlobToUrl = (blob: string) => {
  const byteCharacters = atob(blob);
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  const blobUrl = new Blob([byteArray], { type: "image/jpeg" });
  return URL.createObjectURL(blobUrl);
};


const ExchangePoints = () => {
  const [points, setPoints] = useState<number>(0);
  const [category, setCategory] = useState<string>("products");
  const [items, setItems] = useState<Item[]>([]);
  const [userId, setUserId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 10;

  const pointsByUser = async () => {
    try {
      const res = await userService.pointsByUser();
      if (res.status === 200) {
        const userData: UserResponse = res.data;
        const { pointsAmount } = userData.dados;
        setPoints(pointsAmount);
      } else {
        toast.error("Erro ao buscar Usuário");
      }
    } catch (error) {
      console.log("Ocorreu um erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const userLogged = async () => {
    try {
      const res = await userService.loggedUser();
      if(res.status === 200) {
        const userData: User = res.data;
        const {id} = userData.dados
        setUserId(id)
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log("Ocorreu um erro:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchItemsByCategory = async (categoryId: number) => {
    setLoading(true);
    try {
      const res = await productService.productsByCategoryId(categoryId);
      if (res.data && Array.isArray(res.data.dados)) {
        setItems(res.data.dados);
      } else {
        console.error("Formato de dados inesperado:", res.data);
        setItems([]);
      }
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      toast.error("Erro ao buscar itens.");
    } finally {
      setLoading(false);
    }
  };

  const handleExchange = (item: Item) => {
    if (points < item.amountInPoints) {
      toast.error("Você não tem pontos suficientes.");
      return;
    }
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const createExchange = async () => {
    if (!selectedItem) return;

    try {
      const res = await exchangeService.createExchange(
        userId!,
        selectedItem.id
      );
      if (res.status === 200) {
        const getToken = res.data.dados.token
        setToken(getToken);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Erro ao realizar a troca:", error);
      toast.error("Erro ao realizar troca, você já tem uma solicitação de troca PENDENTE para este item");
    } finally {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    pointsByUser();
    userLogged();
  }, []);

  useEffect(() => {
    const categoryId = category === "products" ? 1 : 2;
    fetchItemsByCategory(categoryId);
  }, [category]);

  const currentPageItems = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, currentPage]);

  const totalPages = Math.ceil(items.length / pageSize);

  return (
    <div className="p-4 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Troque seu(s) <span className="text-red-500">{points}</span> ponto(s) por produtos ou serviços!
      </h1>
  
      <div className="w-full max-w-md mb-6">
        <label className="block text-lg font-medium mb-2">Selecione a Categoria</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        >
          <option value="products">Serviços</option>
          <option value="services">Produtos</option>
        </select>
      </div>
  
      {loading ? (
        <PageSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
            {currentPageItems.length > 0 ? (
              currentPageItems.map((item: Item) => (
                <div
                  key={item.id}
                  className="border rounded-md p-4 shadow-md flex flex-col items-center bg-white"
                >
                  <img
                    src={convertBlobToUrl(item.image)}
                    alt={item.name}
                    className="w-32 h-32 object-cover mb-2 rounded-md"
                  />
                  <h2 className="text-lg font-bold text-center text-black">
                    {item.name}
                  </h2>
                  <p className="text-black">
                    <span className="text-red-600">{item.amountInPoints}</span> pontos
                  </p>
                  <button
                    onClick={() => handleExchange(item)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Trocar
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center">Nenhum item encontrado.</p>
            )}
          </div>
  
          {currentPageItems.length > 0 && (
            <div className="flex justify-between mt-6 w-full max-w-4xl">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md disabled:bg-gray-300"
                disabled={currentPage === 0}
              >
                Anterior
              </button>
              <span>
                Página {currentPage + 1} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md disabled:bg-gray-300"
                disabled={currentPage === totalPages - 1}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
  
      {token && (
        <div className="mt-6 p-4 border rounded-md bg-green-100">
          <p className="text-center font-bold text-black">
            Token Gerado: <span className="text-red-500">{token}</span>
          </p>
        </div>
      )}
  
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4 text-black">Confirmar Troca</h2>
          <p className="text-black">
            Você tem certeza de que deseja trocar seus pontos por este item?
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="mr-2 px-4 py-2 bg-gray-300 text-black rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={createExchange}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExchangePoints;
