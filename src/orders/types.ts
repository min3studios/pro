/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Order types
export type OrderType = 'market' | 'limit' | 'stop_loss' | 'take_profit' | 'entry'
export type OrderSide = 'buy' | 'sell'
export type OrderStatus = 'pending' | 'filled' | 'cancelled' | 'partially_filled'
export type OrderEvent = 'created' | 'updated' | 'cancelled' | 'filled' | 'dragged'

// Base order interface
export interface BaseOrder {
  id: string
  type: OrderType
  side: OrderSide
  price: number
  quantity: number
  symbol: string
  status: OrderStatus
  timestamp: number
  text?: string
  customData?: Record<string, any>
}

// Extended order with trading-specific fields
export interface TradingOrder extends BaseOrder {
  entryPrice?: number
  stopLoss?: number
  takeProfit?: number
  pnl?: number
  unrealizedPnl?: number
  fees?: number
  fillPrice?: number
  fillQuantity?: number
}

// Order styling configuration
export interface OrderStyle {
  lineColor: string
  textColor: string
  backgroundColor?: string
  lineWidth?: number
  lineStyle?: 'solid' | 'dashed' | 'dotted'
  fontSize?: number
  showCancelButton?: boolean
  draggable?: boolean
}

// Order theme configuration for different order types and sides
export interface OrderTheme {
  buy: {
    entry: OrderStyle
    limit: OrderStyle
    stopLoss: OrderStyle
    takeProfit: OrderStyle
    market: OrderStyle
  }
  sell: {
    entry: OrderStyle
    limit: OrderStyle
    stopLoss: OrderStyle
    takeProfit: OrderStyle
    market: OrderStyle
  }
}

// Order callback interface
export interface OrderCallback {
  onOrderEvent?: (orderId: string, event: OrderEvent, data: TradingOrder) => void
  onPriceChange?: (orderId: string, newPrice: number, oldPrice: number) => void
  onCancel?: (orderId: string) => void
  onOrderClick?: (orderId: string) => void
}

// Order manager interface
export interface OrderManager {
  orders: Map<string, TradingOrder>
  overlayIds: Map<string, string>
  callbacks: OrderCallback[]
  theme: OrderTheme
  
  addOrder(order: TradingOrder): string
  updateOrder(orderId: string, updates: Partial<TradingOrder>): void
  removeOrder(orderId: string): void
  getOrder(orderId: string): TradingOrder | undefined
  getAllOrders(): TradingOrder[]
  calculatePnL(orderId: string, currentPrice: number): number
  setTheme(theme: Partial<OrderTheme>): void
  addCallback(callback: OrderCallback): void
  removeCallback(callback: OrderCallback): void
}

// Order creation options
export interface CreateOrderOptions {
  id?: string
  type: OrderType
  side: OrderSide
  price: number
  quantity: number
  symbol: string
  status?: OrderStatus
  text?: string
  entryPrice?: number
  stopLoss?: number
  takeProfit?: number
  customData?: Record<string, any>
}

// PnL calculation result
export interface PnLResult {
  unrealizedPnl: number
  realizedPnl: number
  percentage: number
  fees: number
  netPnl: number
}

// Order overlay data that gets passed to overlay templates
export interface OrderOverlayData extends TradingOrder {
  currentPrice?: number
  pnlResult?: PnLResult
  theme: OrderStyle
}