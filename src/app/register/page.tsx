import Register from "@/components/homeNoAuth/register";

export const metadata = {
    title: 'Café com Barba - Registro',
    icons: '/icon.png'
  };
  
  export default async function Home() {
  
    return (
      <main>
        <Register />
      </main>
    );
  }