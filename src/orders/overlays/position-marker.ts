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

import { OverlayTemplate, Coordinate } from 'klinecharts'

// Position marker overlay for showing B/S markers above candles
const positionMarkerOverlay: OverlayTemplate = {
  name: 'position_marker',
  totalStep: 1,
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  
  createPointFigures: ({ coordinates, overlay, bounding }) => {
    if (coordinates.length === 0) return []
    
    const markerData = overlay.extendData
    if (!markerData) return []
    
    const figures = []
    const coord = coordinates[0]
    
    // Determine marker color and text based on side
    const isBuy = markerData.side === 'buy'
    const markerColor = isBuy ? '#4CAF50' : '#F44336' // Green for buy, red for sell
    const markerText = isBuy ? 'B' : 'S'
    
    // Position marker above the candle
    const markerSize = 20
    const markerX = coord.x - markerSize / 2
    const markerY = coord.y - markerSize - 10 // Position above the candle
    
    // Circle background
    figures.push({
      type: 'circle',
      attrs: {
        x: coord.x,
        y: markerY + markerSize / 2,
        r: markerSize / 2,
        color: markerColor,
        borderColor: '#FFFFFF',
        borderSize: 2
      }
    })
    
    // B/S text
    figures.push({
      type: 'text',
      ignoreEvent: true,
      attrs: {
        x: coord.x,
        y: markerY + markerSize / 2,
        text: markerText,
        color: '#FFFFFF',
        size: 12,
        align: 'center',
        baseline: 'middle',
        weight: 'bold'
      }
    })
    
    return figures
  },
  
  onClick: ({ overlay }) => {
    const markerData = overlay.extendData
    if (!markerData) return false
    
    // Handle marker click if needed
    console.log('Position marker clicked:', markerData)
    
    return true
  }
}

export default positionMarkerOverlay
