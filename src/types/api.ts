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

export enum PortfolioPrivacy {
  PRIVATE = 'PRIVATE',
  SHARE_ALL = 'SHARE_ALL',
  SHARE_SECTORS = 'SHARE_SECTORS',
}

export interface Portfolio {
  id: number
  name: string
  userId: number
  createdAt: string
  updatedAt: string
  user?: User
  portfolioStocks?: PortfolioStock[]
  privacy: PortfolioPrivacy
  initialInvestment: number
  currentValue: number
  profitLoss: {
    value: number
    percentage: number
  }
  performance: {
    daily: number
    weekly: number
    monthly: number
  }
  historicalValues: {
    oneDayAgo: HistoricalValue
    oneWeekAgo: HistoricalValue
    oneMonthAgo: HistoricalValue
  }
}

export interface PublicPortfolio {
  id: number
  name: string
  privacy: PortfolioPrivacy
  // userId: number
  // user?: User // Optional since it might not always be included in responses
  portfolioStocks?: PublicPortfolioStock[] // Optional since it might not always be included
}

export interface PublicPortfolioStock {
  name: string
  symbol: string
  percentage: number
  weeklyPerformancePercentage: number
}

// For creating/updating a portfolio
export interface PortfolioDTO {
  name: string
  userId: number
  privacy?: PortfolioPrivacy
}

export interface PortfolioStock {
  id: number
  portfolioId: number
  stockId: number
  quantity: number
  buyPrice?: number
  buyDate?: string // DateTime will be serialized as ISO string
  createdAt: string
  updatedAt: string
  portfolio?: Portfolio // Optional since it might not always be included
  stock?: Stock // Optional since it might not always be included
  stopLosses?: StopLoss[]
  latestClosingPrice?: number
  latestDate?: string
  dayAgoPrice?: number
  dayAgoDate?: string
  weekAgoPrice?: number
  weekAgoDate?: string
  monthAgoPrice?: number
  monthAgoDate?: string
  yearAgoPrice?: number
  yearAgoDate?: string
  performance1D?: number
  performance1W?: number
  performance1M?: number
  performance1Y?: number
}

// For creating/updating a portfolio stock
export interface PortfolioStockDTO {
  portfolioId: number
  stockId: number
  quantity: number
  buyPrice?: number
  buyDate?: string
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

export interface LeaderboardEntry {
  portfolioId: number;
  portfolioName: string;
  privacy: PortfolioPrivacy;
  performance1D: number;
  performance1W: number;
  performance1M: number;
  performance1Y: number;
  rank1D: number;
  rank1W: number;
  rank1M: number;
  rank1Y: number;
  userName: string;
  updatedAt: string;
  userId: number;
  topStocks: Array<{
    symbol: string;
    name: string;
    percentage: number;
  }>;
}

export type BrokerCredential = {
  id: number
  userId: number
  brokerUsername: string
  brokerPassword: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type BrokerCredentialDTO = Omit<BrokerCredential, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

export enum StopLossType {
  ABSOLUTE = 'ABSOLUTE',
  PERCENTAGE = 'PERCENTAGE',
}

export enum StopLossStatus {
  PENDING = 'PENDING',
  TRIGGERED = 'TRIGGERED',
  EXECUTING = 'EXECUTING',
  EXECUTED = 'EXECUTED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export type StopLoss = {
  id: number
  portfolioStockId: number
  type: StopLossType
  value: number
  quantity: number
  isActive: boolean
  status: StopLossStatus
  triggeredAt: string | null
  executedAt: string | null
  failureReason: string | null
  createdAt: string
  updatedAt: string
}

export type StopLossDTO = Omit<StopLoss, 'id' | 'portfolioStockId' | 'status' | 'triggeredAt' | 'executedAt' | 'failureReason' | 'createdAt' | 'updatedAt'>

export interface StockWithPerformance extends Stock {
  latestPrice: number
  performance1D: number
  performance1W: number
  performance1M: number
}

export interface UserSetting {
  id: number
  userId: number
  isAnonymous: boolean
  createdAt: string
  updatedAt: string
}

export interface UserSettingResponse {
  status: string
  data: UserSetting
}

export interface ToggleAnonymousResponse {
  status: string
  data: {
    isAnonymous: boolean
  }
}

export interface HistoricalValue {
  value: number
  change: number
  percentage: number
}

export type Journal = {
  id: number
  userId: number
  portfolioStockId: number | null
  stopLossId: number | null
  title: string
  content: string
  tags: string | null
  journalType: 'general' | 'stock' | 'stop_loss'
  createdAt: string
  updatedAt: string
}

export type JournalDTO = {
  title: string
  content: string
  tags?: string
  journalType: 'general' | 'stock' | 'stop_loss'
  portfolioStockId?: number
  stopLossId?: number
}

export interface WatchListEntry {
  id: number
  userId: number
  stockId: number
  createdAt: string
  updatedAt: string
  name: string
  symbol: string
  latestPrice: number
  performance1D: number
  performance1W: number
  performance1M: number
}

export interface WatchListResponse {
  status: string
  watchList: WatchListEntry[]
}

export interface AddToWatchListDTO {
  stockId: number
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface StockTransaction {
  id: number
  portfolioStockId: number
  stockId: number
  transactionType: TransactionType
  quantity: number
  price: number
  transactionDate: string
  notes: string | null
  createdAt: string
  updatedAt: string
  stock?: Stock
  portfolioStock?: PortfolioStock & {
    portfolio?: Portfolio
  }
}

export interface StockTransactionDTO {
  portfolioStockId: number
  transactionType: TransactionType
  quantity: number
  price: number
  transactionDate: string
  notes?: string
}

export interface StockTransactionWithStockDTO {
  portfolioId: number
  stockId: number
  transactionType: TransactionType
  quantity: number
  price: number
  transactionDate: string
  notes?: string
}

export interface TransactionStats {
  totalBought: number
  totalSold: number
  totalBuyValue: number
  totalSellValue: number
  currentHoldings: number
  avgBuyPrice: number
  avgSellPrice: number
}

export interface StockTransactionsResponse {
  status: string
  data: {
    stock: Stock
    transactions: StockTransaction[]
    stats: TransactionStats
  }
}
