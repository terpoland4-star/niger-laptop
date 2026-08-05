#!/usr/bin/env bash
# deploy-backend.sh — Déploiement du backend Niger Laptops sur le VPS
# Ordre imposé : commit -> push -> build -> restart
# Usage : ./deploy-backend.sh "message de commit"

set -euo pipefail

REPO_DIR="/home/nigerlaptops/niger-laptop"
PM2_APP="niger-laptops-api"

cd "$REPO_DIR"

echo "== 1/5 — Vérification de l'état git =="
if [[ -z "$(git status --porcelain)" ]]; then
  echo "Aucun changement à committer. Poursuite avec le code déjà commité."
else
  if [[ $# -eq 0 ]]; then
    echo "ERREUR : des changements sont présents mais aucun message de commit n'a été fourni."
    echo "Usage : ./deploy-backend.sh \"message de commit\""
    exit 1
  fi
  echo "== 2/5 — Commit des changements =="
  git add -A
  git commit -m "$1"
fi

echo "== 2/5 — Push vers GitHub (AVANT le build) =="
git push origin main

echo "== 3/5 — Installation des dépendances =="
pnpm install --frozen-lockfile

echo "== 4/5 — Build du projet =="
pnpm build

echo "== 5/5 — Redémarrage du backend (PM2) =="
pm2 restart "$PM2_APP" --update-env

echo ""
echo "✅ Déploiement terminé."
echo "Commit déployé : $(git rev-parse --short HEAD)"
echo "Statut PM2 :"
pm2 describe "$PM2_APP" | grep -E "status|restart"
