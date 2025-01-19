export const ENDPOINTS = {
  USERS: {
    LIST: '/users',
    DETAIL: (id: number) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  STOCKS: {
    LIST: '/api/stocks',
    DETAIL: (id: number) => `/api/stocks/${id}`,
    CREATE: '/api/stocks',
    UPDATE: (id: number) => `/api/stocks/${id}`,
    DELETE: (id: number) => `/api/stocks/${id}`,
  },
  PORTFOLIOS: {
    LIST: '/portfolios',
    DETAIL: (id: number) => `/portfolios/${id}`,
    CREATE: '/portfolios',
    CREATE_BULK: '/portfolios/bulk',
    UPDATE: (id: number) => `/portfolios/${id}`,
    DELETE: (id: number) => `/portfolios/${id}`,
    PUBLIC: (id: number) => `/api/portfolio/${id}/public`,
    USER_PORTFOLIO: () => `/user/portfolios`,
  },
  PORTFOLIO_STOCKS: {
    LIST: (portfolioId: number) => `/portfolios/${portfolioId}/stocks`,
    CREATE: (portfolioId: number) => `/portfolios/${portfolioId}/stocks`,
    DETAIL: (portfolioId: number, id: number) => `/portfolios/${portfolioId}/stocks/${id}`,
    UPDATE: (portfolioId: number, id: number) => `/portfolios/${portfolioId}/stocks/${id}`,
    DELETE: (portfolioId: number, id: number) => `/portfolios/${portfolioId}/stocks/${id}`,
  },
  STOCK_PRICES: {
    LIST: (stockId: number) => `/api/stocks/${stockId}/prices`,
    DETAIL: (stockId: number, id: number) => `/api/stocks/${stockId}/prices/${id}`,
    CREATE: (stockId: number) => `/api/stocks/${stockId}/prices`,
    UPDATE: (stockId: number, id: number) => `/api/stocks/${stockId}/prices/${id}`,
    DELETE: (stockId: number, id: number) => `/api/stocks/${stockId}/prices/${id}`,
    UPLOAD_CSV: '/api/stocks/prices/upload-csv',
  },
} as const;

export const API_URL = "http://localhost:3333/api"; 

export const LEADERBOARD = {
  GET: '/public/portfolios/leaderboard'
} as const; 