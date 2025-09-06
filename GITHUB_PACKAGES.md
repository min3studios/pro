# GitHub Packages Publishing Guide

This guide explains how to publish and use the KLineChart Pro package via GitHub Packages.

## 📦 Package Information

- **Package Name**: `@min3studios/klinecharts-pro`
- **Registry**: GitHub Packages (`https://npm.pkg.github.com`)
- **Repository**: `https://github.com/min3studios/klinecharts-pro`
- **Visibility**: Public (no authentication required)

## 🚀 Publishing the Package

### Prerequisites

1. **GitHub Repository**: Ensure the code is pushed to `https://github.com/min3studios/klinecharts-pro`
2. **GitHub Token**: Personal Access Token with `packages:write` permission
3. **Repository Permissions**: Write access to the repository

### Automated Publishing (Recommended)

#### Method 1: Manual Workflow Trigger

1. Go to your GitHub repository
2. Navigate to **Actions** tab
3. Select **Publish to GitHub Packages** workflow
4. Click **Run workflow**
5. Choose version type (patch/minor/major)
6. Click **Run workflow**

#### Method 2: Tag-based Publishing

```bash
# Create and push a version tag
git tag v0.2.0
git push origin v0.2.0

# This will automatically trigger the publishing workflow
```

### Manual Publishing

If you prefer to publish manually:

```bash
# 1. Build the package
pnpm run build

# 2. Login to GitHub Packages
npm login --scope=@min3studios --registry=https://npm.pkg.github.com

# 3. Publish
pnpm publish
```

## 📥 Installing the Package

### Step 1: Configure npm/pnpm for GitHub Packages

#### Option A: Global Configuration

```bash
# Configure npm globally
npm config set @min3studios:registry https://npm.pkg.github.com

# Or configure pnpm globally
pnpm config set @min3studios:registry https://npm.pkg.github.com
```

#### Option B: Project-level Configuration

Create `.npmrc` in your project root:

```
@min3studios:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### Step 2: Authentication

#### For Development (Local Machine)

1. **Create GitHub Personal Access Token**:

   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `read:packages` permission
   - Copy the token

2. **Login to GitHub Packages**:

```bash
npm login --scope=@min3studios --registry=https://npm.pkg.github.com
# Username: your-github-username
# Password: your-personal-access-token
# Email: your-email@example.com
```

#### For CI/CD (GitHub Actions)

Use the built-in `GITHUB_TOKEN`:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "18"
    registry-url: "https://npm.pkg.github.com"
    scope: "@min3studios"

- name: Install dependencies
  run: pnpm install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Step 3: Install the Package

```bash
# Using pnpm (recommended)
pnpm add @min3studios/klinecharts-pro

# Using npm
npm install @min3studios/klinecharts-pro

# Using yarn
yarn add @min3studios/klinecharts-pro
```

## 🔧 Usage in Your Project

### Basic Import

```typescript
import { KLineChartPro } from "@min3studios/klinecharts-pro";
import type { ChartProWithOrders } from "@min3studios/klinecharts-pro";
```

### Order Management Import

```typescript
import {
  KLineChartPro,
  OrderManager,
  OrderPersistence,
  lightTheme,
  darkTheme,
} from "@min3studios/klinecharts-pro";
```

### Complete Example

```typescript
import { KLineChartPro } from "@min3studios/klinecharts-pro";
import type {
  ChartProWithOrders,
  CreateOrderOptions,
} from "@min3studios/klinecharts-pro";

// Initialize chart
const chart = new KLineChartPro({
  container: "#chart-container",
  symbol: { ticker: "BTCUSDT", name: "Bitcoin/USDT" },
  period: { multiplier: 1, timespan: "hour", text: "1H" },
  datafeed: yourDatafeed,
  theme: "dark",
}) as ChartProWithOrders;

// Add orders
const orderId = chart.setOrder({
  type: "entry",
  side: "buy",
  price: 45000,
  quantity: 0.1,
  symbol: "BTCUSDT",
  status: "filled",
});

// Handle events
chart.onOrderCancel((orderId) => {
  console.log("Order cancelled:", orderId);
});
```

## 🔐 Security & Access Control

### Repository Access

Since this is a private package, users need:

1. **Repository Access**: Read access to the GitHub repository
2. **GitHub Token**: Personal access token with `read:packages` permission
3. **Organization Membership**: If published under an organization

### Token Permissions

Required permissions for GitHub Personal Access Token:

- `read:packages` - To download packages
- `write:packages` - To publish packages (for maintainers only)
- `repo` - If the repository is private

## 🛠️ Development Workflow

### For Package Maintainers

1. **Make Changes**: Develop new features or fix bugs
2. **Update Documentation**: Update CHANGELOG.md and version docs
3. **Create PR**: Submit pull request for review
4. **Merge & Tag**: After approval, merge and create version tag
5. **Auto-publish**: GitHub Actions will automatically publish

### Version Management

```bash
# Patch version (bug fixes)
git tag v0.2.1
git push origin v0.2.1

# Minor version (new features)
git tag v0.3.0
git push origin v0.3.0

# Major version (breaking changes)
git tag v1.0.0
git push origin v1.0.0
```

## 📋 Package.json Configuration

Your consuming project's `package.json` should include:

```json
{
  "dependencies": {
    "@min3studios/klinecharts-pro": "^0.2.0",
    "klinecharts": ">=9.0.0"
  }
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Authentication Failed

```
npm ERR! 401 Unauthorized
```

**Solution**: Check your GitHub token and ensure it has `read:packages` permission.

#### 2. Package Not Found

```
npm ERR! 404 Not Found
```

**Solution**:

- Verify the package name: `@min3studios/klinecharts-pro`
- Ensure you have access to the repository
- Check registry configuration

#### 3. Registry Configuration

```
npm ERR! Registry returned 404
```

**Solution**: Configure the registry for the scope:

```bash
npm config set @min3studios:registry https://npm.pkg.github.com
```

#### 4. Token Environment Variable

If using environment variables, ensure `GITHUB_TOKEN` or `NODE_AUTH_TOKEN` is set:

```bash
export GITHUB_TOKEN=your_token_here
# or
export NODE_AUTH_TOKEN=your_token_here
```

### Debugging Commands

```bash
# Check npm configuration
npm config list

# Check pnpm configuration
pnpm config list

# Verify authentication
npm whoami --registry=https://npm.pkg.github.com

# Test package installation
npm view @min3studios/klinecharts-pro --registry=https://npm.pkg.github.com
```

## 📊 Package Statistics

You can view package statistics in your GitHub repository:

1. Go to your repository on GitHub
2. Click on **Packages** (right sidebar)
3. Select your package to view download stats and versions

## 🔄 Migration from Public npm

If migrating from a public npm package:

1. **Update package.json**:

```json
{
  "dependencies": {
    "@min3studios/klinecharts-pro": "^0.2.0"
  }
}
```

2. **Update imports** (if package name changed):

```typescript
// Before
import { KLineChartPro } from "@klinecharts/pro";

// After
import { KLineChartPro } from "@min3studios/klinecharts-pro";
```

3. **Configure registry** as described above

## 📞 Support

For issues related to:

- **Package functionality**: Create an issue in the GitHub repository
- **Installation/authentication**: Check this guide or create a discussion
- **Feature requests**: Submit an issue with the enhancement label

---

**Note**: This package is privately hosted on GitHub Packages and requires authentication to access. Ensure all team members have the necessary permissions and tokens configured.
