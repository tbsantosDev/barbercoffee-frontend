'use client'
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const HeaderGeneric = function () {
  // Controlar o estado de exibição do menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Alternar visibilidade do menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="relative h-screen">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/novoTemplateMelhorado.jpg"
          alt="Imagem de fundo"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority={true}
        />
      </div>

      <div className="relative z-10 flex justify-between px-10 py-3 items-center">
        <div>
          <Link href="/" passHref>
            <Image
              src="/icon.png"
              alt="Logo da barbearia café com barba"
              width={150}
              height={150}
              className="w-auto h-auto max-w-[100px] max-h-[100px] sm:max-w-[60px] sm:max-h-[60px]"
            />
          </Link>
        </div>

        <button
          className="text-white sm:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        <div className={`sm:flex gap-3 bg-black bg-opacity-30 px-4 py-2 rounded-lg sm:static absolute top-full left-0 w-full sm:w-auto ${isMenuOpen ? 'block' : 'hidden'}`}>
          <Link href="/login" passHref>
            <p className="hover:text-[#e63946] delay-75 cursor-pointer text-white text-center py-2 sm:py-0">
              AGENDAMENTOS
            </p>
          </Link>
          <Link href="#services" passHref>
            <p className="hover:text-[#e63946] delay-75 cursor-pointer text-white text-center py-2 sm:py-0">
              SERVIÇOS
            </p>
          </Link>
          <Link href="#fotos" passHref>
            <p className="hover:text-[#e63946] delay-75 cursor-pointer text-white text-center py-2 sm:py-0">
              FOTOS
            </p>
          </Link>
          <Link href="#sobre" passHref>
            <p className="hover:text-[#e63946] delay-75 cursor-pointer text-white text-center py-2 sm:py-0">
              SOBRE
            </p>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderGeneric;
