export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  affiliateLink: string;
  category: string;
  featured: boolean;
  badge: string;
  active: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImageUrl: string;
  logoText: string;
  primaryColor: string;
  adminPassword: string;
  footerText: string;
  whatsappLink: string;
  instagramLink: string;
  showBanner: boolean;
}

export interface StoreState {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
}
