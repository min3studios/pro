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

import { Chart, Nullable } from 'klinecharts'
import { 
  TradingOrder, 
  OrderManager, 
  OrderCallback, 
  OrderTheme, 
  CreateOrderOptions,
  OrderOverlayData,
  OrderEvent
} from './types'
import { defaultTheme, getOrderStyle } from './themes'
import { 
  generateOrderId, 
  validateOrder, 
  calculatePnL, 
  formatOrderText,
  sortOrders
} from './utils'

export class OrderManagerImpl implements OrderManager {
  public orders: Map<string, TradingOrder> = new Map()
  public overlayIds: Map<string, string> = new Map()
  public callbacks: OrderCallback[] = []
  public theme: OrderTheme = defaultTheme
  
  private chart: Nullable<Chart> = null
  private currentPrice: number = 0
  
  constructor(chart: Nullable<Chart>) {
    this.chart = chart
  }
  
  /**
   * Set the chart instance
   */
  setChart(chart: Nullable<Chart>): void {
    this.chart = chart
  }
  
  /**
   * Update current price for PnL calculations
   */
  updateCurrentPrice(price: number): void {
    this.currentPrice = price
    // Update all order overlays with new PnL
    this.refreshAllOrders()
  }
  
  /**
   * Add a new order
   */
  addOrder(orderOptions: CreateOrderOptions): string {
    const orderId = orderOptions.id || generateOrderId()
    
    const order: TradingOrder = {
      id: orderId,
      type: orderOptions.type,
      side: orderOptions.side,
      price: orderOptions.price,
      quantity: orderOptions.quantity,
      symbol: orderOptions.symbol,
      status: orderOptions.status || 'pending',
      timestamp: Date.now(),
      text: orderOptions.text,
      entryPrice: orderOptions.entryPrice,
      stopLoss: orderOptions.stopLoss,
      takeProfit: orderOptions.takeProfit,
      customData: orderOptions.customData
    }
    
    // Validate order
    const errors = validateOrder(order)
    if (errors.length > 0) {
      throw new Error(`Invalid order: ${errors.join(', ')}`)
    }
    
    // Store order
    this.orders.set(orderId, order)
    
    // Create overlay
    this.createOrderOverlay(order)
    
    // Notify callbacks
    this.notifyCallbacks(orderId, 'created', order)
    
    return orderId
  }
  
  /**
   * Update an existing order
   */
  updateOrder(orderId: string, updates: Partial<TradingOrder>): void {
    const order = this.orders.get(orderId)
    if (!order) {
      throw new Error(`Order ${orderId} not found`)
    }
    
    // Update order data
    const updatedOrder = { ...order, ...updates }
    this.orders.set(orderId, updatedOrder)
    
    // Update overlay
    this.updateOrderOverlay(updatedOrder)
    
    // Notify callbacks
    this.notifyCallbacks(orderId, 'updated', updatedOrder)
  }
  
  /**
   * Remove an order
   */
  removeOrder(orderId: string): void {
    const order = this.orders.get(orderId)
    if (!order) {
      return
    }
    
    // Remove overlay
    const overlayId = this.overlayIds.get(orderId)
    if (overlayId && this.chart) {
      this.chart.removeOverlay(overlayId)
    }
    
    // Remove from maps
    this.orders.delete(orderId)
    this.overlayIds.delete(orderId)
    
    // Notify callbacks
    this.notifyCallbacks(orderId, 'cancelled', order)
  }
  
  /**
   * Get a specific order
   */
  getOrder(orderId: string): TradingOrder | undefined {
    return this.orders.get(orderId)
  }
  
  /**
   * Get all orders
   */
  getAllOrders(): TradingOrder[] {
    return sortOrders(Array.from(this.orders.values()))
  }
  
  /**
   * Calculate PnL for an order
   */
  calculatePnL(orderId: string, currentPrice: number): number {
    const order = this.orders.get(orderId)
    if (!order) return 0
    
    const pnlResult = calculatePnL(order, currentPrice)
    return pnlResult.netPnl
  }
  
  /**
   * Set theme
   */
  setTheme(theme: Partial<OrderTheme>): void {
    this.theme = { ...this.theme, ...theme }
    this.refreshAllOrders()
  }
  
  /**
   * Add callback
   */
  addCallback(callback: OrderCallback): void {
    this.callbacks.push(callback)
  }
  
