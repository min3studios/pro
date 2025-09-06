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

import { KLineChartPro } from '../index'
import type { ChartProWithOrders } from '../types'

/**
 * Example usage of the Order Management System
 */
export class OrderManagementExample {
  private chart: ChartProWithOrders
  
  constructor(container: string | HTMLElement) {
    // Initialize chart with order support
    this.chart = new KLineChartPro({
      container,
      symbol: { ticker: 'BTCUSDT', name: 'Bitcoin/USDT' },
      period: { multiplier: 1, timespan: 'hour', text: '1H' },
      datafeed: this.createMockDatafeed(),
      theme: 'dark'
    }) as unknown as ChartProWithOrders
    
    this.setupOrderHandlers()
    this.addExampleOrders()
  }
  
  private setupOrderHandlers() {
    // Handle order cancellations
    this.chart.onOrderCancel((orderId) => {
      console.log(`Order ${orderId} cancelled by user`)
      // In real implementation, cancel order on exchange
      this.cancelOrderOnExchange(orderId)
    })
    
    // Handle price changes from dragging
    this.chart.onOrderPriceChange((orderId, newPrice, oldPrice) => {
      console.log(`Order ${orderId} price changed from ${oldPrice} to ${newPrice}`)
      // In real implementation, update order on exchange
      this.updateOrderOnExchange(orderId, newPrice)
    })
    
    // Handle order clicks
    this.chart.onOrderClick((orderId) => {
      console.log(`Order ${orderId} clicked`)
      const order = this.chart.getOrder(orderId)
      if (order) {
        console.log('Order details:', order)
      }
    })
    
    // Handle all order events
    this.chart.onOrderUpdate((orderId, event, order) => {
      console.log(`Order ${orderId} event: ${event}`, order)
    })
  }
  
  private addExampleOrders() {
    // Add a filled entry order
    const entryOrderId = this.chart.setOrder({
      type: 'entry',
      side: 'buy',
      price: 45000,
      quantity: 0.1,
      symbol: 'BTCUSDT',
      status: 'filled',
      text: 'Entry Long Position'
    })
    
    // Add stop loss order
    this.chart.setOrder({
      type: 'stop_loss',
      side: 'sell',
      price: 43000,
      quantity: 0.1,
      symbol: 'BTCUSDT',
      status: 'pending',
      entryPrice: 45000,
      text: 'Stop Loss Protection'
    })
    
    // Add take profit order
    this.chart.setOrder({
      type: 'take_profit',
      side: 'sell',
      price: 48000,
      quantity: 0.1,
      symbol: 'BTCUSDT',
      status: 'pending',
      entryPrice: 45000,
      text: 'Take Profit Target'
    })
    
    // Add pending limit order
    this.chart.setOrder({
      type: 'limit',
      side: 'buy',
      price: 44000,
      quantity: 0.05,
      symbol: 'BTCUSDT',
      status: 'pending',
      text: 'Buy Limit Order'
    })
    
    // Add another limit order (sell)
    this.chart.setOrder({
      type: 'limit',
      side: 'sell',
      price: 46000,
      quantity: 0.05,
      symbol: 'BTCUSDT',
      status: 'pending',
      text: 'Sell Limit Order'
    })
  }
  
  // Example methods for exchange integration
  private async cancelOrderOnExchange(orderId: string) {
    try {
      // Simulate API call
      await this.mockApiCall(`/orders/${orderId}`, 'DELETE')
      
      // Remove from chart
      this.chart.removeOrder(orderId)
      
      console.log(`Order ${orderId} successfully cancelled`)
    } catch (error) {
      console.error(`Failed to cancel order ${orderId}:`, error)
    }
  }
  
  private async updateOrderOnExchange(orderId: string, newPrice: number) {
    try {
      // Simulate API call
      await this.mockApiCall(`/orders/${orderId}`, 'PUT', { price: newPrice })
      
      // Update chart order
      this.chart.updateOrder(orderId, { price: newPrice })
      
      console.log(`Order ${orderId} price updated to ${newPrice}`)
    } catch (error) {
      console.error(`Failed to update order ${orderId}:`, error)
      
      // Revert price change on error
      const order = this.chart.getOrder(orderId)
      if (order) {
        // In real implementation, revert to original price
        console.log('Reverting price change due to error')
      }
    }
  }
  
  // Mock API call for demonstration
  private mockApiCall(endpoint: string, method: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve({ success: true, data })
        } else {
          reject(new Error('API call failed'))
        }
      }, 500)
    })
  }
  
  // Mock datafeed for demonstration
  private createMockDatafeed() {
    return {
      searchSymbols: async () => [
        { ticker: 'BTCUSDT', name: 'Bitcoin/USDT' }
      ],
      getHistoryKLineData: async () => {
        // Generate mock OHLCV data
        const data = []
        const basePrice = 45000
        let currentTime = Date.now() - 100 * 60 * 60 * 1000 // 100 hours ago
        
        for (let i = 0; i < 100; i++) {
          const open = basePrice + (Math.random() - 0.5) * 2000
          const close = open + (Math.random() - 0.5) * 1000
          const high = Math.max(open, close) + Math.random() * 500
          const low = Math.min(open, close) - Math.random() * 500
          const volume = Math.random() * 1000
          
          data.push({
            timestamp: currentTime,
            open,
            high,
            low,
            close,
            volume
          })
          
          currentTime += 60 * 60 * 1000 // 1 hour
        }
        
        return data
      },
      subscribe: () => {},
      unsubscribe: () => {}
    }
  }
  
  // Public methods for external control
  public addOrder(orderData: any) {
    return this.chart.setOrder(orderData)
  }
  
  public removeOrder(orderId: string) {
    this.chart.removeOrder(orderId)
  }
  
  public getAllOrders() {
    return this.chart.getAllOrders()
  }
  
  public clearAllOrders() {
    this.chart.clearAllOrders()
  }
  
  public setCustomTheme() {
    // Example of custom theming
    this.chart.setOrderTheme({
      buy: {
        entry: {
          lineColor: '#00ff88',
          textColor: '#00ff88',
          lineWidth: 2,
          backgroundColor: 'rgba(0, 255, 136, 0.1)'
        },
        limit: {
          lineColor: '#ffaa00',
          textColor: '#ffaa00',
          lineStyle: 'dashed'
        }
      },
      sell: {
        entry: {
          lineColor: '#ff4444',
          textColor: '#ff4444',
          lineWidth: 2,
          backgroundColor: 'rgba(255, 68, 68, 0.1)'
        }
      }
    })
  }
}

// Usage example
export function initializeOrderManagement(containerId: string) {
  const orderExample = new OrderManagementExample(containerId)
  
  // Set custom theme after 2 seconds
  setTimeout(() => {
    orderExample.setCustomTheme()
  }, 2000)
  
  return orderExample
}