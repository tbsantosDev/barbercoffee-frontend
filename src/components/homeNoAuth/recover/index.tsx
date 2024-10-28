/* eslint-disable @next/next/no-img-element */
'use client';
import loginService from '@/services/loginService';
import Link from 'next/link';
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await loginService.RequestPasswordReset(email);
      console.log(response)

      if (response.status === 200) {
        toast.success("Verifique seu e-mail para redefinir a senha.", {
          autoClose: 3000,
        });
      } else {
        toast.error("E-mail não encontrado ou erro no servidor.");
      }
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      toast.error("Erro no servidor. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="flex flex-col md:flex-row h-screen">
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
                className={`px-6 py-3 rounded-full hover:text-white transition`}
              >
                Crie sua conta
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Recuperar Senha</h2>
            <form onSubmit={handleRequestPassword} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Digite seu e-mail para recuperação"
                  required
                />
              </div>
              <button className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition" disabled={loading}>{loading ? "Enviando..." : "Enviar Link de Redefinição"}</button>
            </form>
          </div>
        </div>
        </div>
  );
};

export default RecoverPassword;
