"use client";
import loginService from "@/services/loginService";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
  
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleReset = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
  
      if (!email || !token) {
        toast.error("Email ou token inválidos.");
        setLoading(false);
        return;
      }
  
      const params = { email, token, newPassword: password };
  
      try {
        const response = await loginService.ResetPassword(params);
  
        if (response.status === 200) {
          toast.success("Senha redefinida com sucesso!");
          router.push("/login");
        } else {
          toast.error("Token inválido ou expirado.");
        }
      } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#7c999d]">
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Redefinir Senha</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Nova Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Digite sua nova senha"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition"
            disabled={loading}
          >
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
