#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.ga4-mcp.env"
MCP_BIN="$ROOT_DIR/.ga4-mcp-venv/bin/analytics-mcp"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

if [[ ! -x "$MCP_BIN" ]]; then
  echo "GA4 MCP binary not found: $MCP_BIN" >&2
  echo "Run: python3 -m venv .ga4-mcp-venv && ./.ga4-mcp-venv/bin/pip install analytics-mcp" >&2
  exit 1
fi

: "${GOOGLE_APPLICATION_CREDENTIALS:?GOOGLE_APPLICATION_CREDENTIALS is required in .ga4-mcp.env}"
: "${GOOGLE_PROJECT_ID:?GOOGLE_PROJECT_ID is required in .ga4-mcp.env}"

exec "$MCP_BIN"
