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

// Get colors based on order type and side
function getOrderColors(type: string, side: string) {
  switch (type) {
    case 'take_profit':
      return {
        lineColor: '#2196F3', // Blue
        backgroundColor: '#2196F3',
        borderColor: '#1976D2',
        closeButtonColor: '#2196F3'
      }
    case 'stop_loss':
      return {
        lineColor: '#E91E63', // Pink/Red
        backgroundColor: '#E91E63',
        borderColor: '#C2185B',
        closeButtonColor: '#E91E63'
      }
    case 'entry':
      if (side === 'buy') {
        return {
          lineColor: '#4CAF50', // Green for buy
          backgroundColor: '#4CAF50',
          borderColor: '#388E3C',
          closeButtonColor: '#4CAF50'
        }
      } else {
        return {
          lineColor: '#F44336', // Red for sell
          backgroundColor: '#F44336',
          borderColor: '#D32F2F',
          closeButtonColor: '#F44336'
        }
      }
    default: // PnL and others
      return {
        lineColor: '#9E9E9E', // Gray
        backgroundColor: '#616161',
        borderColor: '#424242',
        closeButtonColor: '#9E9E9E'
      }
  }
}

// Create order label text based on type
function createOrderLabelText(orderData: any, currentPrice: number, pnlResult: any): string {
  const positionSize = orderData.quantity || 0

  switch (orderData.type) {
    case 'take_profit':
      return `TP Price > ${orderData.price} | ${positionSize}`
    case 'stop_loss':
      return `SL Price < ${orderData.price} | ${positionSize}`
    case 'entry':
      if (pnlResult && pnlResult.netPnl !== 0) {
        const pnlSign = pnlResult.netPnl >= 0 ? '' : '-'
        return `PNL ${pnlSign}$${Math.abs(pnlResult.netPnl).toFixed(2)} | ${positionSize}`
      }
      return `${orderData.side.toUpperCase()} ${orderData.price} | ${positionSize}`
    default:
      return `${orderData.type.toUpperCase()} ${orderData.price} | ${positionSize}`
  }
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

    // Calculate current price for PnL if available
    const currentPrice = orderData.currentPrice || orderData.price
    const pnlResult = calculatePnL(orderData, currentPrice)

    // Get order colors based on type
    const colors = getOrderColors(orderData.type, orderData.side)

    // Main horizontal dotted price line
    const lineCoordinates: Coordinate[] = [
      { x: 0, y: coord.y },
      { x: bounding.width, y: coord.y }
    ]

    figures.push({
      type: 'line',
      attrs: {
        coordinates: lineCoordinates,
        color: colors.lineColor,
        size: 1,
        style: 'dashed' // Always dotted/dashed lines
      }
    })
    
    // Create order label text based on type
    const labelText = createOrderLabelText(orderData, currentPrice, pnlResult)

    // Center the label on the chart
    const textWidth = labelText.length * 6.5 // Approximate text width
    const textX = (bounding.width - textWidth) / 2
    const textY = coord.y - 8

    // Text background rectangle with rounded corners
    const bgPadding = 8
    const bgHeight = 20
    figures.push({
      type: 'rect',
      ignoreEvent: true,
      attrs: {
        x: textX - bgPadding,
        y: textY - bgHeight + 4,
        width: textWidth + (bgPadding * 2),
        height: bgHeight,
        color: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderSize: 1,
        borderRadius: 4
      }
    })

    // Main order text (white text)
    figures.push({
      type: 'text',
      ignoreEvent: true,
      attrs: {
        x: textX + textWidth / 2,
        y: textY - 4,
        text: labelText,
        color: '#FFFFFF',
        size: 11,
        baseline: 'middle',
        align: 'center',
        weight: 'normal'
      }
    })

    // Close button (X) on the right side of the label
    const closeButtonX = textX + textWidth + bgPadding + 5
    const closeButtonY = textY - bgHeight / 2 + 2
    const closeButtonSize = 16

    figures.push({
      type: 'rect',
      attrs: {
        x: closeButtonX,
        y: closeButtonY - closeButtonSize / 2,
        width: closeButtonSize,
        height: closeButtonSize,
        color: colors.closeButtonColor,
        borderColor: '#FFFFFF',
        borderSize: 1,
        borderRadius: 2
      },
      onClick: () => {
        if (orderManager && orderManager.handleOrderCancel) {
          orderManager.handleOrderCancel(orderData.id)
        }
      }
    })

    // Close button X text
    figures.push({
      type: 'text',
      ignoreEvent: true,
      attrs: {
        x: closeButtonX + closeButtonSize / 2,
        y: closeButtonY,
        text: '×',
        color: '#FFFFFF',
        size: 12,
        align: 'center',
        baseline: 'middle',
        weight: 'bold'
      }
    })
    

    
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
            size: 11,
            baseline: 'bottom'
          }
        })
      }
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
  },

  // Prevent right-click removal for programmatic orders
  onRightClick: ({ overlay }) => {
    const orderData = overlay.extendData as OrderOverlayData
    if (!orderData) return false

    // Programmatic orders should not be removable by right-click
    // Return true to prevent default removal behavior
    return true
  }
}

export default orderOverlay