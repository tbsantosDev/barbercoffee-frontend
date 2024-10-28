import PageSpinner from "@/components/common/pageSpinner";
import userService from "@/services/userService";
import { User, UserResponse } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import bagAnimation from "@/animations/reward-points.json";

const ClientHome = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean>(true);

  const pointsByUser = async () => {
    try {
      const res = await userService.pointsByUser();

      if (res.status === 200) {
        const userData: UserResponse = res.data;
        const {pointsAmount } = userData.dados;
        setPoints(pointsAmount);
      } else {
        toast.error("Erro ao buscar Usuário");
      }
    } catch (error) {
      console.log("Ocorreu um erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = async() => {
    try {
      const res = await userService.loggedUser();

      if (res.status === 200) {
        const userData: User = res.data;
        const { firstName, lastName, emailConfirmed } = userData.dados;
        setUserName(`${firstName} ${lastName}`);
        setEmailConfirmed(emailConfirmed)

      } else {
        toast.error("Erro ao buscar Usuário");
      }
    } catch (error) {
      console.log("Ocorreu um erro:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem("barbercoffee-token");
    if (!token) {
      router.push("/login");
    } else {
      pointsByUser();
      currentUser();
    }
  }, [router]);

  return (
    <>
      {loading && <PageSpinner />}
      {!loading && (
        <div className="p-6 flex flex-col items-center h-screen">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Bem-vindo(a), {userName ? userName : "Usuário"}
          </h1>

          {!emailConfirmed && (
            <p className="text-red-500 text-lg font-semibold mb-4">
              Confirme seu e-mail para ter acesso a todas as funcionalidades.
            </p>
          )}

          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            <Lottie
              animationData={bagAnimation}
              className="w-36 h-36 md:w-44 md:h-44"
            />

            <p className="text-xl md:text-2xl font-semibold mt-2 text-center">
              Você tem{" "}
              <span className="text-red-500">{points ?? 0}</span> pontos.
            </p>

            <p className="text-center text-sm md:text-lg mt-2 px-4">
              <span className="font-semibold">Obs.:</span> O ponto é gerado
              quando há a confirmação do corte de cabelo. Cada corte equivale a{" "}
              <span className="font-semibold">1 ponto</span>.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientHome;
