#!/bin/sh
set -eu

if [ -n "${ATLAS_PUBLIC_ORIGIN:-}" ]; then
    origin=${ATLAS_PUBLIC_ORIGIN%/}
elif [ -n "${VERCEL_PROJECT_PRODUCTION_URL:-}" ]; then
    origin="https://${VERCEL_PROJECT_PRODUCTION_URL}"
elif [ -n "${VERCEL_URL:-}" ]; then
    origin="https://${VERCEL_URL}"
else
    origin="http://localhost:8080"
fi

case "$origin" in
    http://*|https://*) ;;
    *) echo 'ATLAS_PUBLIC_ORIGIN must start with http:// or https://' >&2; exit 1 ;;
esac

export NUXT_PUBLIC_API_BASE="/api"
export NUXT_PUBLIC_SITE_URL="$origin"
export NUXT_PUBLIC_DOCS_URL="/docs/"
export NUXT_PUBLIC_STORYBOOK_URL="/storybook/"
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

attempt=0
until php -r '$api = @fsockopen("127.0.0.1", 3001, $api_errno, $api_error, 0.1); $web = @fsockopen("127.0.0.1", 3000, $web_errno, $web_error, 0.1); if ($api) fclose($api); if ($web) fclose($web); exit($api && $web ? 0 : 1);'; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 300 ] || ! kill -0 "$api_pid" 2>/dev/null || ! kill -0 "$web_pid" 2>/dev/null; then
        echo 'The application did not start in time' >&2
        exit 1
    fi
    sleep 0.1
done

nginx -g 'daemon off;'
