#!/bin/sh
set -eu

if [ -n "${ATLAS_PUBLIC_ORIGIN:-}" ]; then
    origin=${ATLAS_PUBLIC_ORIGIN%/}
elif [ -n "${VERCEL_URL:-}" ]; then
    origin="https://${VERCEL_URL}"
else
    origin="http://localhost:8080"
fi

case "$origin" in
    http://*|https://*) ;;
    *) echo 'ATLAS_PUBLIC_ORIGIN must start with http:// or https://' >&2; exit 1 ;;
esac

export NUXT_PUBLIC_API_BASE="$origin/api"
export NUXT_PUBLIC_SITE_URL="$origin"
export NUXT_PUBLIC_DOCS_URL="$origin/docs/"
export NUXT_PUBLIC_STORYBOOK_URL="$origin/storybook/"
export ATLAS_ALLOWED_ORIGINS="$origin"
export ATLAS_PUBLIC_ORIGIN="$origin"

escaped_origin=$(printf '%s' "$origin" | sed 's/[&|\\]/\\&/g')
find /srv/atlas/container/.output -type f \( -name '*.mjs' -o -name '*.js' -o -name '*.json' -o -name '*.html' \) \
    -exec sed -i "s|https://atlas.invalid|$escaped_origin|g" {} +

listen_port=${PORT:-80}
case "$listen_port" in
    *[!0-9]*|'') echo 'PORT must be a number' >&2; exit 1 ;;
esac
sed -i "s/ATLAS_LISTEN_PORT/$listen_port/" /etc/nginx/nginx.conf
export ATLAS_LISTEN_PORT="$listen_port"

PHP_CLI_SERVER_WORKERS=4 php -S 127.0.0.1:3001 -t /srv/atlas/api/public /srv/atlas/api/public/router.php &
api_pid=$!
PORT=3000 HOST=127.0.0.1 node /usr/local/bin/atlas-vercel-server.mjs &
web_pid=$!

trap 'kill "$api_pid" "$web_pid" 2>/dev/null || true' EXIT TERM INT
nginx -g 'daemon off;'
