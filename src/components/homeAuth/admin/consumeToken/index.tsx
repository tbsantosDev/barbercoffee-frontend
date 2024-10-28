import React, { useState, ChangeEvent, FormEvent } from "react";
import exchangeService from "@/services/exchangeService";
import { toast } from "react-toastify";

const ConsumeToken = () => {
  const [token, setToken] = useState<string>(""); // Estado para o token
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value); // Atualiza o token conforme o usuário digita
  };

  const handleConsumeToken = async (e: FormEvent) => {
    e.preventDefault(); // Prevenir o reload da página

    if (!token) {
      toast.error("Por favor, insira um token válido.");
      return;
    }

    try {
      setLoading(true); // Ativa o estado de loading

      // Etapa 1: Buscar exchangeId pelo token
      const tokenRes = await exchangeService.getExchangeByToken(token);
      console.log(tokenRes)
      if (tokenRes.status !== 200 || !tokenRes.data.dados.id) {
        toast.error("Token inválido ou solicitação de troca não encontrada.");
        return;
      }

      const exchangeId = tokenRes.data.dados.id;
      console.log(exchangeId)
      // Etapa 2: Confirmar a troca usando o exchangeId
      const confirmRes = await exchangeService.confirmExchange(exchangeId);

      if (confirmRes.status === 200) {
        toast.success(confirmRes.data.message);
        setToken(""); // Limpa o campo de token após sucesso
      } else {
        toast.error(confirmRes.data.message);
      }
    } catch (error) {
      console.error("Erro ao consumir token:", error);

    } finally {
      setLoading(false); // Desativa o estado de loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleConsumeToken}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Consumir Token
        </h1>
        <input
          type="text"
          value={token}
          onChange={handleInputChange}
          placeholder="Insira o token"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 text-black"
          required
        />
        <button
          type="submit"
          className={`w-full px-4 py-2 text-white rounded-md ${
            loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          } transition-colors`}
          disabled={loading}
        >
          {loading ? "Consumindo..." : "Confirmar"}
        </button>
      </form>
    </div>
  );
};

export default ConsumeToken;
