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

import { KLineData, Styles, DeepPartial } from 'klinecharts'

export interface SymbolInfo {
  ticker: string
  name?: string
  shortName?: string
  exchange?: string
  market?: string
  pricePrecision?: number
  volumePrecision?: number
  priceCurrency?: string
  type?: string
  logo?: string
}

export interface Period {
  multiplier: number
  timespan: string
  text: string
}

export type DatafeedSubscribeCallback = (data: KLineData) => void

export interface Datafeed {
  searchSymbols (search?: string): Promise<SymbolInfo[]>
  getHistoryKLineData (symbol: SymbolInfo, period: Period, from: number, to: number): Promise<KLineData[]>
  subscribe (symbol: SymbolInfo, period: Period, callback: DatafeedSubscribeCallback): void
  unsubscribe (symbol: SymbolInfo, period: Period): void
}

export interface ChartProOptions {
  container: string | HTMLElement
  styles?: DeepPartial<Styles>
  watermark?: string | Node
  theme?: string
  locale?: string
  drawingBarVisible?: boolean
  symbol: SymbolInfo
  period: Period
  periods?: Period[]
  timezone?: string
  mainIndicators?: string[]
  subIndicators?: string[]
  datafeed: Datafeed
}

export interface ChartPro {
  // Core chart methods
  setTheme(theme: string): void
  getTheme(): string
  setStyles(styles: DeepPartial<Styles>): void
  getStyles(): Styles
  setLocale(locale: string): void
  getLocale(): string
  setTimezone(timezone: string): void
  getTimezone(): string
  setSymbol(symbol: SymbolInfo): void
  getSymbol(): SymbolInfo
  setPeriod(period: Period): void
  getPeriod(): Period

  // Order management methods (built-in)
  setOrder(order: any): string
  updateOrder(orderId: string, updates: any): void
  removeOrder(orderId: string): void
  getOrder(orderId: string): any
  getAllOrders(): any[]
  clearAllOrders(): void

  // Position marker methods
  createPositionMarker(options: {
    timestamp: number
    price: number
    side: 'buy' | 'sell'
    quantity: number
    symbol: string
    id?: string
  }): string

  // Order event callbacks
  onOrderUpdate(callback: (orderId: string, event: string, order: any) => void): void
  onOrderCancel(callback: (orderId: string) => void): void
  onOrderPriceChange(callback: (orderId: string, newPrice: number, oldPrice: number) => void): void
  onOrderClick(callback: (orderId: string) => void): void
  onOrderDragEnd(callback: (orderId: string, finalPrice: number) => void): void

  // Order theme management
  setOrderTheme(theme: any): void
  getOrderTheme(): any
}
