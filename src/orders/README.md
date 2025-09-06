# Order Management System

This module provides comprehensive order management functionality for KLineChart Pro, allowing you to display and manage trading orders directly on the chart with TradingView/Bybit-style functionality.

## Features

- **Multiple Order Types**: Entry, Limit, Stop Loss, Take Profit, Market orders
- **Interactive Orders**: Drag to adjust prices, click to cancel
- **Real-time PnL**: Automatic profit/loss calculations
- **Customizable Themes**: Full styling control for different order types
- **Event Callbacks**: React to order interactions
- **Programmatic API**: Complete CRUD operations

## Quick Start

```typescript
import { KLineChartPro } from "@klinecharts/pro";

// Initialize chart with order support
const chartPro = new KLineChartPro({
  container: "#chart",
  symbol: { ticker: "BTCUSDT" },
  period: { multiplier: 1, timespan: "hour", text: "1H" },
  datafeed: yourDatafeed,
});

// Add an entry order
const orderId = chartPro.setOrder({
  type: "entry",
  side: "buy",
  price: 45000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "filled",
});

// Add stop loss
chartPro.setOrder({
  type: "stop_loss",
  side: "sell",
  price: 43000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "pending",
  entryPrice: 45000, // For PnL calculation
});

// Add take profit
chartPro.setOrder({
  type: "take_profit",
  side: "sell",
  price: 48000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "pending",
  entryPrice: 45000,
});
```

## API Reference

### Order Management Methods

#### `setOrder(order: CreateOrderOptions): string`

Creates a new order and returns the order ID.

```typescript
const orderId = chartPro.setOrder({
  type: "limit",
  side: "buy",
  price: 44000,
  quantity: 0.05,
  symbol: "BTCUSDT",
  text: "Custom order label", // Optional custom text
});
```

#### `updateOrder(orderId: string, updates: Partial<TradingOrder>): void`

Updates an existing order.

```typescript
chartPro.updateOrder(orderId, {
  price: 44500,
  status: "filled",
});
```

#### `removeOrder(orderId: string): void`

Removes an order from the chart.

```typescript
chartPro.removeOrder(orderId);
```

#### `getOrder(orderId: string): TradingOrder | undefined`

Gets a specific order by ID.

```typescript
const order = chartPro.getOrder(orderId);
```

#### `getAllOrders(): TradingOrder[]`

Gets all orders.

```typescript
const orders = chartPro.getAllOrders();
```

#### `clearAllOrders(): void`

Removes all orders from the chart.

```typescript
chartPro.clearAllOrders();
```

### Event Callbacks

#### `onOrderUpdate(callback: Function): void`

Listen for order events (created, updated, cancelled, filled, dragged).

```typescript
chartPro.onOrderUpdate((orderId, event, order) => {
  console.log(`Order ${orderId} was ${event}`, order);
});
```

#### `onOrderCancel(callback: Function): void`

Listen for order cancellations (when user clicks X button).

```typescript
chartPro.onOrderCancel((orderId) => {
  // Cancel order on your exchange
  cancelOrderOnExchange(orderId);
});
```

#### `onOrderPriceChange(callback: Function): void`

Listen for price changes (when user drags order).

```typescript
chartPro.onOrderPriceChange((orderId, newPrice, oldPrice) => {
  // Update order price on your exchange
  updateOrderPriceOnExchange(orderId, newPrice);
});
```

#### `onOrderClick(callback: Function): void`

Listen for order clicks.

```typescript
chartPro.onOrderClick((orderId) => {
  // Show order details modal
  showOrderDetails(orderId);
});
```

### Theme Management

#### `setOrderTheme(theme: Partial<OrderTheme>): void`

Customize order appearance.

```typescript
chartPro.setOrderTheme({
  buy: {
    entry: {
      lineColor: "#00ff00",
      textColor: "#00ff00",
      lineWidth: 2,
    },
  },
});
```

## Order Types

### Entry Orders

- **Purpose**: Mark entry positions
- **Visual**: Solid horizontal line
- **Features**: Shows PnL if filled

### Limit Orders

