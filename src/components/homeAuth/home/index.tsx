"use client";
import PageSpinner from "@/components/common/pageSpinner";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClientHome from "../client";
import CreateSchedule from "../client/createSchedule"
import GetScheduleByCurrentUser from "../client/getScheduleByCurrentUser";
import ExchangePoints from "../client/exchangePoints";
import ExchangeHistory from "../client/exchangeHistory";
import UpdateData from "../client/updateData";
import Schedules from "../admin/schedules";
import ManageBarbers from "../admin/manageBarbers";
import ManageUsers from "../admin/manageUsers";
import ManageProducts from "../admin/manageProducts";
import ConsumeToken from "../admin/consumeToken";
import ManageCategories from "../admin/manageCategories";
import AdminHome from "../admin";

interface DecodedToken {
  id: number;
  email: string;
  role: "Admin" | "Client";
}

interface User {
  role: "Admin" | "Client";
  points?: number;
}

const HomeAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const handleLogout = () => {
    sessionStorage.removeItem("barbercoffee-token");
    router.push("/login");
  };

  useEffect(() => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decoded: DecodedToken = jwtDecode(token);
    const points = decoded.role === "Client" ? 120 : undefined;
    setUser({ role: decoded.role, points });
  }, [router]);

  if (!user) return <PageSpinner />

  const renderContent = () => {
    if (user.role === "Client") {
      switch (selectedMenu) {
        case "agendar":
          return <CreateSchedule />;
        case "historico":
          return <GetScheduleByCurrentUser />;
        case "trocar-pontos":
          return <ExchangePoints />;
        case "historico-trocas":
          return <ExchangeHistory />;
          case "alterar-dados":
          return <UpdateData />;
        default:
          return <ClientHome />;
      }
    } else if (user.role === "Admin") {
      switch (selectedMenu) {
        case "agendar":
          return <CreateSchedule />;
        case "agendamentos":
          return <Schedules />;
        case "gerenciar-barbeiros":
          return <ManageBarbers />;
          case "gerenciar-categorias":
          return <ManageCategories />;
        case "gerenciar-produtos":
          return <ManageProducts />;
        case "gerenciar-usuarios":
          return <ManageUsers />;
          case "consumir-token":
          return <ConsumeToken />;
        default:
          return <AdminHome />;
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:flex md:w-1/6 bg-gray-800 text-white p-4 md:p-6 md:h-full md:flex-col`}
      >
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <ul className="space-y-4 md:space-y-6">
          {user.role === "Client" ? (
            <>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "agendar" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("agendar")}
              >
                Agendar Serviço
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "historico" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("historico")}
              >
                Meus Agendamentos
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "trocar-pontos" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("trocar-pontos")}
              >
                Trocar Pontos
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "historico-trocas" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("historico-trocas")}
              >
                Histórico de Trocas
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "alterar-dados" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("alterar-dados")}
              >
                Alterar Dados da conta
              </li>
            </>
          ) : (
            <>
            <li
                className={`cursor-pointer ${
                  selectedMenu === "agendar" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("agendar")}
              >
                Agendar Serviço
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "agendamentos" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("agendamentos")}
              >
                Agendamentos
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "gerenciar-barbeiros" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("gerenciar-barbeiros")}
              >
                Gerenciar Barbeiros
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "gerenciar-categorias" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("gerenciar-categorias")}
              >
                Gerenciar Categorias
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "gerenciar-produtos" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("gerenciar-produtos")}
              >
                Gerenciar Produtos
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "gerenciar-usuarios" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("gerenciar-usuarios")}
              >
                Gerenciar Usuários
              </li>
              <li
                className={`cursor-pointer ${
                  selectedMenu === "consumir-token" ? "text-red-400" : ""
                } hover:text-red-500 transition`}
                onClick={() => setSelectedMenu("consumir-token")}
              >
                Consumir Token
              </li>
            </>
          )}
          <li
            className="cursor-pointer text-red-500 hover:text-red-700 transition"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            Sair
          </li>
        </ul>
      </nav>

      <button
        className="md:hidden p-4 bg-gray-800 text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? "Fechar Menu" : "Abrir Menu"}
      </button>

      <main className="flex-1 bg-[#7c999d] p-10 overflow-auto">
        {renderContent()}
      </main>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Tem certeza que deseja sair?</h2>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeAuth;
