<h1 align="center">KLineChart Pro</h1>
<p align="center">Financial chart with advanced order management built on KLineChart - TradingView/Bybit style order placement and management.</p>

<div align="center">

[![Version](https://badgen.net/npm/v/@klinecharts/pro)](https://www.npmjs.com/package/@klinecharts/pro)
[![Size](https://badgen.net/bundlephobia/minzip/@klinecharts/pro@latest)](https://bundlephobia.com/package/@klinecharts/pro@latest)
[![Typescript](https://badgen.net/npm/types/@klinecharts/pro)](dist/index.d.ts)
[![LICENSE](https://badgen.net/github/license/klinecharts/pro)](LICENSE)

</div>

## ✨ Features

### 📈 **Advanced Order Management**

- **Multiple Order Types**: Entry, Limit, Stop Loss, Take Profit, Market orders
- **Interactive Orders**: Drag-to-adjust prices, click-to-cancel functionality
- **Real-time PnL**: Automatic profit/loss calculations and display
- **Visual Order Display**: Orders appear as horizontal lines with customizable styling
- **Event System**: Complete callback system for order interactions

### 🎨 **Customizable Theming**

- **Built-in Themes**: Professional light and dark themes
- **Custom Styling**: Full control over order appearance
- **Dynamic Colors**: Order colors change based on type and status
- **Theme Persistence**: Save and restore custom themes

### 💾 **Persistence & Export**

- **Order Persistence**: Save/load orders to localStorage
- **Symbol-based Storage**: Separate order storage per trading symbol
- **Export/Import**: JSON export/import functionality
- **Auto-save**: Automatic order state management

### 🛠️ **Developer Experience**

- **TypeScript Support**: Complete type definitions
- **Comprehensive API**: Extensive programmatic control
- **Backward Compatible**: All existing functionality preserved
- **Easy Integration**: Simple migration from standard KLineChart Pro

## Install

### From GitHub Packages (Public)

#### Step 1: Configure Registry

```bash
# Configure npm/pnpm for GitHub Packages
npm config set @min3studios:registry https://npm.pkg.github.com
# or
pnpm config set @min3studios:registry https://npm.pkg.github.com
```

#### Step 2: Install Package

```bash
# Using pnpm (recommended)
pnpm add @min3studios/klinecharts-pro

# Using npm
npm install @min3studios/klinecharts-pro

# Using yarn
yarn add @min3studios/klinecharts-pro
```

> **Note**: This package is hosted on GitHub Packages as a public package. No authentication required! See [GITHUB_PACKAGES.md](GITHUB_PACKAGES.md) for detailed setup instructions.

## Quick Start

### Basic Usage

```typescript
import { KLineChartPro } from "@min3studios/klinecharts-pro";
import type { ChartProWithOrders } from "@min3studios/klinecharts-pro";

// Initialize chart with order management
const chart = new KLineChartPro({
  container: "#chart-container",
  symbol: { ticker: "BTCUSDT", name: "Bitcoin/USDT" },
  period: { multiplier: 1, timespan: "hour", text: "1H" },
  datafeed: yourDatafeed,
  theme: "dark",
}) as ChartProWithOrders;
```

### Order Management

```typescript
// Add an entry order
const orderId = chart.setOrder({
  type: "entry",
  side: "buy",
  price: 45000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "filled",
});

// Add stop loss
chart.setOrder({
  type: "stop_loss",
  side: "sell",
  price: 43000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "pending",
  entryPrice: 45000,
});

// Handle order events
chart.onOrderCancel((orderId) => {
  // Cancel order on your exchange
  cancelOrderOnExchange(orderId);
});

chart.onOrderPriceChange((orderId, newPrice, oldPrice) => {
  // Update order price on your exchange
  updateOrderOnExchange(orderId, newPrice);
});
```

### Custom Theming

```typescript
chart.setOrderTheme({
  buy: {
    entry: {
      lineColor: "#00ff88",
      textColor: "#00ff88",
      lineWidth: 2,
      backgroundColor: "rgba(0, 255, 136, 0.1)",
    },
  },
});
```

## Documentation

### 📚 **API Documentation**

- **[CUSTOMKLINEAPI.md](CUSTOMKLINEAPI.md)** - Complete API reference with examples
- **[Order Management Guide](src/orders/README.md)** - Detailed order system documentation
- **[Publishing Guide](PUBLISHING.md)** - Package publishing and deployment guide
- **[Changelog](CHANGELOG.md)** - Version history and updates

### 🌐 **Official Docs**

- [中文](https://pro.klinecharts.com)
- [English](https://pro.klinecharts.com/en-US)

## Order Types

| Type            | Description             | Visual            | Features                       |
| --------------- | ----------------------- | ----------------- | ------------------------------ |
| **Entry**       | Mark filled positions   | Solid line        | PnL display, position tracking |
| **Limit**       | Pending buy/sell orders | Dashed line       | Draggable, cancellable         |
| **Stop Loss**   | Risk management         | Red solid line    | Risk calculation, draggable    |
| **Take Profit** | Profit targets          | Green solid line  | Profit calculation, draggable  |
| **Market**      | Immediate execution     | Purple solid line | Instant fill display           |

## Migration from Standard Version

Upgrading is seamless with full backward compatibility:

```typescript
// Before (standard version)
const chart = new KLineChartPro(options);

// After (with order management)
const chart = new KLineChartPro(options) as ChartProWithOrders;
// All existing functionality works + new order features available
```

## Examples

### Complete Trading Interface

```typescript
import { KLineChartPro, OrderPersistence } from "@min3studios/klinecharts-pro";

class TradingInterface {
  private chart: ChartProWithOrders;

  constructor(container: string, symbol: string) {
    this.chart = new KLineChartPro({
      container,
      symbol: { ticker: symbol },
      datafeed: this.createDatafeed(),
    }) as ChartProWithOrders;

    this.setupOrderHandlers();
    this.loadSavedOrders();
  }

  private setupOrderHandlers() {
    this.chart.onOrderCancel(async (orderId) => {
      await this.cancelOrderOnExchange(orderId);
      this.chart.removeOrder(orderId);
    });

    this.chart.onOrderPriceChange(async (orderId, newPrice) => {
      await this.updateOrderOnExchange(orderId, newPrice);
    });
  }

  // ... implementation details
}
```

## Contributing

We welcome contributions! Please see our contributing guidelines for details.

## ©️ License

KLineChart Pro is available under the Apache License V2.

---

<div align="center">
  <strong>Built with ❤️ for traders and developers</strong>
</div>
