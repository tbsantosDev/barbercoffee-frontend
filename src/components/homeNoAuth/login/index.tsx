/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import loginService from '@/services/loginService';
import PageSpinner from '@/components/common/pageSpinner';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered-email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const params = { email, password };
      const { status, data } = await loginService.login(params);

      if (status === 200) {
        Cookies.set('barbercoffee-token', data.token, { expires: 7 });

        if (rememberMe) {
          localStorage.setItem('remembered-email', email);
        } else {
          localStorage.removeItem('remembered-email');
        }

        router.push('/homeAuth');
      } else {
        toast.error('Credenciais inválidas.', { autoClose: 3000 });
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
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Café com Barba</h1>

          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <button className="px-6 py-3 rounded-full text-white border-b-4 border-red-500 hover:text-white transition">
                Acessar sua conta
              </button>
            </Link>

            <Link href="/register">
              <button className="px-6 py-3 rounded-full text-white hover:text-white transition">
                Crie sua conta
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@barbercoffee.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin123"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Lembrar de mim
                </label>
              </div>

              <Link href="/recover" className="text-sm text-red-500 hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;


/* eslint-disable @next/next/no-img-element */
/* 'use client'
import loginService from '@/services/loginService';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();

  // Função de login
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")!.toString();
    const password = formData.get("password")!.toString();
    const params = { email, password };

    try {
      const { status, data } = await loginService.login(params);

      if (status === 200) {
        Cookies.set('barbercoffee-token', data.token, { expires: 7 });

        router.push("/homeAuth");
      } else {
        console.log("Erro no login");
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
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
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Café com Barba</h1>
          <div className="flex justify-center space-x-4">
            <Link href="/login">
            <button
              onClick={() => setSelectedForm('login')}
              className={`px-6 py-3 rounded-full ${selectedForm === 'login' ? 'text-white border-b-4 border-red-500' : 'text-gray-400'} hover:text-white transition`}
            >
              Acessar sua conta
            </button>
            </Link>
            <button
              onClick={() => setSelectedForm('registro')}
              className={`px-6 py-3 rounded-full ${selectedForm === 'registro' ? 'text-white border-b-4 border-red-500' : 'text-gray-400'} hover:text-white transition`}
            >
              Crie sua conta
            </button>
          </div>
        </div>

          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">E-mail</label>
                <input
                  id="email"
                  name='email'
                  type="email"
                  className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-lg font-medium text-gray-700">Senha</label>
                <input
                  id="password"
                  name='password'
                  type="password"
                  className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Lembrar de mim</label>
                </div>
                <a href="/recuperar" className="text-sm text-red-500 hover:underline">Esqueceu sua senha?</a>
              </div>
              <button className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition">Entrar</button>
            </form>
          </div> */


        {/* {selectedForm === 'registro' && (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-lg font-medium text-gray-700">Primeiro Nome</label>
                  <input
                    id="first-name"
                    type="text"
                    className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Seu primeiro nome"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-lg font-medium text-gray-700">Último Nome</label>
                  <input
                    id="last-name"
                    type="text"
                    className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Seu último nome"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">E-mail</label>
                <input
                  id="email"
                  type="email"
                  className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Seu e-mail"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Telefone (Opcional)</label>
                <input
                  id="phone"
                  type="text"
                  className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Seu telefone"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-lg font-medium text-gray-700">Senha</label>
                <input
                  id="password"
                  type="password"
                  className="text-black mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              <button className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition">Registrar</button>
            </form>
          </div>
        )} */}

        {/* {selectedForm === 'recuperar' && (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Recuperar Senha</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">E-mail</label>
                <input
                  id="email"
                  type="email"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite seu e-mail para recuperação"
                  required
                />
              </div>
              <button className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition">Recuperar senha</button>
            </form>
          </div>
        )} */}
 /*      </div>
    </div>
  );
};

export default Login; */

/* eslint-disable @next/next/no-img-element */
