/* eslint-disable @next/next/no-img-element */
"use client";
import PageSpinner from "@/components/common/pageSpinner";
import loginService from "@/services/loginService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  
  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName")!.toString();
    const lastName = formData.get("lastName")!.toString();
    const email = formData.get("email")!.toString();
    const phoneNumber = formData.get("phoneNumber")!.toString();
    const password = formData.get("password")!.toString();
    const params = { firstName, lastName, email, phoneNumber, password };

    try {
      const res = await loginService.register(params);
      console.log(res.data)

      if (res.status === 200 && res.data.status === true) {
        toast.success('Usuário criado com sucesso, por favor acesse seu e-mail para confirma-lo!');
        router.push('/login');
      } else {
        toast.error(res.data.message, { autoClose: 3000 });
      }
    } catch (error) {
      console.log("Ocorreu um erro:", error)
      toast.error('Erro no servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="flex flex-col md:flex-row h-screen">
      {loading && <PageSpinner />}
      <div className="relative w-full md:w-1/2 h-64 md:h-full">
        <img
          src="/template.jpg"
          alt="Imagem de login"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-[#7c999d] p-6 md:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Bem-vindo ao Café com Barba
          </h1>
          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <button
                className={`px-6 py-3 rounded-full hover:text-white transition`}
              >
                Acessar sua conta
              </button>
            </Link>
            <Link href="/register">
              <button
                className={`px-6 py-3 rounded-full text-white border-b-4 border-red-500 hover:text-white transition`}
              >
                Crie sua conta
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
          <form onSubmit={handleRegister}className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-lg font-medium text-gray-700"
                >
                  Primeiro Nome
                </label>
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Seu primeiro nome"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-lg font-medium text-gray-700"
                >
                  Último Nome
                </label>
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Seu último nome"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Seu e-mail"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-lg font-medium text-gray-700"
              >
                Telefone (Opcional)
              </label>
              <input
                id="phone"
                name="phoneNumber"
                type="text"
                className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Seu telefone"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Digite sua senha"
                required
              />
            </div>
            <button className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition">
              Registrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
