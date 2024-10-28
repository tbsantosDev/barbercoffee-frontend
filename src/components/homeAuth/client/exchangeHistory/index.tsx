/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState } from "react";
import exchangeService from "@/services/exchangeService";
import { toast } from "react-toastify";
import PageSpinner from "@/components/common/pageSpinner";
import { format } from "date-fns";
import userService from "@/services/userService";
import productService from "@/services/productService";

interface Exchange {
  id: number;
  productId: number;
  productName: string;
  userName: string;
  exchangeDate: string;
  token: string;
  status: number;
  confirmedAt: string;
}

const ExchangeHistory = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const pageSize = 10;

  useEffect(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(format(startOfMonth, "yyyy-MM-dd"));
    setEndDate(format(today, "yyyy-MM-dd"));
  }, []);

  const fetchProductAndUser = async (productId: number) => {
    try {
      const productRes = await productService.getProductsById(productId);
      const userRes = await userService.pointsByUser();
      return {
        productName: productRes.data.dados.name,
        userName: userRes.data.dados.firstName,
      };
    } catch (error) {
      console.error("Erro ao buscar produto ou usuário:", error);
      toast.error("Erro ao carregar dados.");
      return { productName: "Desconhecido", userName: "Desconhecido" };
    }
  };

  const fetchExchangeHistory = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor, preencha ambas as datas.");
      return;
    }

    setLoading(true);
    try {
      const res = await exchangeService.exchangeByCurrentUser(
        `${startDate}T00:00:00`,
        `${endDate}T23:59:59`
      );

      if (res.status === 200) {
        const exchangeData = await Promise.all(
          res.data.dados.map(async (exchange: Exchange) => {
            const { productName, userName } = await fetchProductAndUser(
              exchange.productId
            );
            return {
              id: exchange.id,
              productName,
              userName,
              exchangeDate: exchange.exchangeDate,
              token: exchange.token,
              status: exchange.status,
              confirmedAt: exchange.confirmedAt,
            };
          })
        );
        setExchanges(exchangeData);
        console.log(exchangeData);
        setPageIndex(0); // Reseta a página para a primeira
      } else {
        toast.error("Erro ao buscar histórico de compras.");
        setExchanges([]);
      }
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      toast.error("Erro ao carregar histórico de compras.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(exchanges.length / pageSize);

  const currentPageData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return exchanges.slice(start, end); // Retorna os dados da página atual
  }, [exchanges, pageIndex]);

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

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Pendente";
      case 1:
        return "Confirmado";
      default:
        return "Desconhecido";
    }
  };

  console.log(exchanges);

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Aqui está seu histórico de trocas de pontos!
      </h1>

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
      </div>

      <button
        onClick={fetchExchangeHistory}
        className="w-full max-w-md bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors mb-6"
      >
        Buscar Histórico
      </button>

      {loading ? (
        <PageSpinner />
      ) : currentPageData.length > 0 ? (
            <>
            <div className="w-full max-w-4xl overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-sky-600">
                    <th className="border border-gray-300 p-2 text-left">
                      Produto
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Usuário
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Data solicitação
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Token
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Status
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Data Confirmação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((exchange) => (
                    <tr key={exchange.id} className="hover:bg-sky-600">
                      <td className="border border-gray-300 p-2">
                        {exchange.productName}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {exchange.userName}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {format(
                          new Date(exchange.exchangeDate),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {exchange.token}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {getStatusLabel(exchange.status)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {exchange.confirmedAt
                          ? format(
                              new Date(exchange.confirmedAt),
                              "dd/MM/yyyy HH:mm"
                            )
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Quantidade de registros: {exchanges.length}</p>
              </div>

              <div className="flex justify-between items-center mt-4 w-full">
                <button
                  onClick={handlePreviousPage}
                  disabled={pageIndex === 0}
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 text-black rounded-md disabled:bg-gray-300"
                >
                  Anterior
                </button>
                <span>
                  Página {pageIndex + 1} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={pageIndex === totalPages - 1}
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 text-black rounded-md disabled:bg-gray-300"
                >
                  Próxima
                </button>
              </div>
            </>
          ) : (
            <p className="text-center">Nenhum registro encontrado.</p>
          )}
    </div>
  );
};

export default ExchangeHistory;