  /**
   * Remove callback
   */
  removeCallback(callback: OrderCallback): void {
    const index = this.callbacks.indexOf(callback)
    if (index > -1) {
      this.callbacks.splice(index, 1)
    }
  }
  
  /**
   * Handle order cancel from overlay
   */
  handleOrderCancel = (orderId: string): void => {
    const order = this.orders.get(orderId)
    if (!order) return
    
    // Notify callbacks first
    this.callbacks.forEach(callback => {
      if (callback.onCancel) {
        callback.onCancel(orderId)
      }
    })
    
    // Update order status to cancelled
    this.updateOrder(orderId, { status: 'cancelled' })
  }
  
  /**
   * Handle price change from overlay drag
   */
  handlePriceChange = (orderId: string, newPrice: number, oldPrice: number): void => {
    const order = this.orders.get(orderId)
    if (!order) return
    
    // Update order price
    order.price = newPrice
    this.orders.set(orderId, order)
    
    // Notify callbacks
    this.callbacks.forEach(callback => {
      if (callback.onPriceChange) {
        callback.onPriceChange(orderId, newPrice, oldPrice)
      }
    })
    
    this.notifyCallbacks(orderId, 'dragged', order)
  }
  
  /**
   * Handle order drag end
   */
  handleOrderDragEnd = (orderId: string, finalPrice: number): void => {
    // This can be used for additional logic when dragging ends
    console.log(`Order ${orderId} drag ended at price ${finalPrice}`)
  }
  
  /**
   * Handle order click
   */
  handleOrderClick = (orderId: string): void => {
    this.callbacks.forEach(callback => {
      if (callback.onOrderClick) {
        callback.onOrderClick(orderId)
      }
    })
  }
  
  /**
   * Create overlay for order
   */
  private createOrderOverlay(order: TradingOrder): void {
    if (!this.chart) return
    
    const orderStyle = getOrderStyle(this.theme, order.side, order.type)
    const orderData: OrderOverlayData = {
      ...order,
      currentPrice: this.currentPrice,
      pnlResult: calculatePnL(order, this.currentPrice),
      theme: orderStyle
    }
    
    const overlayId = this.chart.createOverlay({
      name: 'trading_order',
      points: [{ value: order.price, timestamp: order.timestamp }],
      extendData: orderData
    })
    
    if (overlayId && typeof overlayId === 'string') {
      this.overlayIds.set(order.id, overlayId)
    }
  }
  
  /**
   * Update overlay for order
   */
  private updateOrderOverlay(order: TradingOrder): void {
    if (!this.chart) return
    
    const overlayId = this.overlayIds.get(order.id)
    if (!overlayId) return
    
    const orderStyle = getOrderStyle(this.theme, order.side, order.type)
    const orderData: OrderOverlayData = {
      ...order,
      currentPrice: this.currentPrice,
      pnlResult: calculatePnL(order, this.currentPrice),
      theme: orderStyle
    }
    
    this.chart.overrideOverlay({
      id: overlayId,
      points: [{ value: order.price, timestamp: order.timestamp }],
      extendData: orderData
    })
  }
  
  /**
   * Refresh all order overlays
   */
  private refreshAllOrders(): void {
    this.orders.forEach(order => {
      this.updateOrderOverlay(order)
    })
  }
  
  /**
   * Notify all callbacks
   */
  private notifyCallbacks(orderId: string, event: OrderEvent, order: TradingOrder): void {
    this.callbacks.forEach(callback => {
      if (callback.onOrderEvent) {
        callback.onOrderEvent(orderId, event, order)
      }
    })
  }
  
  /**
   * Clear all orders
   */
  clearAllOrders(): void {
    const orderIds = Array.from(this.orders.keys())
    orderIds.forEach(orderId => this.removeOrder(orderId))
  }
  
  /**
   * Get orders by symbol
   */
  getOrdersBySymbol(symbol: string): TradingOrder[] {
    return this.getAllOrders().filter(order => order.symbol === symbol)
  }
  
  /**
   * Get orders by type
   */
  getOrdersByType(type: string): TradingOrder[] {
    return this.getAllOrders().filter(order => order.type === type)
  }
  
  /**
   * Get orders by status
   */
  getOrdersByStatus(status: string): TradingOrder[] {
    return this.getAllOrders().filter(order => order.status === status)
  }
}

export default OrderManagerImpl