import Footer from "@/components/common/footer";
import HeaderGeneric from '@/components/common/headerGeneric';
import Sobre from "@/components/homeNoAuth/about";
import Fotos from "@/components/homeNoAuth/pictures";
import Services from '@/components/homeNoAuth/service';

export const metadata = {
  title: 'Café com Barba - Barbearia',
  icons: '/icon.png'
};

export default async function Home() {

  return (
    <main>
      <HeaderGeneric />
      <Services />
      <Fotos />
      <Sobre />
      <Footer />
    </main>
  );
}
