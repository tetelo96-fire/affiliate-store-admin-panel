import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
            {product.badge}
          </span>
        )}
        {!imgError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-6xl">
            📦
          </div>
        )}
        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <span className="text-xs font-medium text-orange-500 uppercase tracking-wider mb-1">
          {product.category}
        </span>
        <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Price */}
        <div className="mb-3">
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through block">
              {product.originalPrice}
            </span>
          )}
          <span className="text-xl font-extrabold text-green-600">
            {product.price}
          </span>
        </div>

        {/* CTA */}
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] text-sm"
        >
          🛒 VER NA AMAZON
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
