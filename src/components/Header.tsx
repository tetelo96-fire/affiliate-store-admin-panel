import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onCategoryFilter?: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onCategoryFilter }) => {
  const { state } = useStore();
  const { settings, categories } = state;
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const isHome = location.pathname === '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl">
      {/* Top bar */}
      <div className="bg-orange-500 text-white text-center text-xs sm:text-sm py-1.5 font-medium tracking-wide">
        🔥 Ofertas por tempo limitado! Aproveite os melhores descontos da Amazon
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-extrabold text-white hover:text-orange-400 transition-colors shrink-0">
            {settings.logoText}
          </Link>

          {/* Search */}
          {isHome && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  className="w-full pl-4 pr-12 py-2.5 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-4 bg-orange-500 hover:bg-orange-600 rounded-full text-white font-medium transition-colors"
                >
                  🔍
                </button>
              </div>
            </form>
          )}

          {/* Nav */}
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isHome
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              🏠 Loja
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
            >
              ⚙️
            </Link>
          </nav>
        </div>

        {/* Mobile search */}
        {isHome && (
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  onSearch?.(e.target.value);
                }}
                className="w-full pl-4 pr-12 py-2.5 rounded-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-orange-500 outline-none text-sm"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-orange-500 rounded-full text-white"
              >
                🔍
              </button>
            </div>
          </form>
        )}

        {/* Categories bar */}
        {isHome && (
          <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => onCategoryFilter?.('')}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-all"
            >
              Todos
            </button>
            {categories
              .filter(c => c.active)
              .map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryFilter?.(cat.name)}
                  className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 hover:bg-orange-500 hover:text-white transition-all"
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
