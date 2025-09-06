# Development Setup Guide

This guide helps you set up the development environment for KLineChart Pro with Order Management.

## Prerequisites

- Node.js 18+ installed
- pnpm installed globally (`npm install -g pnpm`)
- Git installed

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/min3studios/klinecharts-pro.git
cd klinecharts-pro
```

### 2. Install Dependencies

```bash
# This will create pnpm-lock.yaml
pnpm install
```

### 3. Build the Package

```bash
pnpm run build
```

### 4. Verify Installation

```bash
# Check if build artifacts exist
ls -la dist/
```

## Development Workflow

### Running in Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm run build

# Run tests (if available)
pnpm test
```

### Publishing

#### Method 1: Automated (GitHub Actions)

1. Push changes to main branch
2. Go to GitHub Actions → "Publish to GitHub Packages"
3. Run workflow with desired version bump

#### Method 2: Manual

```bash
# Build first
pnpm run build

# Publish
pnpm publish
```

## Important Files

- `package.json` - Package configuration
- `pnpm-lock.yaml` - Dependency lockfile (generated after `pnpm install`)
- `.github/workflows/publish.yml` - GitHub Actions workflow
- `.npmrc` - Registry configuration for GitHub Packages

## Troubleshooting

### Missing pnpm-lock.yaml

If you encounter lockfile issues:

```bash
# Delete node_modules and reinstall
rm -rf node_modules
pnpm install
```

### GitHub Actions Failing

1. Ensure `pnpm-lock.yaml` is committed to repository
2. Check that GitHub token has proper permissions
3. Verify package name and registry configuration

### Build Issues

```bash
# Clean build
rm -rf dist/
pnpm run build
```

## First Time Setup Checklist

- [ ] Clone repository
- [ ] Run `pnpm install` to generate lockfile
- [ ] Commit `pnpm-lock.yaml` to repository
- [ ] Test build with `pnpm run build`
- [ ] Configure GitHub Packages authentication
- [ ] Test publishing workflow

## Team Onboarding

New team members should:

1. Follow the Initial Setup steps
2. Configure GitHub Packages authentication (see GITHUB_PACKAGES.md)
3. Test installation of the published package in a separate project

This ensures the development environment is properly configured and the package can be built and published successfully.
