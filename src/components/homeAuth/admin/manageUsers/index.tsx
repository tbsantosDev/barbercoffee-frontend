import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  useMemo,
} from "react";
import userService from "@/services/userService";
import { toast } from "react-toastify";
import Modal from "@/components/common/modal";
import PageSpinner from "@/components/common/pageSpinner";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [userType, setUserType] = useState<string>("admin");
  const [pageIndex, setPageIndex] = useState<number>(0);

  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [userType]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res =
        userType === "admin"
          ? await userService.getListUsersAdmin()
          : await userService.getListClientUsers();

      if (res.status === 200) {
        setUsers(res.data.dados ?? []);
        setPageIndex(0);
      } else {
        toast.error("Erro ao carregar usuários.");
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, phoneNumber, password } = newUser;

    try {
      const res = await userService.createUserAdmin(
        firstName,
        lastName,
        email,
        phoneNumber,
        password
      );
      if (res.status === 200) {
        toast.success("Usuário criado com sucesso!");
        fetchUsers();
        setIsCreateModalOpen(false);
        resetForm();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.error("Erro ao criar usuário.");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setUserType(e.target.value);
  };

  const resetForm = () => {
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
    });
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const res = await userService.deleteUser(selectedUser.id);
      if (res.status === 200) {
        toast.success("Usuário excluído com sucesso!");
        fetchUsers();
        setIsDeleteModalOpen(false);
      } else {
        toast.error("Erro ao excluir usuário.");
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário.");
    }
  };

  const totalPages = Math.max(Math.ceil(users.length / pageSize), 1);

  const currentPageData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return users.slice(start, end);
  }, [users, pageIndex]);

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
      <h1 className="text-2xl font-bold mb-6 text-center">
        Gerenciamento de Usuários
      </h1>

      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <select
          value={userType}
          onChange={handleUserTypeChange}
          className="self-end mb-6 px-4 py-2 bg-white-500 text-black rounded-md transition-colors"
        >
          <option value="admin">Usuários Admin</option>
          <option value="client">Usuários Cliente</option>
        </select>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="self-end mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Novo Usuário Admin +
        </button>
      </div>

      {loading ? (
        <PageSpinner />
      ) : (
        <div className="w-full max-w-4xl overflow-x-auto">
          {currentPageData.length > 0 ? (
            <>
              <table className="w-full max-w-4xl border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-sky-600">
                    <th className="border border-gray-300 p-2 text-left">
                      Nome
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Email
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Telefone
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((user) => (
                    <tr key={user.id} className="hover:bg-sky-600">
                      <td className="border border-gray-300 p-2">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {user.email}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {user.phoneNumber}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Quantidade de registros: {users.length}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={pageIndex === 0}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>
                <span>
                  Página {pageIndex + 1} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={pageIndex === totalPages - 1}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </>
          ) : (
            <p className="text-center mt-6">Nenhum usuário encontrado.</p>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <h2 className="text-xl font-bold text-black">Novo Usuário Admin</h2>
          <form
            onSubmit={handleCreateUser}
            className="flex flex-col gap-4 mt-4"
          >
            <label htmlFor="firstName" className="text-black">
              Primeiro Nome:
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={newUser.firstName}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
              required
            />
            <label htmlFor="lastName" className="text-black">
              Sobrenome:
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={newUser.lastName}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
              required
            />
            <label htmlFor="email" className="text-black">
              Email:
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
              required
            />
            <label htmlFor="phoneNumber" className="text-black">
              Telefone:
            </label>
            <input
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              value={newUser.phoneNumber}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
            />
            <label htmlFor="password" className="text-black">
              Senha:
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md text-black"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Criar Usuário
            </button>
          </form>
        </Modal>
      )}

      {isDeleteModalOpen && selectedUser && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <h2 className="text-xl font-bold text-black">
            Confirmação de Exclusão
          </h2>
          <p className="text-black">
            Tem certeza de que deseja excluir o usuário -{" "}
            <b>
              {selectedUser.firstName} {selectedUser.lastName}
            </b>
            ?
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteUser}
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

export default ManageUsers;
