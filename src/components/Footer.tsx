import React from 'react';
import { useStore } from '../context/StoreContext';

const Footer: React.FC = () => {
  const { state } = useStore();
  const { settings } = state;

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">{settings.logoText}</h3>
            <p className="text-sm leading-relaxed">
              {settings.siteDescription}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Links Úteis</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.amazon.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                  🛒 Amazon Brasil
                </a>
              </li>
              {settings.whatsappLink && (
                <li>
                  <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                    📱 WhatsApp
                  </a>
                </li>
              )}
              {settings.instagramLink && (
                <li>
                  <a href={settings.instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                    📷 Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-white font-semibold mb-3">Aviso Legal</h4>
            <p className="text-xs leading-relaxed">
              Este site participa do Programa de Associados da Amazon. Ao clicar nos links e realizar compras, podemos receber uma comissão, sem custo adicional para você.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          <p>{settings.footerText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
