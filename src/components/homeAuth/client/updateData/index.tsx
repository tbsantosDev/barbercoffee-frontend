import React, { useState, useEffect } from "react";
import userService from "@/services/userService";
import { toast } from "react-toastify";

const UpdateData = () => {
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false); // Controle de renderização condicional
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  // Carrega dados do usuário logado
  const loadUserData = async () => {
    try {
      const res = await userService.loggedUser();
      if (res.status === 200) {
        const { firstName, lastName, phoneNumber } = res.data.dados;
        setFirstName(firstName);
        setLastName(lastName);
        setPhoneNumber(phoneNumber);
      } else {
        toast.error("Erro ao carregar dados do usuário.");
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      toast.error("Erro ao buscar dados do usuário.");
    }
  };

  useEffect(() => {
    loadUserData(); // Carrega dados do usuário ao montar o componente
  }, []);

  // Atualiza dados do usuário
  const handleUpdateUserData = async () => {
    setLoading(true);
    try {
      const res = await userService.updateLoggedUser(
        firstName,
        lastName,
        phoneNumber
      );
      if (res.status === 200) {
        toast.success("Dados atualizados com sucesso!");
      } else {
        toast.error("Erro ao atualizar dados.");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  // Atualiza a senha do usuário
  const handleUpdatePassword = async () => {
    if (newPassword !== passwordConfirmation) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const res = await userService.updatePasswordLoggedUser(
        newPassword,
        passwordConfirmation
      );
      if (res.status === 200) {
        toast.success("Senha alterada com sucesso!");
        setNewPassword("");
        setPasswordConfirmation("");
      } else {
        toast.error("Erro ao alterar senha.");
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast.error("Erro ao alterar senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        {isUpdatingPassword ? "Alterar Senha" : "Atualizar Dados"}
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsUpdatingPassword(false)}
          className={`px-4 py-2 rounded-md ${
            !isUpdatingPassword
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Alterar Dados
        </button>
        <button
          onClick={() => setIsUpdatingPassword(true)}
          className={`px-4 py-2 rounded-md ${
            isUpdatingPassword
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          Trocar Senha
        </button>
      </div>

      {!isUpdatingPassword ? (
        <div className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Nome</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Sobrenome</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Telefone</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full text-black"
            />
          </div>

          <button
            onClick={handleUpdateUserData}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {loading ? "Atualizando..." : "Atualizar Dados"}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Nova Senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full text-black"
            />
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            {loading ? "Alterando..." : "Alterar Senha"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateData;
