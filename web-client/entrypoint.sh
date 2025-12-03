#!/bin/sh

# Create env-config.js with runtime environment variables
echo "window.__ENV__ = {" > /app/public/env-config.js
echo "  NEXT_PUBLIC_BACKEND_URL: \"${NEXT_PUBLIC_BACKEND_URL}\"" >> /app/public/env-config.js
echo "};" >> /app/public/env-config.js

# Execute the main command
exec "$@"
