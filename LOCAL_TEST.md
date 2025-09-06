# Local Package Testing Guide

This guide shows how to test the klinecharts-pro package locally using `pnpm link` before publishing.

## 🧪 Local Testing Process

### Step 1: Build and Link the Package

In the `pro/` directory:

```bash
# Clean any previous builds
rm -rf dist/

# Build the package
pnpm run build

# Verify build output
pnpm run verify-build

# Link the package globally
pnpm link --global
```

### Step 2: Create a Test Project

Create a new test project to verify the package works:

```bash
# Create test directory (outside of pro/)
mkdir ../test-klinecharts-pro
cd ../test-klinecharts-pro

# Initialize test project
npm init -y

# Install required dependencies
pnpm add klinecharts
pnpm add solid-js

# Link your local package
pnpm link --global @min3studios/klinecharts-pro
```

### Step 3: Create Test Files

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KLineChart Pro Test</title>
    <style>
      #chart-container {
        width: 100%;
        height: 600px;
        border: 1px solid #ccc;
      }
    </style>
  </head>
  <body>
    <h1>KLineChart Pro with Order Management Test</h1>
    <div id="chart-container"></div>
    <div id="controls">
      <button onclick="addEntryOrder()">Add Entry Order</button>
      <button onclick="addLimitOrder()">Add Limit Order</button>
      <button onclick="addStopLoss()">Add Stop Loss</button>
      <button onclick="addTakeProfit()">Add Take Profit</button>
      <button onclick="clearOrders()">Clear All Orders</button>
    </div>
    <script type="module" src="test.js"></script>
  </body>
</html>
```

Create `test.js`:

```javascript
import { KLineChartPro } from "@min3studios/klinecharts-pro";

// Mock datafeed for testing
const mockDatafeed = {
  searchSymbols: async () => [{ ticker: "BTCUSDT", name: "Bitcoin/USDT" }],
  getHistoryKLineData: async () => {
    // Generate mock OHLCV data
    const data = [];
    const basePrice = 45000;
    let currentTime = Date.now() - 100 * 60 * 60 * 1000; // 100 hours ago

    for (let i = 0; i < 100; i++) {
      const open = basePrice + (Math.random() - 0.5) * 2000;
      const close = open + (Math.random() - 0.5) * 1000;
      const high = Math.max(open, close) + Math.random() * 500;
      const low = Math.min(open, close) - Math.random() * 500;
      const volume = Math.random() * 1000;

      data.push({
        timestamp: currentTime,
        open,
        high,
        low,
        close,
        volume,
      });

      currentTime += 60 * 60 * 1000; // 1 hour
    }

    return data;
  },
  subscribe: () => {},
  unsubscribe: () => {},
};

// Initialize chart
const chart = new KLineChartPro({
  container: "#chart-container",
  symbol: { ticker: "BTCUSDT", name: "Bitcoin/USDT" },
  period: { multiplier: 1, timespan: "hour", text: "1H" },
  datafeed: mockDatafeed,
  theme: "dark",
});

// Cast to ChartProWithOrders to access order management
const chartWithOrders = chart;

// Set up order event handlers
chartWithOrders.onOrderCancel((orderId) => {
  console.log("Order cancelled:", orderId);
  alert(`Order ${orderId} cancelled!`);
});

chartWithOrders.onOrderPriceChange((orderId, newPrice, oldPrice) => {
  console.log(`Order ${orderId} price changed: ${oldPrice} → ${newPrice}`);
  alert(`Order ${orderId} price updated to ${newPrice}`);
});

chartWithOrders.onOrderClick((orderId) => {
  const order = chartWithOrders.getOrder(orderId);
  console.log("Order clicked:", order);
  alert(`Order clicked: ${order?.type} ${order?.side} @ ${order?.price}`);
});

// Global functions for buttons
window.addEntryOrder = () => {
  const orderId = chartWithOrders.setOrder({
    type: "entry",
    side: "buy",
    price: 45000,
    quantity: 0.1,
    symbol: "BTCUSDT",
    status: "filled",
    text: "Entry Long Position",
  });
  console.log("Added entry order:", orderId);
};

window.addLimitOrder = () => {
  const orderId = chartWithOrders.setOrder({
    type: "limit",
    side: "buy",
    price: 44000,
    quantity: 0.05,
    symbol: "BTCUSDT",
    status: "pending",
    text: "Buy Limit Order",
  });
  console.log("Added limit order:", orderId);
};

window.addStopLoss = () => {
  const orderId = chartWithOrders.setOrder({
    type: "stop_loss",
    side: "sell",
    price: 43000,
    quantity: 0.1,
    symbol: "BTCUSDT",
    status: "pending",
    entryPrice: 45000,
    text: "Stop Loss Protection",
  });
  console.log("Added stop loss:", orderId);
};

window.addTakeProfit = () => {
  const orderId = chartWithOrders.setOrder({
    type: "take_profit",
    side: "sell",
    price: 48000,
    quantity: 0.1,
    symbol: "BTCUSDT",
    status: "pending",
    entryPrice: 45000,
    text: "Take Profit Target",
  });
  console.log("Added take profit:", orderId);
};

window.clearOrders = () => {
  chartWithOrders.clearAllOrders();
  console.log("All orders cleared");
};

console.log("KLineChart Pro with Order Management loaded successfully!");
console.log("Available methods:", Object.keys(chartWithOrders));
```

### Step 4: Test the Package

```bash
# In the test project directory
# Serve the files (you can use any local server)
npx serve .
# or
python -m http.server 8000
# or
php -S localhost:8000
```

Open `http://localhost:8000` in your browser and test:

1. ✅ **Chart loads** - Verify the chart renders properly
2. ✅ **Order creation** - Click buttons to add different order types
3. ✅ **Order interaction** - Try dragging orders and clicking cancel buttons
4. ✅ **Console output** - Check browser console for any errors
5. ✅ **TypeScript support** - Verify imports work without errors

### Step 5: Verify Order Management Features

Test each feature:

- **Entry Orders**: Should show with PnL display
- **Limit Orders**: Should show as dashed lines, draggable
- **Stop Loss**: Should show in red with risk calculation
- **Take Profit**: Should show in green with profit target
- **Drag to adjust**: Orders should be draggable to new prices
- **Cancel button**: X button should remove orders
- **Event callbacks**: Console should show event logs

## 🔍 Troubleshooting Local Test

### If Import Fails

```bash
# Check if package is linked
pnpm list --global @min3studios/klinecharts-pro

# Re-link if needed
cd ../pro
pnpm link --global
cd ../test-klinecharts-pro
pnpm link --global @min3studios/klinecharts-pro
```

### If Build Fails

```bash
cd ../pro
rm -rf dist/
pnpm run build
pnpm run verify-build
```

### If Orders Don't Appear

Check browser console for:

- Import errors
- Overlay registration issues
- Chart initialization problems

## ✅ Success Criteria

The local test is successful if:

- ✅ Package imports without errors
- ✅ Chart renders properly
- ✅ Orders can be added via buttons
- ✅ Orders appear as horizontal lines on chart
- ✅ Orders can be dragged to adjust prices
- ✅ Cancel buttons work
- ✅ Event callbacks fire properly
- ✅ No console errors

Once local testing passes, the package is ready for publishing!
