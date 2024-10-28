'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import loginService from '@/services/loginService';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token')!;
  const email = searchParams.get('email')!;

  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== passwordConfirmation) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      const params = { email, token, newPassword };
      const res = await loginService.ResetPassword(params);

      if (res.status === 200) {
        toast.success('Senha redefinida com sucesso! Redirecionando...');
        router.push('/login');
      } else {
        toast.error(res.data.message || 'Erro ao redefinir senha. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast.error('Erro no servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Redefina sua senha</h2>

        {token && email ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Digite sua nova senha"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Confirme sua nova senha"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Redefinir Senha'}
            </button>
          </form>
        ) : (
          <p className="text-center text-red-500">Token ou e-mail inválidos.</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
