'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import loginService from '@/services/loginService';
import PageSpinner from '@/components/common/pageSpinner';

const ConfirmEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      confirmEmail(token);
    } else {
      setMessage('Token não encontrado.');
      setLoading(false);
    }
  }, [token]);

  const confirmEmail = async (token: string) => {
    try {
      const res = await loginService.confirmEmail(token);
      if (res.status === 200) {
        setMessage('Seu e-mail foi confirmado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao confirmar e-mail:', error);
      setMessage('Erro ao confirmar e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageSpinner />; 
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Confirmação de E-mail</h1>
      <p className="text-lg">{message}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.push('/login')}
      >
        Ir para Login
      </button>
    </div>
  );
};

export default ConfirmEmail;
