import RecoverPassword from "@/components/homeNoAuth/recover";

export const metadata = {
    title: 'Café com Barba - Recuperar Senha',
    icons: '/icon.png'
  };
  
  export default async function Home() {
  
    return (
      <main>
        <RecoverPassword />
      </main>
    );
  }