"""Serve the compiled React SPA (frontend/dist) as a catch-all.

Good enough for a single-server deployment run with a real WSGI server. For
heavier traffic put nginx / a CDN in front of frontend/dist and let this only
handle the HTML shell.
"""

from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponse
from django.views.static import serve


def _dist() -> Path:
    return Path(settings.FRONTEND_DIST)


def spa(request, path: str = ""):
    dist = _dist()
    index = dist / "index.html"
    if not index.exists():
        return HttpResponse(
            "Frontend not built. Run `npm run build` in ../frontend.",
            status=503,
            content_type="text/plain",
        )

    if path:
        # Resolve and confine to dist to block path traversal.
        candidate = (dist / path).resolve()
        try:
            candidate.relative_to(dist.resolve())
        except ValueError:
            raise Http404
        if candidate.is_file():
            return serve(request, path, document_root=str(dist))

    # Unknown path -> hand the client-side router the shell.
    return FileResponse(open(index, "rb"), content_type="text/html")
