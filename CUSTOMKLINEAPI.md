# Custom KLineChart Pro API Documentation

This document provides comprehensive documentation for the enhanced KLineChart Pro with Order Management System.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core API](#core-api)
- [Order Management API](#order-management-api)
- [Event System](#event-system)
- [Theming & Styling](#theming--styling)
- [Persistence](#persistence)
- [TypeScript Interfaces](#typescript-interfaces)
- [Examples](#examples)
- [Migration Guide](#migration-guide)

## Installation

### Using pnpm (Recommended)

```bash
# Configure registry first (one-time setup)
pnpm config set @min3studios:registry https://npm.pkg.github.com

# Install (no authentication needed)
pnpm add @min3studios/klinecharts-pro
```

### Using npm

```bash
# Configure registry first (one-time setup)
npm config set @min3studios:registry https://npm.pkg.github.com

# Install (no authentication needed)
npm install @min3studios/klinecharts-pro
```

### Using yarn

```bash
# Configure registry first (one-time setup)
npm config set @min3studios:registry https://npm.pkg.github.com

# Install (no authentication needed)
yarn add @min3studios/klinecharts-pro
```

> **Note**: This package is hosted on GitHub Packages as a public package. No authentication required! See [GITHUB_PACKAGES.md](GITHUB_PACKAGES.md) for detailed setup instructions.

## Quick Start

```typescript
import { KLineChartPro } from "@klinecharts/pro";
import type { ChartProWithOrders } from "@klinecharts/pro";

// Initialize chart with order management
const chart = new KLineChartPro({
  container: "#chart-container",
  symbol: { ticker: "BTCUSDT", name: "Bitcoin/USDT" },
  period: { multiplier: 1, timespan: "hour", text: "1H" },
  datafeed: yourDatafeed,
  theme: "dark",
}) as ChartProWithOrders;

// Add an order
const orderId = chart.setOrder({
  type: "entry",
  side: "buy",
  price: 45000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "filled",
});
```

## Core API

### KLineChartPro Constructor

```typescript
new KLineChartPro(options: ChartProOptions)
```

#### ChartProOptions

```typescript
interface ChartProOptions {
  container: string | HTMLElement; // Chart container
  styles?: DeepPartial<Styles>; // Chart styles
  watermark?: string | Node; // Watermark content
  theme?: string; // 'light' | 'dark'
  locale?: string; // Locale code
  drawingBarVisible?: boolean; // Show drawing tools
  symbol: SymbolInfo; // Trading symbol
  period: Period; // Time period
  periods?: Period[]; // Available periods
  timezone?: string; // Timezone
  mainIndicators?: string[]; // Main indicators
  subIndicators?: string[]; // Sub indicators
  datafeed: Datafeed; // Data provider
}
```

### Basic Chart Methods

```typescript
// Theme management
chart.setTheme(theme: string): void
chart.getTheme(): string

// Styling
chart.setStyles(styles: DeepPartial<Styles>): void
chart.getStyles(): Styles

// Localization
chart.setLocale(locale: string): void
chart.getLocale(): string

// Timezone
chart.setTimezone(timezone: string): void
chart.getTimezone(): string

// Symbol management
chart.setSymbol(symbol: SymbolInfo): void
chart.getSymbol(): SymbolInfo

// Period management
chart.setPeriod(period: Period): void
chart.getPeriod(): Period

// Direct chart access
chart.getChart(): Chart | null
```

## Order Management API

### Order CRUD Operations

#### setOrder()

Creates a new order and displays it on the chart.

```typescript
chart.setOrder(order: CreateOrderOptions): string
```

**Parameters:**

```typescript
interface CreateOrderOptions {
  id?: string; // Optional custom ID
  type: OrderType; // 'entry' | 'limit' | 'stop_loss' | 'take_profit' | 'market'
  side: OrderSide; // 'buy' | 'sell'
  price: number; // Order price
  quantity: number; // Order quantity
  symbol: string; // Trading symbol
  status?: OrderStatus; // 'pending' | 'filled' | 'cancelled' | 'partially_filled'
  text?: string; // Custom display text
  entryPrice?: number; // Entry price for PnL calculation
  stopLoss?: number; // Associated stop loss price
  takeProfit?: number; // Associated take profit price
  customData?: Record<string, any>; // Additional data
}
```

**Returns:** `string` - The order ID

**Example:**

```typescript
const orderId = chart.setOrder({
  type: "limit",
  side: "buy",
  price: 44000,
  quantity: 0.05,
  symbol: "BTCUSDT",
  status: "pending",
  text: "Buy Limit Order",
});
```

#### updateOrder()

Updates an existing order.

```typescript
chart.updateOrder(orderId: string, updates: Partial<TradingOrder>): void
```

**Example:**

```typescript
chart.updateOrder(orderId, {
  price: 44500,
  status: "filled",
  fillPrice: 44500,
  fillQuantity: 0.05,
});
```

#### removeOrder()

Removes an order from the chart.

```typescript
chart.removeOrder(orderId: string): void
```

#### getOrder()

Retrieves a specific order by ID.

```typescript
chart.getOrder(orderId: string): TradingOrder | undefined
```

#### getAllOrders()

Retrieves all orders.

```typescript
chart.getAllOrders(): TradingOrder[]
```

#### clearAllOrders()

Removes all orders from the chart.

```typescript
chart.clearAllOrders(): void
```

### Order Types

#### Entry Orders

Mark filled positions with PnL display.

```typescript
chart.setOrder({
  type: "entry",
  side: "buy",
  price: 45000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "filled",
});
```

#### Limit Orders

Pending buy/sell orders with dashed lines.

```typescript
chart.setOrder({
  type: "limit",
  side: "buy",
  price: 44000,
  quantity: 0.05,
  symbol: "BTCUSDT",
  status: "pending",
});
```

#### Stop Loss Orders

Risk management orders with risk calculation.

```typescript
chart.setOrder({
  type: "stop_loss",
  side: "sell",
  price: 43000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "pending",
  entryPrice: 45000, // For risk calculation
});
```

#### Take Profit Orders

Profit target orders with profit calculation.

```typescript
chart.setOrder({
  type: "take_profit",
  side: "sell",
  price: 48000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "pending",
  entryPrice: 45000, // For profit calculation
});
```

#### Market Orders

Immediate execution orders.

```typescript
chart.setOrder({
  type: "market",
  side: "buy",
  price: 45000, // Current market price
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "filled",
});
```

## Event System

### Order Event Callbacks

#### onOrderUpdate()

Listen for all order events.

```typescript
chart.onOrderUpdate((orderId: string, event: string, order: TradingOrder) => void): void
```

**Events:**

- `'created'` - Order was created
- `'updated'` - Order was updated
- `'cancelled'` - Order was cancelled
- `'filled'` - Order was filled
- `'dragged'` - Order was dragged to new price

**Example:**

```typescript
chart.onOrderUpdate((orderId, event, order) => {
  console.log(`Order ${orderId} was ${event}`, order);

  switch (event) {
    case "created":
      // Handle order creation
      break;
    case "filled":
      // Handle order fill
      break;
    case "cancelled":
      // Handle order cancellation
      break;
  }
});
```

#### onOrderCancel()

Listen for order cancellations (X button clicks).

```typescript
chart.onOrderCancel((orderId: string) => void): void
```

**Example:**

```typescript
chart.onOrderCancel(async (orderId) => {
  try {
    // Cancel order on your exchange
    await exchangeAPI.cancelOrder(orderId);

    // Remove from chart
    chart.removeOrder(orderId);

    console.log(`Order ${orderId} cancelled successfully`);
  } catch (error) {
    console.error("Failed to cancel order:", error);
  }
});
```

#### onOrderPriceChange()

Listen for price changes from dragging.

```typescript
chart.onOrderPriceChange((orderId: string, newPrice: number, oldPrice: number) => void): void
```

**Example:**

```typescript
chart.onOrderPriceChange(async (orderId, newPrice, oldPrice) => {
  try {
    // Update order on your exchange
    await exchangeAPI.modifyOrder(orderId, { price: newPrice });

    console.log(`Order ${orderId} price updated: ${oldPrice} → ${newPrice}`);
  } catch (error) {
    console.error("Failed to update order price:", error);

    // Revert price change
    const order = chart.getOrder(orderId);
    if (order) {
      chart.updateOrder(orderId, { price: oldPrice });
    }
  }
});
```

#### onOrderClick()

Listen for order clicks.

```typescript
chart.onOrderClick((orderId: string) => void): void
```

**Example:**

```typescript
chart.onOrderClick((orderId) => {
  const order = chart.getOrder(orderId);
  if (order) {
    // Show order details modal
    showOrderDetailsModal(order);
  }
});
```

## Theming & Styling

### Order Theme Management

#### setOrderTheme()

Customize order appearance.

```typescript
chart.setOrderTheme(theme: Partial<OrderTheme>): void
```

#### getOrderTheme()

Get current order theme.

```typescript
chart.getOrderTheme(): OrderTheme
```

### Theme Structure

```typescript
interface OrderTheme {
  buy: {
    entry: OrderStyle;
    limit: OrderStyle;
    stopLoss: OrderStyle;
    takeProfit: OrderStyle;
    market: OrderStyle;
  };
  sell: {
    entry: OrderStyle;
    limit: OrderStyle;
    stopLoss: OrderStyle;
    takeProfit: OrderStyle;
    market: OrderStyle;
  };
}

interface OrderStyle {
  lineColor: string; // Line color
  textColor: string; // Text color
  backgroundColor?: string; // Background color
  lineWidth?: number; // Line width
  lineStyle?: "solid" | "dashed" | "dotted"; // Line style
  fontSize?: number; // Font size
  showCancelButton?: boolean; // Show cancel button
  draggable?: boolean; // Allow dragging
}
```

### Custom Theme Example

```typescript
chart.setOrderTheme({
  buy: {
    entry: {
      lineColor: "#00ff88",
      textColor: "#00ff88",
      lineWidth: 2,
      backgroundColor: "rgba(0, 255, 136, 0.1)",
      showCancelButton: true,
      draggable: true,
    },
    limit: {
      lineColor: "#ffaa00",
      textColor: "#ffaa00",
      lineStyle: "dashed",
    },
  },
  sell: {
    entry: {
      lineColor: "#ff4444",
      textColor: "#ff4444",
      lineWidth: 2,
      backgroundColor: "rgba(255, 68, 68, 0.1)",
    },
  },
});
```

### Built-in Themes

```typescript
import { lightTheme, darkTheme } from "@klinecharts/pro";

// Apply light theme
chart.setOrderTheme(lightTheme);

// Apply dark theme
chart.setOrderTheme(darkTheme);
```

## Persistence

### Order Persistence

```typescript
import { OrderPersistence, PersistentOrderManager } from "@klinecharts/pro";

// Save orders manually
const orders = chart.getAllOrders();
OrderPersistence.saveOrders(orders, "BTCUSDT");

// Load orders
const savedOrders = OrderPersistence.loadOrders("BTCUSDT");
savedOrders.forEach((order) => chart.setOrder(order));

// Auto-save manager
const persistentManager = new PersistentOrderManager("BTCUSDT", true);

// Save orders automatically
persistentManager.autoSaveOrders(chart.getAllOrders());

// Load orders on startup
const orders = persistentManager.loadOrders();
orders.forEach((order) => chart.setOrder(order));
```

### Theme Persistence

```typescript
// Save theme
const currentTheme = chart.getOrderTheme();
OrderPersistence.saveTheme(currentTheme);

// Load theme
const savedTheme = OrderPersistence.loadTheme();
if (savedTheme) {
  chart.setOrderTheme(savedTheme);
}
```

### Export/Import

```typescript
// Export orders to JSON
const orders = chart.getAllOrders();
const jsonString = OrderPersistence.exportOrders(orders);

// Save to file or send to server
downloadFile("orders.json", jsonString);

// Import orders from JSON
const importedOrders = OrderPersistence.importOrders(jsonString);
importedOrders.forEach((order) => chart.setOrder(order));
```

## TypeScript Interfaces

### Core Interfaces

```typescript
// Order types
type OrderType = "market" | "limit" | "stop_loss" | "take_profit" | "entry";
type OrderSide = "buy" | "sell";
type OrderStatus = "pending" | "filled" | "cancelled" | "partially_filled";
type OrderEvent = "created" | "updated" | "cancelled" | "filled" | "dragged";

// Main order interface
interface TradingOrder {
  id: string;
  type: OrderType;
  side: OrderSide;
  price: number;
  quantity: number;
  symbol: string;
  status: OrderStatus;
  timestamp: number;
  text?: string;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  pnl?: number;
  unrealizedPnl?: number;
  fees?: number;
  fillPrice?: number;
  fillQuantity?: number;
  customData?: Record<string, any>;
}

// Order creation options
interface CreateOrderOptions {
  id?: string;
  type: OrderType;
  side: OrderSide;
  price: number;
  quantity: number;
  symbol: string;
  status?: OrderStatus;
  text?: string;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  customData?: Record<string, any>;
}

// PnL calculation result
interface PnLResult {
  unrealizedPnl: number;
  realizedPnl: number;
  percentage: number;
  fees: number;
  netPnl: number;
}

// Order callbacks
interface OrderCallback {
  onOrderEvent?: (
    orderId: string,
    event: OrderEvent,
    data: TradingOrder
  ) => void;
  onPriceChange?: (orderId: string, newPrice: number, oldPrice: number) => void;
  onCancel?: (orderId: string) => void;
  onOrderClick?: (orderId: string) => void;
}
```

### Extended Chart Interface

```typescript
interface ChartProWithOrders extends ChartPro {
  // Order management
  setOrder(order: CreateOrderOptions): string;
  updateOrder(orderId: string, updates: Partial<TradingOrder>): void;
  removeOrder(orderId: string): void;
  getOrder(orderId: string): TradingOrder | undefined;
  getAllOrders(): TradingOrder[];
  clearAllOrders(): void;

  // Event callbacks
  onOrderUpdate(
    callback: (orderId: string, event: string, order: TradingOrder) => void
  ): void;
  onOrderCancel(callback: (orderId: string) => void): void;
  onOrderPriceChange(
    callback: (orderId: string, newPrice: number, oldPrice: number) => void
  ): void;
  onOrderClick(callback: (orderId: string) => void): void;

  // Theme management
  setOrderTheme(theme: Partial<OrderTheme>): void;
  getOrderTheme(): OrderTheme;
}
```

## Examples

### Complete Trading Interface

```typescript
import { KLineChartPro, OrderPersistence } from "@klinecharts/pro";
import type { ChartProWithOrders, TradingOrder } from "@klinecharts/pro";

class TradingInterface {
  private chart: ChartProWithOrders;
  private symbol: string;

  constructor(container: string, symbol: string) {
    this.symbol = symbol;
    this.chart = new KLineChartPro({
      container,
      symbol: { ticker: symbol },
      period: { multiplier: 1, timespan: "hour", text: "1H" },
      datafeed: this.createDatafeed(),
      theme: "dark",
    }) as ChartProWithOrders;

    this.setupEventHandlers();
    this.loadSavedOrders();
  }

  private setupEventHandlers() {
    // Handle order cancellations
    this.chart.onOrderCancel(async (orderId) => {
      try {
        await this.cancelOrderOnExchange(orderId);
        this.chart.removeOrder(orderId);
        this.saveOrders();
      } catch (error) {
        console.error("Failed to cancel order:", error);
      }
    });

    // Handle price changes
    this.chart.onOrderPriceChange(async (orderId, newPrice, oldPrice) => {
      try {
        await this.updateOrderOnExchange(orderId, newPrice);
        this.saveOrders();
      } catch (error) {
        console.error("Failed to update order:", error);
        // Revert change
        this.chart.updateOrder(orderId, { price: oldPrice });
      }
    });

    // Handle order clicks
    this.chart.onOrderClick((orderId) => {
      const order = this.chart.getOrder(orderId);
      if (order) {
        this.showOrderDetails(order);
      }
    });

    // Handle all order events
    this.chart.onOrderUpdate((orderId, event, order) => {
      console.log(`Order ${orderId}: ${event}`, order);
      this.saveOrders();
    });
  }

  // Public methods
  public addOrder(orderData: CreateOrderOptions): string {
    const orderId = this.chart.setOrder(orderData);
    this.saveOrders();
    return orderId;
  }

  public updateOrder(orderId: string, updates: Partial<TradingOrder>): void {
    this.chart.updateOrder(orderId, updates);
    this.saveOrders();
  }

  public removeOrder(orderId: string): void {
    this.chart.removeOrder(orderId);
    this.saveOrders();
  }

  public getAllOrders(): TradingOrder[] {
    return this.chart.getAllOrders();
  }

  // Persistence
  private saveOrders(): void {
    const orders = this.chart.getAllOrders();
    OrderPersistence.saveOrders(orders, this.symbol);
  }

  private loadSavedOrders(): void {
    const orders = OrderPersistence.loadOrders(this.symbol);
    orders.forEach((order) => this.chart.setOrder(order));
  }

  // Exchange integration (implement these methods)
  private async cancelOrderOnExchange(orderId: string): Promise<void> {
    // Your exchange API call
  }

  private async updateOrderOnExchange(
    orderId: string,
    newPrice: number
  ): Promise<void> {
    // Your exchange API call
  }

  private showOrderDetails(order: TradingOrder): void {
    // Show order details modal
  }

  private createDatafeed() {
    // Your datafeed implementation
    return {
      searchSymbols: async () => [],
      getHistoryKLineData: async () => [],
      subscribe: () => {},
      unsubscribe: () => {},
    };
  }
}

// Usage
const trading = new TradingInterface("#chart", "BTCUSDT");

// Add orders
trading.addOrder({
  type: "entry",
  side: "buy",
  price: 45000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "filled",
});
```

### Real-time PnL Updates

```typescript
class PnLTracker {
  private chart: ChartProWithOrders;
  private currentPrice: number = 0;

  constructor(chart: ChartProWithOrders) {
    this.chart = chart;
    this.startPriceUpdates();
  }

  private startPriceUpdates() {
    // Update current price from your data source
    setInterval(() => {
      this.updateCurrentPrice();
    }, 1000);
  }

  private updateCurrentPrice() {
    // Get current price from your datafeed
    const newPrice = this.getCurrentPriceFromDatafeed();

    if (newPrice !== this.currentPrice) {
      this.currentPrice = newPrice;
      this.updateOrderPnL();
    }
  }

  private updateOrderPnL() {
    const orders = this.chart.getAllOrders();

    orders.forEach((order) => {
      if (order.status === "filled" && order.entryPrice) {
        const pnl = this.calculatePnL(order, this.currentPrice);

        // Update order with new PnL
        this.chart.updateOrder(order.id, {
          pnl: pnl.netPnl,
          unrealizedPnl: pnl.unrealizedPnl,
        });
      }
    });
  }

  private calculatePnL(order: TradingOrder, currentPrice: number) {
    const entryPrice = order.entryPrice || order.price;
    const quantity = order.quantity;

    let unrealizedPnl = 0;
    if (order.side === "buy") {
      unrealizedPnl = (currentPrice - entryPrice) * quantity;
    } else {
      unrealizedPnl = (entryPrice - currentPrice) * quantity;
    }

    return {
      unrealizedPnl,
      realizedPnl: 0,
      percentage: (unrealizedPnl / (entryPrice * quantity)) * 100,
      fees: order.fees || 0,
      netPnl: unrealizedPnl - (order.fees || 0),
    };
  }

  private getCurrentPriceFromDatafeed(): number {
    // Implement your price fetching logic
    return 45000; // Example price
  }
}
```

## Migration Guide

### From Standard KLineChart Pro

If you're upgrading from the standard KLineChart Pro, here's what you need to know:

#### 1. Type Casting

Cast your chart instance to `ChartProWithOrders` to access order management features:

```typescript
// Before
const chart = new KLineChartPro(options);

// After
const chart = new KLineChartPro(options) as ChartProWithOrders;
```

#### 2. New Dependencies

The order management system is automatically included. No additional imports needed.

#### 3. Backward Compatibility

All existing KLineChart Pro features remain unchanged. The order management system is additive.

### Best Practices

1. **Error Handling**: Always wrap order operations in try-catch blocks
2. **State Synchronization**: Keep chart orders synchronized with your exchange
3. **Performance**: Remove old/filled orders periodically to maintain performance
4. **User Feedback**: Provide visual feedback for order operations
5. **Persistence**: Use the persistence API to save user's order layouts
6. **Theme Consistency**: Match order colors with your application theme

### Common Patterns

#### Order Lifecycle Management

```typescript
// Create order
const orderId = chart.setOrder({...})

// Update order status
chart.updateOrder(orderId, { status: 'filled' })

// Remove order when no longer needed
chart.removeOrder(orderId)
```

#### Batch Operations

```typescript
// Add multiple orders
const orders = [
  {
    type: "entry",
    side: "buy",
    price: 45000,
    quantity: 0.1,
    symbol: "BTCUSDT",
    status: "filled",
  },
  {
    type: "stop_loss",
    side: "sell",
    price: 43000,
    quantity: 0.1,
    symbol: "BTCUSDT",
    status: "pending",
  },
  {
    type: "take_profit",
    side: "sell",
    price: 48000,
    quantity: 0.1,
    symbol: "BTCUSDT",
    status: "pending",
  },
];

orders.forEach((order) => chart.setOrder(order));
```

#### Conditional Order Display

```typescript
// Show only pending orders
const pendingOrders = chart
  .getAllOrders()
  .filter((order) => order.status === "pending");

// Show only profitable positions
const profitableOrders = chart
  .getAllOrders()
  .filter((order) => order.pnl && order.pnl > 0);
```

This completes the comprehensive API documentation for the enhanced KLineChart Pro with Order Management System.
