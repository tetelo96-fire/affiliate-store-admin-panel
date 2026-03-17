import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Product, Category } from '../types';
import { v4 as uuidv4 } from 'uuid';

type Tab = 'products' | 'categories' | 'settings';

const Admin: React.FC = () => {
  const { state, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, updateSettings } = useStore();
  const { products, categories, settings } = state;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Product form state
  const emptyProduct: Product = {
    id: '',
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    affiliateLink: '',
    category: categories[0]?.name || '',
    featured: false,
    badge: '',
    active: true,
    createdAt: Date.now(),
  };

  const [productForm, setProductForm] = useState<Product>(emptyProduct);
  const [categoryForm, setCategoryForm] = useState<Category>({ id: '', name: '', icon: '📦', active: true });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === settings.adminPassword) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Senha incorreta!');
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...productForm });
      showSuccess('Produto atualizado com sucesso!');
    } else {
      addProduct({ ...productForm, id: uuidv4(), createdAt: Date.now() });
      showSuccess('Produto adicionado com sucesso!');
    }
    setProductForm(emptyProduct);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
      showSuccess('Produto excluído!');
    }
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory({ ...categoryForm });
      showSuccess('Categoria atualizada!');
    } else {
      addCategory({ ...categoryForm, id: uuidv4() });
      showSuccess('Categoria adicionada!');
    }
    setCategoryForm({ id: '', name: '', icon: '📦', active: true });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm(cat);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Excluir esta categoria?')) {
      deleteCategory(id);
      showSuccess('Categoria excluída!');
    }
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    showSuccess('Configurações salvas!');
  };

  const [settingsForm, setSettingsForm] = useState(settings);

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">🔐</span>
            <h1 className="text-2xl font-extrabold text-gray-800">Painel Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Acesso restrito ao administrador</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite a senha..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">❌ {loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
            >
              Entrar
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              ← Voltar para a loja
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Senha padrão: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl font-medium animate-bounce">
          ✅ {successMsg}
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold text-gray-800">⚙️ Painel Admin</h1>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
              Online
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              👁️ Ver Loja
            </Link>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              🚪 Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="text-3xl font-black text-orange-500">{products.length}</div>
            <div className="text-sm text-gray-500">Produtos Total</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="text-3xl font-black text-green-500">{products.filter(p => p.active).length}</div>
            <div className="text-sm text-gray-500">Produtos Ativos</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="text-3xl font-black text-blue-500">{categories.filter(c => c.active).length}</div>
            <div className="text-sm text-gray-500">Categorias</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="text-3xl font-black text-purple-500">{products.filter(p => p.featured).length}</div>
            <div className="text-sm text-gray-500">Em Destaque</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-1">
          {([
            { key: 'products' as Tab, label: '📦 Produtos', },
            { key: 'categories' as Tab, label: '📂 Categorias' },
            { key: 'settings' as Tab, label: '⚙️ Configurações' },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 rounded-t-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-orange-600 border-b-2 border-orange-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-700">Gerenciar Produtos</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm(emptyProduct);
                  setShowProductForm(true);
                }}
                className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm"
              >
                + Novo Produto
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-800">
                        {editingProduct ? '✏️ Editar Produto' : '➕ Novo Produto'}
                      </h3>
                      <button
                        onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nome do Produto *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Echo Dot 5ª Geração"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
                        <textarea
                          value={productForm.description}
                          onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          placeholder="Descrição detalhada do produto..."
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Preço Atual *</label>
                        <input
                          type="text"
                          required
                          value={productForm.price}
                          onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="R$ 199,90"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Preço Original (riscado)</label>
                        <input
                          type="text"
                          value={productForm.originalPrice}
                          onChange={e => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                          placeholder="R$ 399,90"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">URL da Imagem *</label>
                        <input
                          type="url"
                          required
                          value={productForm.imageUrl}
                          onChange={e => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                          placeholder="https://exemplo.com/imagem.jpg"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                        />
                        <p className="text-xs text-gray-400 mt-1">Cole a URL da imagem do produto. Você pode usar imagens da Amazon ou do Unsplash.</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">🔗 Link de Afiliado Amazon *</label>
                        <input
                          type="url"
                          required
                          value={productForm.affiliateLink}
                          onChange={e => setProductForm(prev => ({ ...prev, affiliateLink: e.target.value }))}
                          placeholder="https://amzn.to/seu-link-de-afiliado"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                        />
                        <p className="text-xs text-gray-400 mt-1">Cole aqui seu link de associado da Amazon. Os visitantes serão redirecionados ao clicar.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
                        <select
                          value={productForm.category}
                          onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm bg-white"
                        >
                          {categories.filter(c => c.active).map(c => (
                            <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Badge (etiqueta)</label>
                        <input
                          type="text"
                          value={productForm.badge}
                          onChange={e => setProductForm(prev => ({ ...prev, badge: e.target.value }))}
                          placeholder="Ex: 50% OFF, MAIS VENDIDO"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.featured}
                            onChange={e => setProductForm(prev => ({ ...prev, featured: e.target.checked }))}
                            className="w-4 h-4 accent-orange-500"
                          />
                          <span className="text-sm text-gray-600">⭐ Destaque</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.active}
                            onChange={e => setProductForm(prev => ({ ...prev, active: e.target.checked }))}
                            className="w-4 h-4 accent-green-500"
                          />
                          <span className="text-sm text-gray-600">✅ Ativo</span>
                        </label>
                      </div>
                    </div>

                    {/* Image preview */}
                    {productForm.imageUrl && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Preview da imagem:</p>
                        <img
                          src={productForm.imageUrl}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                          onError={e => (e.currentTarget.style.display = 'none')}
                        />
                      </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                      >
                        {editingProduct ? '💾 Salvar Alterações' : '➕ Adicionar Produto'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Product list */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {products.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="text-5xl block mb-3">📦</span>
                  <p className="text-gray-500">Nenhum produto cadastrado ainda</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {products.map(product => (
                    <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h4>
                          {product.featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⭐</span>}
                          {!product.active && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inativo</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{product.category} • {product.price}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-700">Gerenciar Categorias</h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({ id: '', name: '', icon: '📦', active: true });
                  setShowCategoryForm(true);
                }}
                className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm"
              >
                + Nova Categoria
              </button>
            </div>

            {showCategoryForm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {editingCategory ? '✏️ Editar Categoria' : '➕ Nova Categoria'}
                  </h3>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
                      <input
                        type="text"
                        required
                        value={categoryForm.name}
                        onChange={e => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nome da categoria"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Ícone (emoji)</label>
                      <input
                        type="text"
                        value={categoryForm.icon}
                        onChange={e => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                        placeholder="📦"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoryForm.active}
                        onChange={e => setCategoryForm(prev => ({ ...prev, active: e.target.checked }))}
                        className="w-4 h-4 accent-green-500"
                      />
                      <span className="text-sm text-gray-600">Ativa</span>
                    </label>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl font-bold hover:bg-orange-600">
                        💾 Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowCategoryForm(false); setEditingCategory(null); }}
                        className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {categories.map(cat => (
                  <div key={cat.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                    <span className="text-3xl">{cat.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{cat.name}</h4>
                      <p className="text-xs text-gray-400">
                        {products.filter(p => p.category === cat.name).length} produtos
                        {!cat.active && ' • Inativa'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-6">⚙️ Configurações do Site</h2>
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Identidade */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-600 border-b border-gray-100 pb-2 mb-4">🏷️ Identidade do Site</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nome do Site</label>
                  <input
                    type="text"
                    value={settingsForm.siteName}
                    onChange={e => setSettingsForm(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Logo (texto/emoji)</label>
                  <input
                    type="text"
                    value={settingsForm.logoText}
                    onChange={e => setSettingsForm(prev => ({ ...prev, logoText: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Descrição do Site</label>
                  <textarea
                    value={settingsForm.siteDescription}
                    onChange={e => setSettingsForm(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm resize-none"
                  />
                </div>

                {/* Banner */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-600 border-b border-gray-100 pb-2 mb-4">🖼️ Banner Principal</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Título do Banner</label>
                  <input
                    type="text"
                    value={settingsForm.bannerTitle}
                    onChange={e => setSettingsForm(prev => ({ ...prev, bannerTitle: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mt-7">
                    <input
                      type="checkbox"
                      checked={settingsForm.showBanner}
                      onChange={e => setSettingsForm(prev => ({ ...prev, showBanner: e.target.checked }))}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-sm text-gray-600">Mostrar Banner</span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Subtítulo do Banner</label>
                  <input
                    type="text"
                    value={settingsForm.bannerSubtitle}
                    onChange={e => setSettingsForm(prev => ({ ...prev, bannerSubtitle: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Imagem de Fundo do Banner (URL)</label>
                  <input
                    type="url"
                    value={settingsForm.bannerImageUrl}
                    onChange={e => setSettingsForm(prev => ({ ...prev, bannerImageUrl: e.target.value }))}
                    placeholder="https://exemplo.com/banner.jpg (opcional)"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                  />
                </div>

                {/* Social */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-600 border-b border-gray-100 pb-2 mb-4">📱 Redes Sociais</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Link WhatsApp</label>
                  <input
                    type="url"
                    value={settingsForm.whatsappLink}
                    onChange={e => setSettingsForm(prev => ({ ...prev, whatsappLink: e.target.value }))}
                    placeholder="https://wa.me/5511999999999"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Link Instagram</label>
                  <input
                    type="url"
                    value={settingsForm.instagramLink}
                    onChange={e => setSettingsForm(prev => ({ ...prev, instagramLink: e.target.value }))}
                    placeholder="https://instagram.com/seuperfil"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                  />
                </div>

                {/* Footer */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-600 border-b border-gray-100 pb-2 mb-4">📄 Rodapé</h3>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Texto do Rodapé</label>
                  <textarea
                    value={settingsForm.footerText}
                    onChange={e => setSettingsForm(prev => ({ ...prev, footerText: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm resize-none"
                  />
                </div>

                {/* Security */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold text-gray-600 border-b border-gray-100 pb-2 mb-4">🔒 Segurança</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Senha do Admin</label>
                  <input
                    type="text"
                    value={settingsForm.adminPassword}
                    onChange={e => setSettingsForm(prev => ({ ...prev, adminPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">Cuidado ao alterar! Anote a nova senha.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md"
                >
                  💾 Salvar Configurações
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
