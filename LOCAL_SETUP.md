# Local Setup Guide

**Complete WSL Development Environment Setup for Ops-Home**

---

## Prerequisites

- Windows 10/11 with WSL2 installed
- Basic familiarity with terminal/bash
- GitHub account (for cloning)

---

## Part 1: WSL2 Setup

### Install WSL2 (if not already installed)

```powershell
# In PowerShell (as Administrator)
wsl --install
wsl --set-default-version 2
```

Restart your computer if prompted.

### Install Ubuntu

```powershell
wsl --install -d Ubuntu-22.04
```

Set up your Ubuntu user and password when prompted.

### Verify WSL2

```bash
wsl --list --verbose
# Should show Ubuntu-22.04 with VERSION 2
```

---

## Part 2: Essential Tools

### Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Install Build Essentials

```bash
sudo apt install -y build-essential curl git wget
```

### Install Node.js via nvm

**Critical**: Ops-Home requires Node v20+. Use nvm, not system Node.

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node v20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
npm --version
```

### Install Python 3.12

```bash
sudo apt install -y python3.12 python3-pip python3.12-venv

# Verify
python3 --version  # Should show 3.12.x
```

### Install SQLite3

```bash
sudo apt install -y sqlite3 libsqlite3-dev

# Verify
sqlite3 --version
```

---

## Part 3: Dojo Filesystem Setup

### Create Dojo Structure

```bash
cd ~
mkdir -p dojo/system
mkdir -p dojo/projects
mkdir -p dojo/knowledge/{inbox,notes,notebooks,prompts,threads}
mkdir -p dojo/agents
mkdir -p dojo/scratch
mkdir -p dojo/archive
mkdir -p .config/dojo/sync
```

### Create Basic System Files

```bash
cd ~/dojo/system

# Create minimal SYSTEM.md
cat > SYSTEM.md << 'EOF'
# Dojo System (v2.1)

This is the root system file.

## Rules
- No silos
- Context-first development
- Everything under ~/dojo
- Local-first
EOF

# Create IDENTITY.md stub
echo "# Dojo Identity" > IDENTITY.md
```

---

## Part 4: Install Ops-Home

### Clone the Repository

```bash
cd ~/dojo/projects
git clone https://github.com/hrt127/ops-home.git
cd ops-home
```

### Install Dependencies

```bash
# Ensure Node v20 is active
nvm use 20

# Install packages
npm install
```

### Set Up Environment

```bash
# Copy example env (create it if it doesn't exist)
cp .env.example .env

# Or create .env manually
cat > .env << 'EOF'
DATABASE_URL="file:./data/ops-home.db"

# API Keys (optional but recommended)
ETHERSCAN_API_KEY="your-etherscan-key"
COINGECKO_API_KEY=""
NEYNAR_API_KEY=""
TWITTER_BEARER_TOKEN=""

# Dojo Paths
DOJO_ROOT="/home/$USER/dojo"
DOJO_KNOWLEDGE="/home/$USER/dojo/knowledge"
DOJO_SYSTEM="/home/$USER/dojo/system"
EOF
```

### Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Optional: Seed data
if [ -f scripts/load_registries.ts ]; then
  npx tsx scripts/load_registries.ts
fi
```

### Verify Installation

```bash
# Check database
sqlite3 data/ops-home.db ".tables"
# Should show: Event, Idea, Note, User, Wallet, etc.

# Check directory structure
ls -la
# Should see: src/, prisma/, data/, package.json, etc.
```

---

## Part 5: Run Development Server

### Start the App

```bash
cd ~/dojo/projects/ops-home
nvm use 20
npm run dev
```

You should see:

```
  ▲ Next.js 16.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.3s
```

### Access Dashboard

Open your browser to:

```
http://localhost:3000/dashboard
```

---

## Part 6: IDE Setup

### VS Code with WSL

```bash
cd ~/dojo/projects/ops-home
code .
```

This opens VS Code in WSL mode (recommended).

**Install VS Code Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma

### Alternative: Cursor or Windsurf

```bash
cd ~/dojo/projects/ops-home
cursor .  # or windsurf .
```

---

## Part 7: Optional Integrations

### Install Dojo CLI (if available)

```bash
cd ~
git clone <dojo-cli-repo-url> dojo2-clean
# Follow dojo-cli setup instructions
```

### Smart-Money Dashboard Integration

```bash
cd ~/dojo/projects
git clone https://github.com/hrt127/smart-money-dashboard.git
cd smart-money-dashboard
# Follow its setup instructions
```

Update ops-home `.env`:

```bash
SMART_MONEY_ROOT="/home/$USER/dojo/projects/smart-money-dashboard"
```

---

## Troubleshooting

### Issue: "Command not found: node"

```bash
# Ensure nvm is loaded
source ~/.bashrc
nvm use 20
```

### Issue: "prisma: command not found"

```bash
# Install globally or use npx
npx prisma generate
```

### Issue: "Port 3000 already in use"

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Issue: "Cannot find module '@prisma/client'"

```bash
npx prisma generate
npm install
```

### Issue: Database errors

```bash
# Reset database
rm -f data/ops-home.db
npx prisma migrate dev --name init
```

### Issue: "EACCES" permission errors

```bash
# Fix npm permissions (don't use sudo with npm)
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ~/dojo/projects/ops-home
```

---

## Verification Checklist

Before proceeding, verify:

- [ ] WSL2 running Ubuntu 22.04
- [ ] Node v20+ via nvm (`node --version`)
- [ ] Python 3.12 (`python3 --version`)
- [ ] SQLite3 installed (`sqlite3 --version`)
- [ ] Dojo structure exists at `~/dojo`
- [ ] Ops-home cloned to `~/dojo/projects/ops-home`
- [ ] Dependencies installed (`npm install` succeeded)
- [ ] Database initialized (`data/ops-home.db` exists)
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Dashboard loads at `localhost:3000/dashboard`

---

## Daily Development Workflow

```bash
# 1. Open terminal in WSL
wsl

# 2. Navigate to ops-home
cd ~/dojo/projects/ops-home

# 3. Ensure correct Node version
nvm use 20

# 4. Pull latest changes (if working with repo)
git pull

# 5. Install any new dependencies
npm install

# 6. Start dev server
npm run dev

# 7. Open in IDE
code .
```

---

## Next Steps

Once setup is complete:

1. Read [DOJO_INTEGRATION.md](./DOJO_INTEGRATION.md) to understand the filesystem integration
2. Read [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) for project goals
3. Explore the [Dashboard](http://localhost:3000/dashboard)
4. Check [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) for all docs

---

## Getting Help

- **Documentation**: See [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- **Issues**: Open an issue on GitHub
- **Dojo Integration**: See [DOJO_INTEGRATION.md](./DOJO_INTEGRATION.md)

---

**Welcome to Ops-Home! 🚀**
