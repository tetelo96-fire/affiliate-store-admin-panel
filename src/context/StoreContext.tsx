import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, SiteSettings, StoreState } from '../types';

const defaultSettings: SiteSettings = {
  siteName: 'MegaOfertas',
  siteDescription: 'As melhores ofertas da Amazon com os menores preços!',
  bannerTitle: '🔥 OFERTAS IMPERDÍVEIS',
  bannerSubtitle: 'Encontre os melhores produtos com preços exclusivos. Clique e aproveite!',
  bannerImageUrl: '',
  logoText: '🛒 MegaOfertas',
  primaryColor: '#f97316',
  adminPassword: 'admin123',
  footerText: '© 2024 MegaOfertas - Todos os direitos reservados. Este site participa do Programa de Associados da Amazon.',
  whatsappLink: '',
  instagramLink: '',
  showBanner: true,
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Eletrônicos', icon: '💻', active: true },
  { id: '2', name: 'Casa & Cozinha', icon: '🏠', active: true },
  { id: '3', name: 'Moda', icon: '👕', active: true },
  { id: '4', name: 'Esportes', icon: '⚽', active: true },
  { id: '5', name: 'Livros', icon: '📚', active: true },
  { id: '6', name: 'Beleza', icon: '💄', active: true },
  { id: '7', name: 'Games', icon: '🎮', active: true },
  { id: '8', name: 'Brinquedos', icon: '🧸', active: true },
];

const defaultProducts: Product[] = [
  {
    id: 'demo-1',
    name: 'Echo Dot 5ª Geração Smart Speaker',
    description: 'Smart speaker com Alexa. Som com qualidade premium, ideal para qualquer ambiente. Controle sua casa inteligente com a voz.',
    price: 'R$ 199,00',
    originalPrice: 'R$ 399,00',
    imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop',
    affiliateLink: 'https://www.amazon.com.br',
    category: 'Eletrônicos',
    featured: true,
    badge: '50% OFF',
    active: true,
    createdAt: Date.now(),
  },
  {
    id: 'demo-2',
    name: 'Fone de Ouvido Bluetooth Premium',
    description: 'Fone sem fio com cancelamento de ruído ativo. Bateria de até 30 horas. Conforto para uso prolongado.',
    price: 'R$ 149,90',
    originalPrice: 'R$ 299,90',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    affiliateLink: 'https://www.amazon.com.br',
    category: 'Eletrônicos',
    featured: true,
    badge: 'MAIS VENDIDO',
    active: true,
    createdAt: Date.now() - 1000,
  },
  {
    id: 'demo-3',
    name: 'Kit Panelas Antiaderente 10 Peças',
    description: 'Conjunto completo de panelas com revestimento antiaderente. Cabos ergonômicos e resistentes ao calor.',
    price: 'R$ 189,90',
    originalPrice: 'R$ 349,90',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    affiliateLink: 'https://www.amazon.com.br',
    category: 'Casa & Cozinha',
    featured: false,
    badge: 'OFERTA',
    active: true,
    createdAt: Date.now() - 2000,
  },
  {
    id: 'demo-4',
    name: 'Smartwatch Fitness Tracker',
    description: 'Relógio inteligente com monitor cardíaco, GPS integrado, resistente à água. Compatível com Android e iOS.',
    price: 'R$ 259,00',
    originalPrice: 'R$ 499,00',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    affiliateLink: 'https://www.amazon.com.br',
    category: 'Eletrônicos',
    featured: true,
    badge: '48% OFF',
    active: true,
    createdAt: Date.now() - 3000,
  },
];

interface StoreContextType {
  state: StoreState;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (settings: SiteSettings) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

const STORAGE_KEY = 'megaofertas_store';

const loadState = (): StoreState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        products: parsed.products || defaultProducts,
        categories: parsed.categories || defaultCategories,
        settings: { ...defaultSettings, ...parsed.settings },
      };
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return {
    products: defaultProducts,
    categories: defaultCategories,
    settings: defaultSettings,
  };
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoreState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addProduct = useCallback((product: Product) => {
    setState(prev => ({ ...prev, products: [product, ...prev.products] }));
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => (p.id === product.id ? product : p)),
    }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id),
    }));
  }, []);

  const addCategory = useCallback((category: Category) => {
    setState(prev => ({ ...prev, categories: [...prev.categories, category] }));
  }, []);

  const updateCategory = useCallback((category: Category) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(c => (c.id === category.id ? category : c)),
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
    }));
  }, []);

  const updateSettings = useCallback((settings: SiteSettings) => {
    setState(prev => ({ ...prev, settings }));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        state,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
