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

import { TradingOrder, PnLResult, OrderType, OrderSide } from './types'
import { orderTypeNames, orderSideNames } from './themes'

/**
 * Calculate PnL for a trading order
 */
export function calculatePnL(order: TradingOrder, currentPrice: number): PnLResult {
  const entryPrice = order.entryPrice || order.price
  const quantity = order.fillQuantity || order.quantity
  const fees = order.fees || 0
  
  let unrealizedPnl = 0
  let realizedPnl = 0
  
  if (order.status === 'filled' || order.status === 'partially_filled') {
    if (order.side === 'buy') {
      unrealizedPnl = (currentPrice - entryPrice) * quantity
    } else {
      unrealizedPnl = (entryPrice - currentPrice) * quantity
    }
  }
  
  if (order.status === 'filled' && order.fillPrice) {
    if (order.side === 'buy') {
      realizedPnl = (order.fillPrice - entryPrice) * quantity
    } else {
      realizedPnl = (entryPrice - order.fillPrice) * quantity
    }
  }
  
  const netPnl = unrealizedPnl + realizedPnl - fees
  const percentage = entryPrice > 0 ? (netPnl / (entryPrice * quantity)) * 100 : 0
  
  return {
    unrealizedPnl,
    realizedPnl,
    percentage,
    fees,
    netPnl
  }
}

/**
 * Format order text for display
 */
export function formatOrderText(order: TradingOrder, currentPrice?: number, showPnL: boolean = true): string {
  const typeName = orderTypeNames[order.type] || order.type.toUpperCase()
  const sideName = orderSideNames[order.side]
  const price = order.price.toFixed(2)
  const quantity = order.quantity.toString()
  
  let text = `${typeName} ${sideName} ${quantity} @ ${price}`
  
  // Add custom text if provided
  if (order.text) {
    text = order.text
  }
  
  // Add PnL information for filled orders
  if (showPnL && currentPrice && (order.status === 'filled' || order.status === 'partially_filled')) {
    const pnlResult = calculatePnL(order, currentPrice)
    const pnlText = formatPnL(pnlResult.netPnl, pnlResult.percentage)
    text += ` ${pnlText}`
  }
  
  return text
}

/**
 * Format PnL value for display
 */
export function formatPnL(pnl: number, percentage: number): string {
  const sign = pnl >= 0 ? '+' : ''
  const pnlFormatted = `${sign}${pnl.toFixed(2)}`
  const percentageFormatted = `${sign}${percentage.toFixed(2)}%`
  return `(${pnlFormatted} | ${percentageFormatted})`
}

/**
 * Generate unique order ID
 */
export function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validate order data
 */
export function validateOrder(order: Partial<TradingOrder>): string[] {
  const errors: string[] = []
  
  if (!order.type) {
    errors.push('Order type is required')
  }
  
  if (!order.side) {
    errors.push('Order side is required')
  }
  
  if (typeof order.price !== 'number' || order.price <= 0) {
    errors.push('Valid price is required')
  }
  
  if (typeof order.quantity !== 'number' || order.quantity <= 0) {
    errors.push('Valid quantity is required')
  }
  
  if (!order.symbol) {
    errors.push('Symbol is required')
  }
  
  return errors
}

/**
 * Get order priority for display ordering
 */
export function getOrderPriority(order: TradingOrder): number {
  const priorities = {
    entry: 1,
    market: 2,
    limit: 3,
    stop_loss: 4,
    take_profit: 5
  }
  
  return priorities[order.type] || 999
}

/**
 * Sort orders by priority and price
 */
export function sortOrders(orders: TradingOrder[]): TradingOrder[] {
  return orders.sort((a, b) => {
    const priorityDiff = getOrderPriority(a) - getOrderPriority(b)
    if (priorityDiff !== 0) return priorityDiff
    
    // Sort by price within same priority
    return a.price - b.price
  })
}

/**
 * Check if order should show cancel button
 */
export function shouldShowCancelButton(order: TradingOrder): boolean {
  return order.status === 'pending' || order.status === 'partially_filled'
}

/**
 * Check if order is draggable
 */
export function isOrderDraggable(order: TradingOrder): boolean {
  return order.status === 'pending'
}

/**
 * Get line style based on order type and status
 */
export function getLineStyle(order: TradingOrder): 'solid' | 'dashed' | 'dotted' {
  if (order.status === 'cancelled') return 'dotted'
  if (order.type === 'limit') return 'dashed'
  return 'solid'
}

/**
 * Calculate risk amount for stop loss orders
 */
export function calculateRiskAmount(order: TradingOrder, entryPrice?: number): number {
  if (order.type !== 'stop_loss' || !entryPrice) return 0
  
  const priceDiff = Math.abs(entryPrice - order.price)
  return priceDiff * order.quantity
}

/**
 * Calculate profit target for take profit orders
 */
export function calculateProfitTarget(order: TradingOrder, entryPrice?: number): number {
  if (order.type !== 'take_profit' || !entryPrice) return 0
  
  const priceDiff = Math.abs(order.price - entryPrice)
  return priceDiff * order.quantity
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}

/**
 * Get order color based on PnL
 */
export function getPnLColor(pnl: number): string {
  if (pnl > 0) return '#4caf50' // Green for profit
  if (pnl < 0) return '#f44336' // Red for loss
  return '#757575' // Gray for neutral
}