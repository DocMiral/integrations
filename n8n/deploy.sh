#!/bin/bash
set -e

N8N_NODES_DIR="/opt/n8n/data/nodes/node_modules/n8n-nodes-docmiral"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Building..."
cd "$SCRIPT_DIR"
npm run build

echo "Deploying to n8n..."
rm -rf "$N8N_NODES_DIR"
mkdir -p "$N8N_NODES_DIR"
cp -r dist package.json "$N8N_NODES_DIR/"

echo "Done. Restart n8n to apply: cd /opt/n8n && docker-compose restart"
