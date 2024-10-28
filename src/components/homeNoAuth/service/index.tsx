'use client'
import Link from 'next/link';
import { useState } from 'react';

type Service = {
  name: string;
  description: string;
  price: string;
};

type ServicesByCategory = {
  homens: Service[];
  mulheres: Service[];
  criancas: Service[];
};

const Servicos = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: ServicesByCategory = {
    homens: [
      { name: 'Corte de cabelo e barba', description: 'Corte padrão de cabelo e barba a critério do cliente.', price: '€ 15,00' },
      { name: 'Corte de cabelo', description: 'Corte padrão a critério do cliente.', price: '€ 10,00' },
      { name: 'Barba', description: 'Barba feita na navalha.', price: '€ 10,00' },
      { name: 'Sobrancelha', description: 'Corte padrão simples.', price: '€ 4,00' },
    ],
    mulheres: [
      { name: 'Corte de cabelo', description: 'Corte padrão a critério do cliente.', price: '€ 12,00' },
      { name: 'Sobrancelha', description: 'Corte padrão simples.', price: '€ 4,00' },
    ],
    criancas: [
      { name: 'Corte Infantil', description: 'Corte de cabelo para crianças até 12 anos.', price: '€ 10,00' },
    ]
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  return (
    <div id="services" className="bg-gradient-to-b from-[#a1b8b5] to-[#7c999d] py-10 text-center">
      <h1 className="text-4xl font-bold text-center mb-8">SERVIÇOS</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Coluna para Homens */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Homens</h2>
          <ul className="space-y-2">
            {services.homens.map((service, index) => (
              <li 
                key={index} 
                className="bg-sky-600 p-4 rounded cursor-pointer hover:bg-red-600 transition" 
                onClick={() => handleServiceClick(service)}
              >
                {service.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Mulheres</h2>
          <ul className="space-y-2">
            {services.mulheres.map((service, index) => (
              <li 
                key={index} 
                className="bg-sky-600 p-4 rounded cursor-pointer hover:bg-red-600 transition" 
                onClick={() => handleServiceClick(service)}
              >
                {service.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Crianças</h2>
          <ul className="space-y-2">
            {services.criancas.map((service, index) => (
              <li 
                key={index} 
                className="bg-sky-600 p-4 rounded cursor-pointer hover:bg-red-600 transition" 
                onClick={() => handleServiceClick(service)}
              >
                {service.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedService && (
        <div className="mt-10 max-w-3xl mx-auto bg-sky-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-3xl font-semibold">{selectedService.name}</h3>
          <p className="mt-4">{selectedService.description}</p>
          <p className="mt-4 text-xl font-bold">{selectedService.price}</p>
          <Link href="/login">
            <button 
              className="mt-6 bg-[#e63946] text-white py-2 px-4 rounded hover:bg-red-600 transition mx-2" 
            >
              Agendar
            </button>
          </Link>
          <button 
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition" 
            onClick={() => setSelectedService(null)}
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default Servicos;
