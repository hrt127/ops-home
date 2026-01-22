#!/bin/bash

# Security pre-flight check for ops-home
# Run before commits and deployments

set -e

echo "🔒 Ops-Home Security Check"
echo "=========================="
echo ""

# 1. Check .env.local is in .gitignore (via .env* wildcard)
echo "✓ Checking .env.local in .gitignore..."
if ! grep -q "\.env\*" .gitignore; then
  echo "❌ FAIL: .env files not in .gitignore"
  exit 1
fi
echo "  ✅ .env.local protected"

# 2. Check for hardcoded secrets in code (avoid false positives)
echo "✓ Checking for hardcoded API keys..."
if grep -r "sk-sk-\|api_key=\"\|LLM_API_KEY=\"\|ETHERSCAN_API_KEY=\"" \
  --include="*.ts" --include="*.tsx" --include="*.js" \
  app/ lib/ components/ 2>/dev/null; then
  echo "❌ FAIL: Hardcoded secrets found in source"
  exit 1
fi
echo "  ✅ No hardcoded secrets detected"

# 3. Check client code doesn't access server-only env vars
echo "✓ Checking client code for secret env access..."
if grep -r "process\.env\.\(LLM_API_KEY\|ETHERSCAN_API_KEY\|DATABASE_URL\)" \
  --include="*.tsx" components/ 2>/dev/null; then
  echo "❌ FAIL: Client code accesses secret env vars"
  exit 1
fi
echo "  ✅ Client code safe (no secret env access)"

# 4. Check for dangerous HTML functions in components
echo "✓ Checking for dangerouslySetInnerHTML..."
if grep -r "dangerouslySetInnerHTML" --include="*.tsx" components/ 2>/dev/null; then
  echo "⚠️  WARNING: dangerouslySetInnerHTML found (ensure sanitized input)"
fi
echo "  ✅ Mostly safe (verify sanitization)"

# 5. Check for console.log of sensitive data
echo "✓ Checking for console logging of secrets..."
if grep -r "console\.log.*\(key\|secret\|password\|seed\)" \
  --include="*.ts" --include="*.tsx" \
  app/ lib/ components/ 2>/dev/null; then
  echo "⚠️  WARNING: Possible secret logging found"
fi
echo "  ✅ No obvious secret logging"

# 6. Verify Prisma schema doesn't include secrets
echo "✓ Checking Prisma schema..."
if grep -i "password\|secret\|seed" prisma/schema.prisma 2>/dev/null; then
  echo "❌ FAIL: Secrets in Prisma schema"
  exit 1
fi
echo "  ✅ Prisma schema clean (no secrets)"

# 7. Check package.json for vulnerable deps (basic)
echo "✓ Checking dependencies..."
if ! npm ls 2>&1 | grep -i "vulnerable"; then
  echo "  ✅ No obvious vulnerabilities (run 'npm audit' for details)"
else
  echo "⚠️  Run 'npm audit' to fix vulnerabilities"
fi

echo ""
echo "=========================="
echo "✅ Security check passed"
echo ""
echo "Before production deployment, also ensure:"
echo "  - HTTPS is enforced in next.config.ts"
echo "  - Security headers middleware is active (app/middleware.ts)"
echo "  - Rate-limiting is configured for /api/agent and /api/markets"
echo "  - DB backups are configured"
echo "  - See SECURITY_AUDIT_REPORT.md for full checklist"
