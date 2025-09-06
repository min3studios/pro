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

import { OrderTheme, OrderStyle } from './types'

// Default order styles
const defaultOrderStyle: Partial<OrderStyle> = {
  lineWidth: 1,
  fontSize: 12,
  showCancelButton: true,
  draggable: true,
  backgroundColor: 'rgba(0, 0, 0, 0.8)'
}

// Light theme colors
export const lightTheme: OrderTheme = {
  buy: {
    entry: {
      ...defaultOrderStyle,
      lineColor: '#1976d2',
      textColor: '#1976d2',
      lineStyle: 'solid'
    } as OrderStyle,
    limit: {
      ...defaultOrderStyle,
      lineColor: '#ff9800',
      textColor: '#ff9800',
      lineStyle: 'dashed'
    } as OrderStyle,
    stopLoss: {
      ...defaultOrderStyle,
      lineColor: '#f44336',
      textColor: '#f44336',
      lineStyle: 'solid'
    } as OrderStyle,
    takeProfit: {
      ...defaultOrderStyle,
      lineColor: '#4caf50',
      textColor: '#4caf50',
      lineStyle: 'solid'
    } as OrderStyle,
    market: {
      ...defaultOrderStyle,
      lineColor: '#9c27b0',
      textColor: '#9c27b0',
      lineStyle: 'solid'
    } as OrderStyle
  },
  sell: {
    entry: {
      ...defaultOrderStyle,
      lineColor: '#d32f2f',
      textColor: '#d32f2f',
      lineStyle: 'solid'
    } as OrderStyle,
    limit: {
      ...defaultOrderStyle,
      lineColor: '#f57c00',
      textColor: '#f57c00',
      lineStyle: 'dashed'
    } as OrderStyle,
    stopLoss: {
      ...defaultOrderStyle,
      lineColor: '#f44336',
      textColor: '#f44336',
      lineStyle: 'solid'
    } as OrderStyle,
    takeProfit: {
      ...defaultOrderStyle,
      lineColor: '#4caf50',
      textColor: '#4caf50',
      lineStyle: 'solid'
    } as OrderStyle,
    market: {
      ...defaultOrderStyle,
      lineColor: '#9c27b0',
      textColor: '#9c27b0',
      lineStyle: 'solid'
    } as OrderStyle
  }
}

// Dark theme colors
export const darkTheme: OrderTheme = {
  buy: {
    entry: {
      ...defaultOrderStyle,
      lineColor: '#42a5f5',
      textColor: '#42a5f5',
      lineStyle: 'solid',
      backgroundColor: 'rgba(66, 165, 245, 0.1)'
    } as OrderStyle,
    limit: {
      ...defaultOrderStyle,
      lineColor: '#ffb74d',
      textColor: '#ffb74d',
      lineStyle: 'dashed',
      backgroundColor: 'rgba(255, 183, 77, 0.1)'
    } as OrderStyle,
    stopLoss: {
      ...defaultOrderStyle,
      lineColor: '#ef5350',
      textColor: '#ef5350',
      lineStyle: 'solid',
      backgroundColor: 'rgba(239, 83, 80, 0.1)'
    } as OrderStyle,
    takeProfit: {
      ...defaultOrderStyle,
      lineColor: '#66bb6a',
      textColor: '#66bb6a',
      lineStyle: 'solid',
      backgroundColor: 'rgba(102, 187, 106, 0.1)'
    } as OrderStyle,
    market: {
      ...defaultOrderStyle,
      lineColor: '#ab47bc',
      textColor: '#ab47bc',
      lineStyle: 'solid',
      backgroundColor: 'rgba(171, 71, 188, 0.1)'
    } as OrderStyle
  },
  sell: {
    entry: {
      ...defaultOrderStyle,
      lineColor: '#ef5350',
      textColor: '#ef5350',
      lineStyle: 'solid',
      backgroundColor: 'rgba(239, 83, 80, 0.1)'
    } as OrderStyle,
    limit: {
      ...defaultOrderStyle,
      lineColor: '#ff8a65',
      textColor: '#ff8a65',
      lineStyle: 'dashed',
      backgroundColor: 'rgba(255, 138, 101, 0.1)'
    } as OrderStyle,
    stopLoss: {
      ...defaultOrderStyle,
      lineColor: '#ef5350',
      textColor: '#ef5350',
      lineStyle: 'solid',
      backgroundColor: 'rgba(239, 83, 80, 0.1)'
    } as OrderStyle,
    takeProfit: {
      ...defaultOrderStyle,
      lineColor: '#66bb6a',
      textColor: '#66bb6a',
      lineStyle: 'solid',
      backgroundColor: 'rgba(102, 187, 106, 0.1)'
    } as OrderStyle,
    market: {
      ...defaultOrderStyle,
      lineColor: '#ab47bc',
      textColor: '#ab47bc',
      lineStyle: 'solid',
      backgroundColor: 'rgba(171, 71, 188, 0.1)'
    } as OrderStyle
  }
}

// Default theme (dark)
export const defaultTheme = darkTheme

// Theme utility functions
export function getOrderStyle(theme: OrderTheme, side: 'buy' | 'sell', type: string): OrderStyle {
  const sideTheme = theme[side]
  return sideTheme[type as keyof typeof sideTheme] || sideTheme.entry
}

export function mergeThemes(baseTheme: OrderTheme, customTheme: Partial<OrderTheme>): OrderTheme {
  return {
    buy: {
      ...baseTheme.buy,
      ...customTheme.buy
    },
    sell: {
      ...baseTheme.sell,
      ...customTheme.sell
    }
  }
}

// Order type display names
export const orderTypeNames = {
  entry: 'Entry',
  limit: 'Limit',
  stop_loss: 'Stop Loss',
  take_profit: 'Take Profit',
  market: 'Market'
}

// Order side display names
export const orderSideNames = {
  buy: 'BUY',
  sell: 'SELL'
}