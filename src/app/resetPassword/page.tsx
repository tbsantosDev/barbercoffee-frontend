import ResetPassword from "@/components/homeNoAuth/resetPassword";

export const metadata = {
    title: 'Café com Barba - Recuperar Senha',
    icons: '/icon.png'
  };
  
  export default async function Home() {
  
    return (
      <main>
        <ResetPassword />
      </main>
    );
  }