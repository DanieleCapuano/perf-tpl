# pnpm Migration Guide

This project has been migrated from npm to pnpm for improved performance and disk efficiency.

## What Changed

### Package Manager
- **Before:** npm
- **After:** pnpm

### New Files Added
- `pnpm-workspace.yaml` - Workspace configuration
- `.npmrc` - pnpm configuration settings

### Updated Files
- All `package.json` files now use `pnpm` in scripts
- `.gitignore` - Added pnpm-specific ignore patterns
- All documentation (`README.md`, `SETUP.md`, `QUICKSTART.md`, etc.)

## Benefits of pnpm

### 1. Speed ⚡
- **2-3x faster** installations compared to npm
- Parallel downloads and installations
- Efficient caching mechanism

### 2. Disk Space 💾
- Saves **gigabytes** of disk space
- Uses content-addressable storage (hard links)
- Single copy of each package version globally

### 3. Strict Dependencies 🔒
- Non-flat `node_modules` structure
- Prevents phantom dependencies
- Better at catching dependency issues early

### 4. Monorepo Support 🌲
- Built-in workspace management
- Efficient handling of multiple packages
- Great for our client/server setup

### 5. Security 🔐
- More secure than npm
- Better at preventing malicious package attacks
- Strict peer dependency resolution

## Installation

### First Time Setup

1. **Install pnpm** (choose one method):

   ```bash
   # Via npm (easiest)
   npm install -g pnpm
   
   # Via standalone script (recommended)
   # Windows (PowerShell)
   iwr https://get.pnpm.io/install.ps1 -useb | iex
   
   # macOS/Linux
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   
   # Via Homebrew (macOS)
   brew install pnpm
   
   # Via Corepack (Node.js 16.13+)
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

2. **Verify installation**:
   ```bash
   pnpm --version
   ```

3. **Install project dependencies**:
   ```bash
   pnpm run install:all
   ```

### Migrating Existing Installation

If you already have the project with npm:

```bash
# 1. Remove npm artifacts
rm -rf node_modules
rm -rf client/node_modules  
rm -rf server/node_modules
rm package-lock.json
rm client/package-lock.json
rm server/package-lock.json

# 2. Install pnpm (if not already installed)
npm install -g pnpm

# 3. Install dependencies with pnpm
pnpm run install:all
```

## Command Comparison

| npm | pnpm | Description |
|-----|------|-------------|
| `npm install` | `pnpm install` | Install dependencies |
| `npm install <pkg>` | `pnpm add <pkg>` | Add a package |
| `npm uninstall <pkg>` | `pnpm remove <pkg>` | Remove a package |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` | Add dev dependency |
| `npm run <script>` | `pnpm run <script>` or `pnpm <script>` | Run script |
| `npm update` | `pnpm update` | Update packages |
| `npm list` | `pnpm list` | List packages |
| `npx <cmd>` | `pnpm dlx <cmd>` | Execute package |

## Workspace Structure

The project uses pnpm workspaces defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'client'
  - 'server'
```

This allows:
- Shared dependencies between packages
- Efficient disk usage
- Easy cross-package development
- Single `pnpm install` for all packages

## Configuration

### .npmrc

The `.npmrc` file contains pnpm-specific configuration:

```ini
# Auto-install peer dependencies
auto-install-peers=true
strict-peer-dependencies=false

# Hoisting settings
shamefully-hoist=false
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

**Key settings:**
- `auto-install-peers=true` - Automatically installs peer dependencies
- `shamefully-hoist=false` - Maintains strict dependency isolation
- `public-hoist-pattern` - Hoists specific packages (like ESLint) for tooling

## Troubleshooting

### "Cannot find module" errors

If you get module resolution errors:

```bash
# Option 1: Clear pnpm cache
pnpm store prune

# Option 2: Enable shamefully-hoist (in .npmrc)
shamefully-hoist=true

# Then reinstall
pnpm install
```

### Peer dependency warnings

pnpm is stricter about peer dependencies:

```bash
# Auto-install is enabled in .npmrc, but you can also:
pnpm add <peer-dependency>@<version>
```

### Store corruption

If you encounter store-related errors:

```bash
# Prune unused packages
pnpm store prune

# Or completely reset (last resort)
rm -rf ~/.pnpm-store  # Linux/macOS
rmdir /s %LOCALAPPDATA%\pnpm\store  # Windows

pnpm run install:all
```

### Different lockfile format

Note: `pnpm-lock.yaml` is different from `package-lock.json`:
- It's in YAML format
- More readable
- More merge-friendly in Git
- Should be committed to version control

## Performance Comparison

### Installation Times (approximate)

| Package Manager | Cold Cache | Warm Cache |
|----------------|------------|------------|
| npm | 50s | 20s |
| yarn | 35s | 15s |
| **pnpm** | **25s** | **8s** |

### Disk Usage (approximate)

With 10 projects using similar dependencies:

| Package Manager | Disk Usage |
|----------------|------------|
| npm | 2.5 GB |
| yarn | 2.0 GB |
| **pnpm** | **500 MB** |

*Actual numbers vary by project size and dependencies*

## CI/CD Updates

If using CI/CD, update your workflows:

### GitHub Actions

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8

- name: Install dependencies
  run: pnpm run install:all

- name: Build
  run: pnpm run build
```

### GitLab CI

```yaml
before_script:
  - npm install -g pnpm
  - pnpm run install:all

build:
  script:
    - pnpm run build
```

## Best Practices

1. **Commit lockfile**: Always commit `pnpm-lock.yaml`
2. **Use exact versions**: Pin important dependencies
3. **Regular updates**: Run `pnpm update` periodically
4. **Clean installs**: Use `pnpm install --frozen-lockfile` in CI
5. **Workspace commands**: Use `-r` flag to run in all workspaces:
   ```bash
   pnpm -r build  # Build all packages
   pnpm -r test   # Test all packages
   ```

## Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [pnpm CLI](https://pnpm.io/cli/add)
- [Workspaces](https://pnpm.io/workspaces)
- [Benchmarks](https://pnpm.io/benchmarks)
- [Why pnpm?](https://pnpm.io/feature-comparison)

## FAQ

### Can I still use npm?

Yes, but not recommended. The project is optimized for pnpm's workspace structure.

### What about yarn?

pnpm is generally faster and more disk-efficient than yarn, plus has better workspace support.

### Is pnpm stable?

Yes! pnpm is production-ready and used by major companies like Microsoft, TikTok, and more.

### Do I need to update my IDE?

Most modern IDEs (VS Code, WebStorm, etc.) support pnpm out of the box. You might need to:
- Restart your IDE after installing pnpm
- Update ESLint/TypeScript settings to use pnpm node_modules structure

### What about package scripts?

All `npm run` commands work the same with pnpm. You can even omit `run`:
```bash
pnpm dev    # Same as: pnpm run dev
pnpm build  # Same as: pnpm run build
```

---

**Migration completed successfully! 🎉**

For any issues, check the troubleshooting section or refer to the [official pnpm documentation](https://pnpm.io/).
