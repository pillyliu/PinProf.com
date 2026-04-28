#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ADMIN_WORKSPACE="${PINPROF_ADMIN_WORKSPACE_ROOT:-${ROOT_DIR}/../PinProf Admin/workspace}"
PRELOAD_PINBALL_DIR="${1:-${PINBALL_MIRROR_SOURCE_DIR:-$ADMIN_WORKSPACE/app-preload/pinball}}"
TARGET_PATH="${ROOT_DIR}/pinball"

if [[ ! -d "${PRELOAD_PINBALL_DIR}/data" ]]; then
  echo "Missing local pinball data source: ${PRELOAD_PINBALL_DIR}/data" >&2
  echo "Run the Pillyliu deploy/build flow first, or pass a source directory:" >&2
  echo "  scripts/link-local-pinball.sh /path/to/pinball" >&2
  exit 1
fi

if [[ -e "${TARGET_PATH}" || -L "${TARGET_PATH}" ]]; then
  rm -rf "${TARGET_PATH}"
fi

mkdir -p "${TARGET_PATH}/images"
ln -s "${PRELOAD_PINBALL_DIR}/data" "${TARGET_PATH}/data"

for rel in api rulesheets gameinfo; do
  source_dir="${PRELOAD_PINBALL_DIR}/${rel}"
  if [[ -d "${source_dir}" ]]; then
    ln -s "${source_dir}" "${TARGET_PATH}/${rel}"
  fi
done

if [[ -d "${ADMIN_WORKSPACE}/assets/playfields" ]]; then
  ln -s "${ADMIN_WORKSPACE}/assets/playfields" "${TARGET_PATH}/images/playfields"
fi
if [[ -d "${ADMIN_WORKSPACE}/assets/backglasses" ]]; then
  ln -s "${ADMIN_WORKSPACE}/assets/backglasses" "${TARGET_PATH}/images/backglasses"
fi

for rel in cache-manifest.json cache-update-log.json; do
  if [[ -f "${PRELOAD_PINBALL_DIR}/${rel}" ]]; then
    ln -s "${PRELOAD_PINBALL_DIR}/${rel}" "${TARGET_PATH}/${rel}"
  elif [[ -f "${ADMIN_WORKSPACE}/manifests/${rel}" ]]; then
    ln -s "${ADMIN_WORKSPACE}/manifests/${rel}" "${TARGET_PATH}/${rel}"
  fi
done

echo "Linked local /pinball mirror at ${TARGET_PATH}"
