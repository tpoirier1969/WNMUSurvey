#!/usr/bin/env sh
cd "$(dirname "$0")" || exit 1
python3 -m http.server 8765 &
SERVER_PID=$!
if command -v open >/dev/null 2>&1; then
  open http://localhost:8765
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open http://localhost:8765
fi
wait "$SERVER_PID"
