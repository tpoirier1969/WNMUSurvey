#!/usr/bin/env sh
cd "$(dirname "$0")" || exit 1
python3 -m http.server 8765 >/tmp/wnmu-survey-server.log 2>&1 &
python3 -m webbrowser http://localhost:8765/results.html