- **Purpose**: Pending buy/sell orders
- **Visual**: Dashed horizontal line
- **Features**: Draggable, cancellable

### Stop Loss Orders

- **Purpose**: Risk management
- **Visual**: Red solid line
- **Features**: Shows risk amount, draggable

### Take Profit Orders

- **Purpose**: Profit targets
- **Visual**: Green solid line
- **Features**: Shows profit target, draggable

### Market Orders

- **Purpose**: Immediate execution orders
- **Visual**: Purple solid line
- **Features**: Typically filled immediately

## Order Properties

```typescript
interface TradingOrder {
  id: string; // Unique identifier
  type: OrderType; // 'entry' | 'limit' | 'stop_loss' | 'take_profit' | 'market'
  side: OrderSide; // 'buy' | 'sell'
  price: number; // Order price
  quantity: number; // Order quantity
  symbol: string; // Trading symbol
  status: OrderStatus; // 'pending' | 'filled' | 'cancelled' | 'partially_filled'
  timestamp: number; // Creation timestamp
  text?: string; // Custom display text
  entryPrice?: number; // Entry price for PnL calculation
  stopLoss?: number; // Associated stop loss price
  takeProfit?: number; // Associated take profit price
  pnl?: number; // Current profit/loss
  unrealizedPnl?: number; // Unrealized PnL
  fees?: number; // Trading fees
  fillPrice?: number; // Actual fill price
  fillQuantity?: number; // Actual fill quantity
  customData?: Record<string, any>; // Additional custom data
}
```

## Styling

Orders are automatically styled based on type and side, but you can customize:

- **Line colors and styles**
- **Text colors and fonts**
- **Background colors**
- **Line widths**
- **Cancel button visibility**
- **Drag handle visibility**

## Integration Example

```typescript
class TradingInterface {
  private chartPro: ChartProWithOrders

  constructor() {
    this.chartPro = new KLineChartPro({...})
    this.setupOrderHandlers()
  }

  private setupOrderHandlers() {
    // Handle order cancellations
    this.chartPro.onOrderCancel(async (orderId) => {
      try {
        await this.exchangeAPI.cancelOrder(orderId)
        this.chartPro.removeOrder(orderId)
      } catch (error) {
        console.error('Failed to cancel order:', error)
      }
    })

    // Handle price changes
    this.chartPro.onOrderPriceChange(async (orderId, newPrice) => {
      try {
        await this.exchangeAPI.modifyOrder(orderId, { price: newPrice })
      } catch (error) {
        console.error('Failed to modify order:', error)
        // Revert price change
        const order = this.chartPro.getOrder(orderId)
        if (order) {
          this.chartPro.updateOrder(orderId, { price: order.price })
        }
      }
    })
  }

  // Add order from exchange
  addOrderFromExchange(exchangeOrder: ExchangeOrder) {
    this.chartPro.setOrder({
      id: exchangeOrder.id,
      type: this.mapOrderType(exchangeOrder.type),
      side: exchangeOrder.side,
      price: exchangeOrder.price,
      quantity: exchangeOrder.quantity,
      symbol: exchangeOrder.symbol,
      status: this.mapOrderStatus(exchangeOrder.status)
    })
  }
}
```

## Best Practices

1. **Always handle callbacks**: Implement proper error handling for order operations
2. **Sync with exchange**: Keep chart orders synchronized with your exchange
3. **Use custom data**: Store additional order metadata in `customData`
4. **Theme consistency**: Match your application's color scheme
5. **Performance**: Remove old/filled orders to keep chart performant
6. **User feedback**: Provide visual feedback for order operations

## Troubleshooting

### Orders not appearing

- Ensure order overlays are registered: `registerOverlay(orderOverlay)`
- Check that order manager is initialized
- Verify order data is valid

### Drag not working

- Check order status (only 'pending' orders are draggable)
- Ensure `draggable: true` in theme
- Verify order manager callbacks are set up

### Cancel button not showing

- Check order status (only cancellable orders show button)
- Ensure `showCancelButton: true` in theme
- Verify click handlers are registered
