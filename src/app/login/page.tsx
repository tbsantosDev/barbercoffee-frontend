import Login from "@/components/homeNoAuth/login";

export const metadata = {
    title: 'Café com Barba - Login',
    icons: '/icon.png'
  };
  
  export default async function Home() {
  
    return (
      <main>
        <Login />
      </main>
    );
  }