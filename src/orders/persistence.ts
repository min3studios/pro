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

import { TradingOrder, OrderTheme } from './types'

/**
 * Order persistence utilities for saving/loading orders and themes
 */
export class OrderPersistence {
  private static readonly ORDERS_KEY = 'klinecharts_pro_orders'
  private static readonly THEME_KEY = 'klinecharts_pro_order_theme'
  
  /**
   * Save orders to localStorage
   */
  static saveOrders(orders: TradingOrder[], symbol?: string): void {
    try {
      const key = symbol ? `${this.ORDERS_KEY}_${symbol}` : this.ORDERS_KEY
      const serializedOrders = JSON.stringify(orders)
      localStorage.setItem(key, serializedOrders)
    } catch (error) {
      console.warn('Failed to save orders to localStorage:', error)
    }
  }
  
  /**
   * Load orders from localStorage
   */
  static loadOrders(symbol?: string): TradingOrder[] {
    try {
      const key = symbol ? `${this.ORDERS_KEY}_${symbol}` : this.ORDERS_KEY
      const serializedOrders = localStorage.getItem(key)
      if (serializedOrders) {
        return JSON.parse(serializedOrders)
      }
    } catch (error) {
      console.warn('Failed to load orders from localStorage:', error)
    }
    return []
  }
  
  /**
   * Save order theme to localStorage
   */
  static saveTheme(theme: OrderTheme): void {
    try {
      const serializedTheme = JSON.stringify(theme)
      localStorage.setItem(this.THEME_KEY, serializedTheme)
    } catch (error) {
      console.warn('Failed to save order theme to localStorage:', error)
    }
  }
  
  /**
   * Load order theme from localStorage
   */
  static loadTheme(): OrderTheme | null {
    try {
      const serializedTheme = localStorage.getItem(this.THEME_KEY)
      if (serializedTheme) {
        return JSON.parse(serializedTheme)
      }
    } catch (error) {
      console.warn('Failed to load order theme from localStorage:', error)
    }
    return null
  }
  
  /**
   * Clear all saved orders
   */
  static clearOrders(symbol?: string): void {
    try {
      const key = symbol ? `${this.ORDERS_KEY}_${symbol}` : this.ORDERS_KEY
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to clear orders from localStorage:', error)
    }
  }
  
  /**
   * Clear saved theme
   */
  static clearTheme(): void {
    try {
      localStorage.removeItem(this.THEME_KEY)
    } catch (error) {
      console.warn('Failed to clear order theme from localStorage:', error)
    }
  }
  
  /**
   * Export orders to JSON string
   */
  static exportOrders(orders: TradingOrder[]): string {
    return JSON.stringify(orders, null, 2)
  }
  
  /**
   * Import orders from JSON string
   */
  static importOrders(jsonString: string): TradingOrder[] {
    try {
      const orders = JSON.parse(jsonString)
      if (Array.isArray(orders)) {
        return orders
      }
    } catch (error) {
      console.error('Failed to import orders from JSON:', error)
    }
    return []
  }
  
  /**
   * Get all saved order keys (for multiple symbols)
   */
  static getSavedOrderKeys(): string[] {
    const keys: string[] = []
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.ORDERS_KEY)) {
          keys.push(key)
        }
      }
    } catch (error) {
      console.warn('Failed to get saved order keys:', error)
    }
    return keys
  }
}

/**
 * Enhanced order manager with persistence capabilities
 */
export class PersistentOrderManager {
  private symbol: string
  private autosave: boolean
  
  constructor(symbol: string, autosave: boolean = true) {
    this.symbol = symbol
    this.autosave = autosave
  }
  
  /**
   * Save orders with automatic symbol-based key
   */
  saveOrders(orders: TradingOrder[]): void {
    OrderPersistence.saveOrders(orders, this.symbol)
  }
  
  /**
   * Load orders for current symbol
   */
  loadOrders(): TradingOrder[] {
    return OrderPersistence.loadOrders(this.symbol)
  }
  
  /**
   * Auto-save orders if enabled
   */
  autoSaveOrders(orders: TradingOrder[]): void {
    if (this.autosave) {
      this.saveOrders(orders)
    }
  }
  
  /**
   * Clear orders for current symbol
   */
  clearOrders(): void {
    OrderPersistence.clearOrders(this.symbol)
  }
  
  /**
   * Set autosave mode
   */
  setAutosave(enabled: boolean): void {
    this.autosave = enabled
  }
  
  /**
   * Get autosave status
   */
  isAutosaveEnabled(): boolean {
    return this.autosave
  }
}

export default OrderPersistence