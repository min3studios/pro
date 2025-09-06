# Publishing Guide for KLineChart Pro with Order Management

This guide explains how to prepare and publish the enhanced KLineChart Pro package with order management features.

## Prerequisites

- Node.js 18+ installed
- pnpm installed globally (`npm install -g pnpm`)
- Access to npm registry or private registry
- Git repository access

## Package Preparation

### 1. Update package.json

The package.json needs to be updated to reflect the new order management features:

```json
{
  "name": "@klinecharts/pro",
  "version": "0.2.0",
  "description": "Financial chart with advanced order management built on KLineChart.",
  "type": "module",
  "main": "./dist/klinecharts-pro.umd.js",
  "module": "./dist/klinecharts-pro.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/klinecharts-pro.js",
      "require": "./dist/klinecharts-pro.umd.js",
      "types": "./dist/index.d.ts"
    },
    "./orders": {
      "import": "./dist/orders/index.js",
      "types": "./dist/orders/index.d.ts"
    }
  },
  "files": ["LICENSE", "README.md", "CUSTOMKLINEAPI.md", "dist/"],
  "keywords": [
    "klinecharts",
    "pro",
    "candlestick",
    "finance",
    "stock",
    "chart",
    "canvas",
    "trading",
    "orders",
    "order-management",
    "tradingview",
    "bybit"
  ],
  "scripts": {
    "build-core": "tsc && vite build",
    "build-dts": "dts-bundle-generator --no-banner true --umd-module-name klinechartspro -o dist/index.d.ts src/index.ts",
    "build": "pnpm run build-core && pnpm run build-dts",
    "prepublishOnly": "pnpm run build",
    "publish:patch": "pnpm version patch && pnpm publish",
    "publish:minor": "pnpm version minor && pnpm publish",
    "publish:major": "pnpm version major && pnpm publish"
  }
}
```

### 2. Build Configuration

Ensure your `vite.config.ts` includes the order management files:

```typescript
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "KLineChartsPro",
      fileName: (format) =>
        `klinecharts-pro.${format === "es" ? "js" : "umd.js"}`,
    },
    rollupOptions: {
      external: ["klinecharts", "solid-js", "lodash"],
      output: {
        globals: {
          klinecharts: "klinecharts",
          "solid-js": "SolidJS",
          lodash: "lodash",
        },
      },
    },
  },
});
```

### 3. TypeScript Configuration

Update `tsconfig.json` to include order management files:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "docs"]
}
```

## Building the Package

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build the Package

```bash
pnpm run build
```

This will:

- Compile TypeScript files
- Bundle the library with Vite
- Generate type definitions
- Create distribution files in `dist/`

### 3. Verify Build Output

Check that the following files are created:

- `dist/klinecharts-pro.js` (ES module)
- `dist/klinecharts-pro.umd.js` (UMD module)
- `dist/index.d.ts` (Type definitions)
- `dist/orders/` (Order management types and utilities)

## Publishing Process

### 1. Version Management

Update the version based on the type of changes:

```bash
# Patch version (bug fixes)
pnpm version patch

# Minor version (new features, backward compatible)
pnpm version minor

# Major version (breaking changes)
pnpm version major
```

### 2. Pre-publish Checks

Before publishing, ensure:

- All tests pass
- Build completes successfully
- Documentation is up to date
- CHANGELOG.md is updated
- Git repository is clean

### 3. Publish to npm

```bash
# Publish to public npm registry
pnpm publish

# Publish to private registry
pnpm publish --registry https://your-private-registry.com

# Publish with specific tag
pnpm publish --tag beta
```

### 4. Automated Publishing

For automated publishing, add these scripts to package.json:

```json
{
  "scripts": {
    "release:patch": "pnpm version patch && pnpm publish && git push --follow-tags",
    "release:minor": "pnpm version minor && pnpm publish && git push --follow-tags",
    "release:major": "pnpm version major && pnpm publish && git push --follow-tags"
  }
}
```

## Installation in Other Projects

Once published, users can install the package:

### Using pnpm

```bash
pnpm add @klinecharts/pro
```

### Using npm

```bash
npm install @klinecharts/pro
```

### Using yarn

```bash
yarn add @klinecharts/pro
```

## Usage in Other Projects

### Basic Import

```typescript
import { KLineChartPro } from "@klinecharts/pro";
import type { ChartProWithOrders } from "@klinecharts/pro";
```

### Order Management Import

```typescript
import {
  KLineChartPro,
  OrderManager,
  OrderPersistence,
  lightTheme,
  darkTheme,
} from "@klinecharts/pro";
```

### Type-only Imports

```typescript
import type {
  TradingOrder,
  CreateOrderOptions,
  OrderTheme,
  OrderCallback,
} from "@klinecharts/pro";
```

## Migration for Existing Users

### From Previous Version

If users are upgrading from a previous version without order management:

1. **No Breaking Changes**: All existing functionality remains the same
2. **Type Casting**: Cast to `ChartProWithOrders` to access new features
3. **Optional Features**: Order management is opt-in

### Example Migration

```typescript
// Before (v0.1.x)
const chart = new KLineChartPro(options)

// After (v0.2.x) - existing functionality unchanged
const chart = new KLineChartPro(options)

// After (v0.2.x) - with order management
const chart = new KLineChartPro(options) as ChartProWithOrders
chart.setOrder({...}) // Now available
```

## Troubleshooting

### Build Issues

1. **TypeScript Errors**: Ensure all types are properly exported
2. **Missing Dependencies**: Check peerDependencies are installed
3. **Bundle Size**: Use tree-shaking to reduce bundle size

### Publishing Issues

1. **Authentication**: Ensure you're logged in to npm (`npm login`)
2. **Permissions**: Check you have publish permissions for the package
3. **Version Conflicts**: Ensure version number hasn't been used

### Runtime Issues

1. **Peer Dependencies**: Ensure klinecharts is installed in consuming projects
2. **Module Resolution**: Check import paths are correct
3. **TypeScript**: Ensure consuming projects have compatible TypeScript version

## Best Practices

1. **Semantic Versioning**: Follow semver for version numbers
2. **Changelog**: Maintain a detailed changelog
3. **Documentation**: Keep API documentation up to date
4. **Testing**: Test the package in real projects before publishing
5. **Backward Compatibility**: Avoid breaking changes in minor/patch versions

## Registry Configuration

### For Private Registry

Create `.npmrc` file:

```
registry=https://your-private-registry.com
//your-private-registry.com/:_authToken=${NPM_TOKEN}
```

### For Scoped Packages

```
@yourscope:registry=https://your-private-registry.com
//your-private-registry.com/:_authToken=${NPM_TOKEN}
```

This completes the publishing guide for the enhanced KLineChart Pro package.
