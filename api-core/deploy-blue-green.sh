#!/usr/bin/env bash
# ============================================================================
# deploy-blue-green.sh
# ============================================================================
# Automated blue-green deployment with crash detection and automatic failback.
#
# Strategy:
#   blue  = current live release directory (e.g. /site/releases/blue)
#   green = newly staged release directory  (e.g. /site/releases/green)
#
# This generic script:
#   1. Deploys the new build into the GREEN slot (param 1).
#   2. Points the ACTIVE symlink at GREEN, then waits the warm-up window (param 2).
#   3. Probes the GREEN /health endpoint until it passes or times out (param 3).
#   4. On success: GREEN becomes the new ACTIVE. On failure: rolls back the
#      symlink to BLUE automatically (crash failback) and reports.
#
# Usage:
#   ./deploy-blue-green.sh /path/to/new-build  health_url  warmup_seconds  timeout_seconds
#   ./deploy-blue-green.sh ./build-site/bundle https://yourdomain.com/api/health?health=1 5 60
#
# This script is a template — adapt the $RELEASES and $ACTIVE_SYMLINK paths to
# your server, or wire the same logic into a CI provider (GitHub Actions, etc.).
# ============================================================================

set -euo pipefail

NEW_BUILD="${1:?Usage: $0 <new-build-dir> <health-url> [warmup] [timeout]}"
HEALTH_URL="${2:?Usage: $0 <new-build-dir> <health-url> [warmup] [timeout]}"
WARMUP="${3:-5}"          # seconds to wait after switching before probing
TIMEOUT="${4:-60}"        # total seconds to wait for healthy green

# --- Adapt these paths to your environment --------------------------------
RELEASES="/var/www/site/releases"        # contains ./blue and ./green
ACTIVE_SYMLINK="/var/www/site/current"   # symlink Apache points at
HEALTH_PASS_THRESHOLD=2                  # consecutive healthy probes required
# --------------------------------------------------------------------------

BLUE="$RELEASES/blue"
GREEN="$RELEASES/green"
LOG="${LOG:-deploy.log}"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG"; }

fail() { log "FAILURE: $*"; exit 1; }

# --- 1. Deploy new build into GREEN slot --------------------------------
log "Deploying new build to GREEN slot"
rm -rf "$GREEN"
mkdir -p "$(dirname "$GREEN")"
cp -a "$NEW_BUILD" "$GREEN"
echo "$(git rev-parse --short HEAD 2>/dev/null || date +%s)" > "$GREEN/api-core/RELEASE" 2>/dev/null || true

# --- 2. Switch ACTIVE to GREEN -------------------------------------------
log "Switching ACTIVE to GREEN (warmup ${WARMUP}s)"
ln -sfn "$GREEN" "$ACTIVE_SYMLINK"
sleep "$WARMUP"

# --- 3. Probe GREEN health -------------------------------------------------
log "Probing $HEALTH_URL (up to ${TIMEOUT}s)"
healthy=0
deadline=$(( $(date +%s) + TIMEOUT ))
ok=0
while [ "$(date +%s)" -lt "$deadline" ]; do
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$HEALTH_URL" || echo "000")
    if [ "$code" = "200" ]; then
        healthy=$((healthy + 1))
        if [ "$healthy" -ge "$HEALTH_PASS_THRESHOLD" ]; then ok=1; break; fi
    else
        healthy=0
    fi
    sleep 1
done

# Track state for the PHP failback latch
state() {
  mkdir -p "$GREEN/api-core/deploy"
  echo "{\"active\":\"$1\",\"staged\":\"$2\",\"status\":\"$3\",\"updated_at\":\"$(date -Iseconds)\"}" \
    > "$GREEN/api-core/deploy/state.json"
}

if [ "$ok" = "1" ]; then
    log "GREEN is healthy — promoting as ACTIVE"
    state "green" "blue" "ok"
    echo "DEPLOY_OK"
else
    log "GREEN FAILED health checks — automatic failback to BLUE"
    ln -sfn "$BLUE" "$ACTIVE_SYMLINK"
    state "blue" "green" "failback"
    echo "DEPLOY_FAILED_FAILEDBACK"
    exit 1
fi
