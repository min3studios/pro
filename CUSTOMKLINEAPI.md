# Enhanced KLineChart Pro API Documentation

This document provides comprehensive documentation for the enhanced KLineChart Pro with **built-in Order Management System** and professional trading features.

## 🚀 Key Features

✅ **Built-in Order Management** - No casting or setup required
✅ **Professional Visual Styling** - Dotted lines, centered labels, color coding
✅ **Interactive Orders** - Draggable TP/SL with confirmation callbacks
✅ **Position Markers** - B/S circles above candles for historical positions
✅ **Complete Event System** - Real-time callbacks for all order interactions
✅ **TypeScript Support** - Full type definitions included
✅ **Zero Configuration** - Works out of the box with professional defaults
✅ **Backward Compatible** - All existing features preserved

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

## Enhanced Visual Features

The enhanced KLineChart Pro includes a completely redesigned order management system with professional styling that matches modern trading platforms:

### 🎨 **Visual Improvements**

- **Dotted Lines**: All orders display as dotted/dashed horizontal lines for clear distinction
- **Centered Labels**: Order information is perfectly centered on the chart for optimal readability
- **Color-Coded Orders**: Each order type has distinct colors for instant recognition
  - Take Profit: Blue (#2196F3)
  - Stop Loss: Pink/Red (#E91E63)
  - PnL Display: Gray (#616161)
  - Limit Orders: Orange (#FF9800)
- **Close Buttons**: X button on each order for easy one-click removal
- **Position Markers**: Green "B" and Red "S" circles above candles for historical positions

### 🖱️ **Interactive Features**

- **Draggable TP/SL**: Drag take profit and stop loss orders to adjust prices in real-time
- **Click Events**: Click orders to trigger custom actions (details, modification, etc.)
- **Drag Confirmation**: Show confirmation dialogs after dragging orders for safety
- **Real-time Updates**: Orders update instantly with price changes and market movements
- **Hover Effects**: Visual feedback when hovering over interactive elements
- **Right-Click Protection**: Programmatic orders cannot be removed by right-clicking (unlike drawing tools)

### 📊 **Order Label Formats**

The order labels follow a consistent format for professional appearance:

- **Take Profit**: `TP Price > 48000 | 0.1` (Blue background, white text)
- **Stop Loss**: `SL Price < 43000 | 0.1` (Pink background, white text)
- **PnL Display**: `PNL +$50.00 | 0.1` (Gray background, white text)
- **Limit Orders**: `LIMIT BUY 44000 | 0.05` (Orange background, white text)
- **Entry Orders**: `ENTRY BUY 45000 | 0.1` (Green/Red based on side)

## Quick Start

```typescript
import { KLineChartPro } from "@min3studios/klinecharts-pro";
import type { ChartPro } from "@min3studios/klinecharts-pro";

// Initialize chart with built-in order management
const chart = new KLineChartPro({
  container: "#chart-container",
  symbol: { ticker: "BTCUSDT", name: "Bitcoin/USDT" },
  period: { multiplier: 1, timespan: "hour", text: "1H" },
  datafeed: yourDatafeed,
  theme: "dark",
});

// All order management methods are immediately available!
// No casting or additional setup required

// Add a take profit order (blue, draggable)
const tpOrderId = chart.setOrder({
  type: "take_profit",
  side: "sell",
  price: 48000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "pending",
});
// Result: Blue dotted line with "TP Price > 48000 | 0.1" label

// Add a position marker (green B above candle)
const markerId = chart.createPositionMarker({
  timestamp: Date.now() - 3600000, // 1 hour ago
  price: 45000,
  side: "buy",
  quantity: 0.1,
  symbol: "BTCUSDT",
});
// Result: Green circle with "B" above the specified candle

// Handle drag confirmations for TP/SL orders
chart.onOrderDragEnd((orderId, finalPrice) => {
  console.log(`Order ${orderId} dragged to ${finalPrice}`);
  // Show your confirmation UI here (tick/close buttons)
  showConfirmationDialog(orderId, finalPrice);
});

// Handle order cancellations (X button clicks)
chart.onOrderCancel((orderId) => {
  console.log(`Order ${orderId} cancelled by user`);
  // Process cancellation on your exchange
  cancelOrderOnExchange(orderId);
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

// Direct chart access and control
chart.getChart(): Chart | null
chart.scrollToRealTime(animationDuration?: number): void
chart.scrollToDataIndex(dataIndex: number, animationDuration?: number): void
chart.scrollToTimestamp(timestamp: number, animationDuration?: number): void
chart.resize(): void
```

### Chart Control Methods

#### getChart()

Get direct access to the underlying KLineCharts Chart instance for advanced operations.

```typescript
chart.getChart(): Chart | null
```

**Returns:** The underlying Chart instance or null if not initialized.

#### scrollToRealTime()

Scroll the chart to show the most recent data. This often triggers auto-fit behavior.

```typescript
chart.scrollToRealTime(animationDuration?: number): void
```

**Parameters:**

- `animationDuration` (optional): Animation duration in milliseconds

**Example:**

```typescript
// Scroll to latest data (useful when switching assets)
chart.scrollToRealTime();

// With animation
chart.scrollToRealTime(300);
```

#### scrollToDataIndex()

Scroll to a specific data point by index.

```typescript
chart.scrollToDataIndex(dataIndex: number, animationDuration?: number): void
```

#### scrollToTimestamp()

Scroll to a specific timestamp.

```typescript
chart.scrollToTimestamp(timestamp: number, animationDuration?: number): void
```

#### resize()

Manually trigger chart resize. Useful after container size changes.

```typescript
chart.resize(): void
```

**Example:**

```typescript
// After container resize
chart.resize();
```

## Order Management API

### Order CRUD Operations

#### setOrder()

Creates a new order and displays it on the chart with enhanced styling.

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

**Visual Features:**

- **Dotted Lines**: All orders display as dotted/dashed horizontal lines for clear distinction
- **Centered Labels**: Order information is perfectly centered on the chart
- **Color Coding**: Consistent color scheme for instant order type recognition
- **Close Button**: X button on the right side of each label for one-click removal
- **Draggable**: TP/SL orders can be dragged to adjust prices with confirmation
- **Professional Styling**: Clean, modern appearance matching trading platforms

**Example:**

```typescript
const orderId = chart.setOrder({
  type: "limit",
  side: "buy",
  price: 44000,
  quantity: 0.05,
  symbol: "BTCUSDT",
  status: "pending",
});
// Result: Orange dotted line with "LIMIT BUY 44000 | 0.05" centered label
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

### Position Markers

#### createPositionMarker()

Creates B/S markers above candles to show historical positions.

```typescript
chart.createPositionMarker(options: PositionMarkerOptions): string
```

**Parameters:**

```typescript
interface PositionMarkerOptions {
  timestamp: number; // Candle timestamp
  price: number; // Entry price
  side: "buy" | "sell"; // Position side
  quantity: number; // Position size
  symbol: string; // Trading symbol
  id?: string; // Optional custom ID
}
```

**Returns:** `string` - The marker ID

**Visual Features:**

- **Buy Markers**: Green circle with white "B" text above the candle
- **Sell Markers**: Red circle with white "S" text above the candle
- **Positioned by Time**: Uses timestamp to position above specific candles accurately
- **Professional Styling**: Clean circles with white borders for visibility
- **Click Events**: Markers can be clicked to trigger custom actions

**Example:**

```typescript
// Add buy position marker at specific time
const buyMarkerId = chart.createPositionMarker({
  timestamp: 1640995200000, // Unix timestamp for specific candle
  price: 45000, // Entry price (for reference)
  side: "buy", // Position side
  quantity: 0.1, // Position size
  symbol: "BTCUSDT", // Trading pair
});
// Result: Green circle with "B" above the candle at specified time

// Add sell position marker
const sellMarkerId = chart.createPositionMarker({
  timestamp: 1640998800000, // Different timestamp
  price: 46000,
  side: "sell",
  quantity: 0.1,
  symbol: "BTCUSDT",
});
// Result: Red circle with "S" above the candle at specified time

// Markers help visualize entry/exit points on historical data
```

### Order Types & Visual Display

#### Entry Orders

Mark filled positions with PnL display. Shows current profit/loss in the format "PNL [amount] | [quantity]".

```typescript
chart.setOrder({
  type: "entry",
  side: "buy",
  price: 45000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "filled",
  entryPrice: 45000, // Required for PnL calculation
});
// Displays: "PNL +$50.00 | 0.1" (gray background, dotted line)
// Format: "PNL [+/-$amount] | [quantity]"
```

**PnL Display Format:**

- Positive PnL: `PNL +$50.00 | 0.1` (green text)
- Negative PnL: `PNL -$25.50 | 0.1` (red text)
- Zero PnL: `PNL $0.00 | 0.1` (gray text)
- No PnL data: `BUY 45000 | 0.1` (fallback format)

#### Limit Orders

Pending buy/sell orders with orange styling.

```typescript
chart.setOrder({
  type: "limit",
  side: "buy",
  price: 44000,
  quantity: 0.05,
  symbol: "BTCUSDT",
  status: "pending",
});
// Displays: "LIMIT BUY 44000 | 0.05" (orange background, dotted line)
```

#### Stop Loss Orders

Risk management orders with pink/red styling. **Draggable**.

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
// Displays: "SL Price < 43000 | 0.1" (pink background, dotted line)
```

#### Take Profit Orders

Profit target orders with blue styling. **Draggable**.

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
// Displays: "TP Price > 48000 | 0.1" (blue background, dotted line)
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

#### onOrderDragEnd()

Listen for drag end events on TP/SL orders. Use this to show confirmation UI.

```typescript
chart.onOrderDragEnd((orderId: string, finalPrice: number) => void): void
```

**Example:**

```typescript
chart.onOrderDragEnd((orderId, finalPrice) => {
  // Show confirmation dialog with tick/close buttons
  showConfirmationDialog({
    message: `Update order ${orderId} to price ${finalPrice}?`,
    onConfirm: async () => {
      try {
        await updateOrderOnExchange(orderId, finalPrice);
        console.log(`Order ${orderId} updated to ${finalPrice}`);
      } catch (error) {
        // Revert the change
        const order = chart.getOrder(orderId);
        if (order) {
          chart.updateOrder(orderId, { price: order.price });
        }
      }
    },
    onCancel: () => {
      // Revert the drag
      const order = chart.getOrder(orderId);
      if (order) {
        chart.updateOrder(orderId, { price: order.price });
      }
    },
  });
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
  lineColor: string; // Line color (always dotted)
  textColor: string; // Text color (always white)
  backgroundColor: string; // Label background color
  borderColor: string; // Label border color
  closeButtonColor: string; // Close button color
  lineWidth?: number; // Line width (default: 1)
  fontSize?: number; // Font size (default: 11)
  showCancelButton?: boolean; // Show X button (default: true)
  draggable?: boolean; // Allow dragging (TP/SL only)
}
```

### Default Color Scheme

The enhanced order system uses a consistent color scheme:

- **Take Profit**: Blue (#2196F3) - "TP Price > X | quantity"
- **Stop Loss**: Pink/Red (#E91E63) - "SL Price < X | quantity"
- **Entry/PnL**: Gray (#616161) - "PNL ±$X | quantity"
- **Limit Orders**: Orange (#FF9800) - "LIMIT SIDE price | quantity"
- **Buy Positions**: Green (#4CAF50) - Green "B" markers
- **Sell Positions**: Red (#F44336) - Red "S" markers

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
  onDragEnd?: (orderId: string, finalPrice: number) => void;
}

// Position marker options
interface PositionMarkerOptions {
  timestamp: number; // Candle timestamp
  price: number; // Entry price
  side: "buy" | "sell"; // Position side
  quantity: number; // Position size
  symbol: string; // Trading symbol
  id?: string; // Optional custom ID
}
```

### Chart Interface (Built-in Order Management)

```typescript
interface ChartPro {
  // Core chart methods
  setTheme(theme: string): void;
  getTheme(): string;
  setStyles(styles: DeepPartial<Styles>): void;
  getStyles(): Styles;
  setLocale(locale: string): void;
  getLocale(): string;
  setTimezone(timezone: string): void;
  getTimezone(): string;
  setSymbol(symbol: SymbolInfo): void;
  getSymbol(): SymbolInfo;
  setPeriod(period: Period): void;
  getPeriod(): Period;

  // Order management (built-in)
  setOrder(order: CreateOrderOptions): string;
  updateOrder(orderId: string, updates: Partial<TradingOrder>): void;
  removeOrder(orderId: string): void;
  getOrder(orderId: string): TradingOrder | undefined;
  getAllOrders(): TradingOrder[];
  clearAllOrders(): void;

  // Position markers
  createPositionMarker(options: PositionMarkerOptions): string;

  // Event callbacks
  onOrderUpdate(
    callback: (orderId: string, event: string, order: TradingOrder) => void
  ): void;
  onOrderCancel(callback: (orderId: string) => void): void;
  onOrderPriceChange(
    callback: (orderId: string, newPrice: number, oldPrice: number) => void
  ): void;
  onOrderClick(callback: (orderId: string) => void): void;
  onOrderDragEnd(callback: (orderId: string, finalPrice: number) => void): void;

  // Theme management
  setOrderTheme(theme: Partial<OrderTheme>): void;
  getOrderTheme(): OrderTheme;

  // Chart access and control methods
  getChart(): Chart | null;
  scrollToRealTime(animationDuration?: number): void;
  scrollToDataIndex(dataIndex: number, animationDuration?: number): void;
  scrollToTimestamp(timestamp: number, animationDuration?: number): void;
  resize(): void;
}
```

## Examples

### Complete Trading Interface

```typescript
import { KLineChartPro, OrderPersistence } from "@klinecharts/pro";
import type { ChartPro, TradingOrder } from "@klinecharts/pro";

class TradingInterface {
  private chart: ChartPro;
  private symbol: string;

  constructor(container: string, symbol: string) {
    this.symbol = symbol;
    this.chart = new KLineChartPro({
      container,
      symbol: { ticker: symbol },
      period: { multiplier: 1, timespan: "hour", text: "1H" },
      datafeed: this.createDatafeed(),
      theme: "dark",
    });

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
  private chart: ChartPro;
  private currentPrice: number = 0;

  constructor(chart: ChartPro) {
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

#### 1. Simplified API

Order management features are now built-in to `KLineChartPro` by default - no casting required:

```typescript
// Simple and clean - all features available immediately
const chart = new KLineChartPro({
  container: "#chart",
  symbol: { ticker: "BTCUSDT" },
  period: { multiplier: 1, timespan: "hour" },
  datafeed: yourDatafeed,
});

// All order management methods work immediately
chart.setOrder({...});           // ✅ Available
chart.onOrderCancel(() => {});   // ✅ Available
chart.createPositionMarker({...}); // ✅ Available
```

#### 2. Zero Configuration

The order management system is automatically included with professional styling:

- ✅ **No additional setup** - works out of the box
- ✅ **No extra imports** - everything included in main package
- ✅ **No configuration** - professional defaults applied
- ✅ **No casting** - all methods available on main class

#### 3. Full Backward Compatibility

All existing KLineChart Pro features remain unchanged:

- ✅ **Existing code works** - no breaking changes
- ✅ **Same API** - all original methods preserved
- ✅ **Enhanced features** - order management is purely additive
- ✅ **Performance** - no impact on charts without orders

### Best Practices

1. **Error Handling**: Always wrap order operations in try-catch blocks for robust applications
2. **State Synchronization**: Keep chart orders synchronized with your exchange/backend
3. **Performance**: Remove old/filled orders periodically to maintain optimal performance
4. **User Feedback**: Provide visual feedback for order operations (loading states, confirmations)
5. **Drag Confirmations**: Always show confirmation UI after users drag TP/SL orders
6. **Event Handling**: Use the comprehensive event system for real-time updates
7. **Position Markers**: Use position markers to show historical entry/exit points
8. **Order Removal**: Use programmatic removal (`chart.removeOrder()`) instead of relying on user right-clicks
9. **Asset Switching**: Always clear orders and call `scrollToRealTime()` when switching assets for proper chart fitting
10. **Theme Consistency**: Leverage the built-in professional color scheme or customize as needed

### Common Patterns

#### Order Lifecycle Management

```typescript
// Create order with immediate visual feedback
const orderId = chart.setOrder({
  type: "take_profit",
  side: "sell",
  price: 48000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "pending",
});
// Result: Blue dotted line with "TP Price > 48000 | 0.1" label

// Update order status when filled
chart.updateOrder(orderId, {
  status: "filled",
  fillPrice: 48050,
  fillTime: Date.now(),
});

// Remove order when no longer needed
chart.removeOrder(orderId);
```

#### Asset Switching with Auto-Fit

```typescript
// Proper way to switch assets
async function switchAsset(newSymbol: SymbolInfo) {
  // 1. Clear existing orders to prevent scale issues
  chart.clearAllOrders();

  // 2. Update symbol
  chart.setSymbol(newSymbol);

  // 3. Load new data (your datafeed logic)
  await loadNewAssetData(newSymbol);

  // 4. Scroll to latest data to trigger auto-fit
  chart.scrollToRealTime();

  // 5. Optionally resize if container changed
  chart.resize();
}
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
