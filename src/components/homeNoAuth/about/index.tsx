'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Sobre = () => {
  const handleOpenMap = () => {
    window.open(
      'https://www.google.com/maps/place/R.+Combatentes+do+Ultramar+14,+2530+Reguengo+Grande,+Portugal',
      '_blank'
    );
  };

  return (
    <div id="sobre" className="bg-gradient-to-b from-[#a1b8b5]to-[#7c999d] py-10 text-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <div className="text-left">
          <h2 className="text-3xl font-semibold mb-4">SOBRE</h2>
          <p className="text-lg text-gray-700 mb-6">
            No Café com Barba, oferecemos uma experiência única de barbearia e café em um ambiente acolhedor e moderno. Nossa equipe especializada está pronta para fornecer os melhores serviços de corte de cabelo, barba e cuidados pessoais para todos os nossos clientes. Localizados em Reguengo Grande, Portugal, esperamos sua visita para um momento de relaxamento e estilo.
          </p>
        </div>

        <div className="text-right flex flex-col items-center justify-center">
          <h3 className="text-3xl font-semibold mb-4">COMO CHEGAR</h3>
          <button
            onClick={handleOpenMap}
            className="bg-sky-600 text-white py-3 px-6 rounded-full flex items-center space-x-2 hover:bg-blue-600 transition"
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" />
            <span>R. Combatentes do Ultramar 14, 2530 Reguengo Grande, Portugal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
