import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { state } = useStore();
  const { products, settings } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const activeProducts = useMemo(() => {
    return products
      .filter(p => p.active)
      .filter(p => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .filter(p => {
        if (categoryFilter) return p.category === categoryFilter;
        return true;
      });
  }, [products, searchQuery, categoryFilter]);

  const featuredProducts = activeProducts.filter(p => p.featured);
  const regularProducts = activeProducts.filter(p => !p.featured);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onSearch={setSearchQuery} onCategoryFilter={setCategoryFilter} />

      {/* Hero Banner */}
      {settings.showBanner && !searchQuery && !categoryFilter && (
        <section className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }} />
          </div>
          {settings.bannerImageUrl && (
            <div className="absolute inset-0">
              <img src={settings.bannerImageUrl} alt="" className="w-full h-full object-cover opacity-20" />
            </div>
          )}
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
              {settings.bannerTitle}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
              {settings.bannerSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span>Links Oficiais Amazon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <span>Entrega Rápida</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span>Compra Segura</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Active filter indicator */}
        {(searchQuery || categoryFilter) && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-gray-500 text-sm">Filtrando por:</span>
            {searchQuery && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                🔍 "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500">✕</button>
              </span>
            )}
            {categoryFilter && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                📂 {categoryFilter}
                <button onClick={() => setCategoryFilter('')} className="hover:text-red-500">✕</button>
              </span>
            )}
          </div>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && !categoryFilter && !searchQuery && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">⭐</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Destaques</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-300 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section>
          {!categoryFilter && !searchQuery && regularProducts.length > 0 && featuredProducts.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🛍️</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Todos os Produtos</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-300 to-transparent" />
            </div>
          )}

          {(categoryFilter || searchQuery) && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🔎</span>
              <h2 className="text-2xl font-extrabold text-gray-800">
                {activeProducts.length} produto{activeProducts.length !== 1 ? 's' : ''} encontrado{activeProducts.length !== 1 ? 's' : ''}
              </h2>
            </div>
          )}

          {activeProducts.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl block mb-4">😕</span>
              <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-400">Tente buscar por outro termo ou categoria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(categoryFilter || searchQuery ? activeProducts : regularProducts).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
