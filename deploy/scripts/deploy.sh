#!/usr/bin/env bash
# Manual deploy on VPS — same steps as GitHub Actions deploy job.
set -euo pipefail

cd /opt/amelie-milano

if [[ -n "${GIT_DEPLOY_TOKEN:-}" ]]; then
  git pull "https://x-access-token:${GIT_DEPLOY_TOKEN}@github.com/techsistlimited-PROD/amelie-milano.git" main
else
  git pull origin main
fi

docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
docker image prune -f
curl -fsS http://127.0.0.1:3010/health
echo "Deploy OK"
