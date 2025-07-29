import { environment } from '../../environments/environment';

export const API_CONFIG = {
  BASE_URL: 'http://localhost',
  CATEGORIES: {
    PORT: 8082,
    ENDPOINTS: {
      BASE: '/api/categories',
      BY_ID: (id: number) => `/api/categories/${id}`
    }
  },
  PRODUCTS: {
    PORT: 8081,
    ENDPOINTS: {
      BASE: '/api/products',
      BY_ID: (id: number) => `/api/products/${id}`
    }
  }
};

export const API_URLS = {
  CATEGORIES: {
    BASE: environment.apiConfig.categoriesUrl,
    BY_ID: (id: number) => `${environment.apiConfig.categoriesUrl}/${id}`
  },
  PRODUCTS: {
    BASE: environment.apiConfig.productsUrl,
    BY_ID: (id: number) => `${environment.apiConfig.productsUrl}/${id}`
  }
};

export const HTTP_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};