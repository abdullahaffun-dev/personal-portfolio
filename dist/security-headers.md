# Production security headers

Recommended for the static host: HTTPS, HSTS after HTTPS verification, Content-Security-Policy, X-Content-Type-Options: nosniff, frame-ancestors protection, Referrer-Policy, Permissions-Policy, and safe handling of external links.

The static files do not know the deployment host, so host/CDN-specific response headers must be applied by the production platform.
