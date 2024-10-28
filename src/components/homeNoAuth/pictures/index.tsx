'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules'; // Importando apenas os módulos necessários
import 'swiper/swiper-bundle.css';
import Image from 'next/image';

const Fotos = () => {
  const images = [
    { src: '/pictures/corteCabeloSimples.jpg', alt: 'Foto 1' },
    { src: '/pictures/barba.jpg', alt: 'Foto 2' },
    { src: '/pictures/lavagem.jpg', alt: 'Foto 3' },
  ];

  return (
    <div
      id="fotos"
      className="bg-gradient-to-b from-[#a1b8b5] to-[#7c999d] py-10 text-center"
    >
      <h1 className="text-4xl font-bold text-center mb-8">GALERIA</h1>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Autoplay, Pagination]} // Passando os módulos aqui
          spaceBetween={20} // Reduz o espaçamento entre os slides para responsividade
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000, // Intervalo de 3 segundos
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true, // Bullets clicáveis
            dynamicBullets: true, // Bullets dinâmicos
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Fotos;
