# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-01-XX

### Added

#### 🎯 Order Management System

- **Complete Order Management**: Full CRUD operations for trading orders
- **Multiple Order Types**: Entry, Limit, Stop Loss, Take Profit, Market orders
- **Interactive Orders**: Drag-to-adjust prices, click-to-cancel functionality
- **Real-time PnL**: Automatic profit/loss calculations and display
- **Visual Order Display**: Orders appear as horizontal lines with customizable styling

#### 🎨 Theming & Styling

- **Customizable Themes**: Full styling control for different order types and sides
- **Built-in Themes**: Light and dark themes with professional color schemes
- **Dynamic Styling**: Order appearance changes based on status and type
- **Theme Persistence**: Save and restore custom themes

#### 🔄 Event System

- **Order Event Callbacks**: Complete event system for order interactions
- **Price Change Events**: React to order price modifications via dragging
- **Cancel Events**: Handle order cancellations from UI interactions
- **Click Events**: Respond to order clicks for custom actions
- **Lifecycle Events**: Track order creation, updates, fills, and cancellations

#### 💾 Persistence

- **Order Persistence**: Save/load orders to localStorage
- **Theme Persistence**: Save/restore custom themes
- **Symbol-based Storage**: Separate order storage per trading symbol
- **Export/Import**: JSON export/import functionality for orders

#### 📊 Advanced Features

- **Risk Management**: Stop loss orders show risk amounts
- **Profit Targets**: Take profit orders show profit calculations
- **PnL Tracking**: Real-time profit/loss display for filled positions
- **Order Validation**: Comprehensive order data validation
- **Batch Operations**: Support for multiple order operations

#### 🛠️ Developer Experience

- **TypeScript Support**: Complete type definitions for all order features
- **Comprehensive API**: Extensive API for programmatic order management
- **Documentation**: Detailed API documentation and usage examples
- **Migration Guide**: Easy migration from previous versions

### Enhanced

#### 📈 Chart Component

- **Extended API**: `ChartProWithOrders` interface with order management methods
- **Backward Compatibility**: All existing functionality preserved
- **Performance**: Optimized overlay rendering for multiple orders
- **Integration**: Seamless integration with existing chart features

#### 🏗️ Architecture

- **Modular Design**: Order system as separate, optional module
- **Clean Separation**: Order management doesn't interfere with core chart functionality
- **Extensible**: Easy to add new order types and features
- **Type Safety**: Full TypeScript coverage for all new features

### Technical Details

#### New Files Added

- `src/orders/types.ts` - Complete TypeScript interfaces
- `src/orders/themes.ts` - Light/dark themes and styling utilities
- `src/orders/utils.ts` - PnL calculations and utility functions
- `src/orders/overlays/order-overlay.ts` - Main order overlay template
- `src/orders/manager.ts` - Order management system
- `src/orders/persistence.ts` - Order persistence utilities
- `src/orders/example.ts` - Usage examples and integration patterns
- `src/orders/README.md` - Order system documentation
- `CUSTOMKLINEAPI.md` - Comprehensive API documentation
- `PUBLISHING.md` - Package publishing guide

#### API Extensions

- Extended `ChartPro` interface with order management methods
- New `ChartProWithOrders` interface for enhanced functionality
- Order overlay registration in main chart initialization
- Event system integration with existing chart events

#### Package Updates

- Updated package.json with new keywords and exports
- Added publishing scripts for automated releases
- Enhanced build configuration for order management files
- Updated TypeScript configuration for new modules

### Usage Examples

#### Basic Order Creation

```typescript
const chart = new KLineChartPro(options) as ChartProWithOrders;

// Add an entry order
const orderId = chart.setOrder({
  type: "entry",
  side: "buy",
  price: 45000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "filled",
});
```

#### Event Handling

```typescript
// Handle order cancellations
chart.onOrderCancel((orderId) => {
  cancelOrderOnExchange(orderId);
});

// Handle price changes
chart.onOrderPriceChange((orderId, newPrice, oldPrice) => {
  updateOrderOnExchange(orderId, newPrice);
});
```

#### Custom Theming

```typescript
chart.setOrderTheme({
  buy: {
    entry: {
      lineColor: "#00ff88",
      textColor: "#00ff88",
      lineWidth: 2,
    },
  },
});
```

### Breaking Changes

- None. This release is fully backward compatible.

### Migration

- Existing code continues to work without changes
- Cast chart instance to `ChartProWithOrders` to access new features
- No additional dependencies required

---

## [0.1.1] - Previous Release

### Fixed

- Various bug fixes and improvements
- Performance optimizations
- Documentation updates

---

## [0.1.0] - Initial Release

### Added

- Initial KLineChart Pro implementation
- Basic chart functionality
- Drawing tools
- Indicators support
- Theme system
- Localization support
