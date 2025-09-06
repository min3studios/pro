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

import { OverlayTemplate, utils, Coordinate, Bounding } from 'klinecharts'
import { TradingOrder, OrderOverlayData } from '../types'
import { 
  formatOrderText, 
  shouldShowCancelButton, 
  isOrderDraggable, 
  calculatePnL,
  calculateRiskAmount,
  calculateProfitTarget,
  getPnLColor
} from '../utils'

// Global reference to order manager for callbacks
let orderManager: any = null

export function setOrderManager(manager: any) {
  orderManager = manager
}

const orderOverlay: OverlayTemplate = {
  name: 'trading_order',
  totalStep: 1,
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: true,
  
  createPointFigures: ({ coordinates, overlay, bounding, precision }) => {
    if (coordinates.length === 0) return []
    
    const orderData = overlay.extendData as OrderOverlayData
    if (!orderData) return []
    
    const figures = []
    const coord = coordinates[0]
    const theme = orderData.theme
    
    // Calculate current price for PnL if available
    const currentPrice = orderData.currentPrice || orderData.price
    const pnlResult = calculatePnL(orderData, currentPrice)
    
    // Main horizontal price line
    const lineCoordinates: Coordinate[] = [
      { x: 0, y: coord.y },
      { x: bounding.width, y: coord.y }
    ]
    
    figures.push({
      type: 'line',
      attrs: {
        coordinates: lineCoordinates,
        color: theme.lineColor,
        size: theme.lineWidth || 1,
        style: theme.lineStyle || 'solid'
      }
    })
    
    // Order text label with background
    const orderText = formatOrderText(orderData, currentPrice, true)
    const textX = 10
    const textY = coord.y - 8
    
    // Text background rectangle
    if (theme.backgroundColor) {
      const textWidth = orderText.length * 7 // Approximate text width
      figures.push({
        type: 'rect',
        ignoreEvent: true,
        attrs: {
          x: textX - 4,
          y: textY - 12,
          width: textWidth + 8,
          height: 16,
          color: theme.backgroundColor,
          borderColor: theme.lineColor,
          borderSize: 1
        }
      })
    }
    
    // Main order text
    figures.push({
      type: 'text',
      ignoreEvent: true,
      attrs: {
        x: textX,
        y: textY,
        text: orderText,
        color: theme.textColor,
        size: theme.fontSize || 12,
        baseline: 'bottom',
        weight: 'normal'
      }
    })
    
    // PnL text (if order is filled and has PnL)
    if (pnlResult.netPnl !== 0 && (orderData.status === 'filled' || orderData.status === 'partially_filled')) {
      const pnlColor = getPnLColor(pnlResult.netPnl)
      const pnlText = `PnL: ${pnlResult.netPnl >= 0 ? '+' : ''}${pnlResult.netPnl.toFixed(2)} (${pnlResult.percentage.toFixed(2)}%)`
      
      figures.push({
        type: 'text',
        ignoreEvent: true,
        attrs: {
          x: textX,
          y: textY + 14,
          text: pnlText,
          color: pnlColor,
          size: (theme.fontSize || 12) - 1,
          baseline: 'bottom'
        }
      })
    }
    
    // Risk/Profit information for SL/TP orders
    if (orderData.type === 'stop_loss' && orderData.entryPrice) {
      const riskAmount = calculateRiskAmount(orderData, orderData.entryPrice)
      if (riskAmount > 0) {
        figures.push({
          type: 'text',
          ignoreEvent: true,
          attrs: {
            x: textX + 200,
            y: textY,
            text: `Risk: ${riskAmount.toFixed(2)}`,
            color: '#f44336',
            size: (theme.fontSize || 12) - 1,
            baseline: 'bottom'
          }
        })
      }
    }
    
    if (orderData.type === 'take_profit' && orderData.entryPrice) {
      const profitTarget = calculateProfitTarget(orderData, orderData.entryPrice)
      if (profitTarget > 0) {
        figures.push({
          type: 'text',
          ignoreEvent: true,
          attrs: {
            x: textX + 200,
            y: textY,
            text: `Target: +${profitTarget.toFixed(2)}`,
            color: '#4caf50',
            size: (theme.fontSize || 12) - 1,
            baseline: 'bottom'
          }
        })
      }
    }
    
    // Cancel button (if enabled and order is cancellable)
    if (theme.showCancelButton && shouldShowCancelButton(orderData)) {
      const buttonX = bounding.width - 30
      const buttonY = coord.y - 10
      const buttonSize = 20
      
      // Cancel button background
      figures.push({
        type: 'rect',
        attrs: {
          x: buttonX,
          y: buttonY,
          width: buttonSize,
          height: buttonSize,
          color: '#ff4444',
          borderColor: '#ffffff',
          borderSize: 1
        },
        onClick: () => {
          if (orderManager && orderManager.handleOrderCancel) {
            orderManager.handleOrderCancel(orderData.id)
          }
        }
      })
      
      // Cancel button X
      figures.push({
        type: 'text',
        ignoreEvent: true,
        attrs: {
          x: buttonX + buttonSize / 2,
          y: buttonY + buttonSize / 2 + 2,
          text: '×',
          color: '#ffffff',
          size: 14,
          align: 'center',
          baseline: 'middle',
          weight: 'bold'
        }
      })
    }
    
    // Drag handle indicator (small circle on the left)
    if (theme.draggable && isOrderDraggable(orderData)) {
      figures.push({
        type: 'circle',
        attrs: {
          x: 5,
          y: coord.y,
          r: 3,
          color: theme.lineColor,
          borderColor: '#ffffff',
          borderSize: 1
        }
      })
    }
    
    return figures
  },
  
  onPressedMoveStart: ({ overlay }) => {
    const orderData = overlay.extendData as OrderOverlayData
    if (!orderData || !isOrderDraggable(orderData)) {
      return false
    }
    return true
  },
  
  onPressedMoving: ({ overlay }) => {
    const orderData = overlay.extendData as OrderOverlayData
    if (!orderData || !isOrderDraggable(orderData)) {
      return false
    }
    
    // Update the order price based on the new point
    if (overlay.points && overlay.points.length > 0) {
      const newPrice = overlay.points[0].value
      const oldPrice = orderData.price
      
      // Update the overlay data only if newPrice is valid
      if (typeof newPrice === 'number') {
        orderData.price = newPrice
        overlay.extendData = orderData
        
        // Notify order manager of price change
        if (orderManager && orderManager.handlePriceChange) {
          orderManager.handlePriceChange(orderData.id, newPrice, oldPrice)
        }
      }
    }
    
    return true
  },
  
  onPressedMoveEnd: ({ overlay }) => {
    const orderData = overlay.extendData as OrderOverlayData
    if (!orderData) return false
    
    // Notify order manager that dragging ended
    if (orderManager && orderManager.handleOrderDragEnd) {
      orderManager.handleOrderDragEnd(orderData.id, orderData.price)
    }
    
    return true
  },
  
  onClick: ({ overlay }) => {
    const orderData = overlay.extendData as OrderOverlayData
    if (!orderData) return false
    
    // Notify order manager of order click
    if (orderManager && orderManager.handleOrderClick) {
      orderManager.handleOrderClick(orderData.id)
    }
    
    return true
  }
}

export default orderOverlay