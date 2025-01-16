export interface User {
  id: number
  fullName: string | null
  email: string
  createdAt: string // DateTime will be serialized as ISO string
  updatedAt: string | null
  portfolios?: Portfolio[] // Making this optional since it might not always be included in responses
}

// If you need a type for creating a new user
export interface CreateUserDTO {
  fullName?: string
  email: string
  password: string
}

// If you need a type for updating a user
export interface UpdateUserDTO {
  fullName?: string
  email?: string
  password?: string
}

// You might also want to create a type for authentication responses
export interface AuthResponse {
  user: User
  token: string
}

// Login credentials type
export interface LoginCredentials {
  email: string
  password: string
}

export interface Stock {
  id: number
  name: string
  symbol: string
  createdAt: string // DateTime will be serialized as ISO string
  updatedAt: string
}

// If you need a type for creating/updating a stock
export interface StockDTO {
  name: string
  symbol: string
}

export interface Portfolio {
  id: number
  name: string
  userId: number
  createdAt: string
  updatedAt: string
  user?: User // Optional since it might not always be included in responses
  portfolioStocks?: PortfolioStock[] // Optional since it might not always be included
}

export interface PublicPortfolio {
  id: number
  name: string
  // userId: number
  // user?: User // Optional since it might not always be included in responses
  portfolioStocks?: PublicPortfolioStock[] // Optional since it might not always be included
}

export interface PublicPortfolioStock {
  name: string
  symbol: string
  percentage: number
}

// For creating/updating a portfolio
export interface PortfolioDTO {
  name: string
  userId: number
}

export interface PortfolioStock {
  id: number
  portfolioId: number
  stockId: number
  quantity: number
  buyPrice: number
  buyDate: string // DateTime will be serialized as ISO string
  createdAt: string
  updatedAt: string
  portfolio?: Portfolio // Optional since it might not always be included
  stock?: Stock // Optional since it might not always be included
  latestClosingPrice?: number
}

// For creating/updating a portfolio stock
export interface PortfolioStockDTO {
  portfolioId: number
  stockId: number
  quantity: number
  buyPrice: number
  buyDate: string
}

export interface StockPrice {
  id: number
  stockId: number
  date: string // DateTime will be serialized as ISO string
  openingPrice: number
  closingPrice: number
  highestPrice: number
  lowestPrice: number
  createdAt: string
  updatedAt: string
  stock?: Stock // Optional since it might not always be included
}

// For creating/updating a stock price
export interface StockPriceDTO {
  stockId: number
  date: string
  openingPrice: number
  closingPrice: number
  highestPrice: number
  lowestPrice: number
}

export interface BulkPortfolioCreationPayload {
  name: string;
  stocks: Array<{
    stockSymbol: string;
    quantity: number;
    lastTransactionPrice: number;
  }>;
}
