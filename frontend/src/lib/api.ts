// Thin client for the Django backend.
//
// In dev, Vite proxies /api -> http://localhost:8000 (see vite.config.js), so
// the default base of "" (same-origin) works everywhere. Override with
// VITE_API_BASE only if the API lives on a different host.

const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfToken: string | null = null;

/** Fetch a CSRF token (and set the csrftoken cookie). Safe to call repeatedly. */
export async function primeCsrf(): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/csrf/`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      csrfToken = data.csrfToken ?? readCookie("csrftoken");
    }
  } catch {
    // Non-fatal: submit() will fall back to the cookie or a fresh fetch.
  }
}

export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  company?: string; // honeypot — always empty for real users
};

export type ContactResult =
  | { ok: true }
  | { ok: false; detail?: string; errors?: Record<string, { message: string }[]> };

export async function submitContact(payload: ContactPayload): Promise<ContactResult> {
  if (!csrfToken) {
    csrfToken = readCookie("csrftoken");
    if (!csrfToken) await primeCsrf();
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/contact/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, detail: "Network error — check your connection and try again." };
  }

  let data: ContactResult;
  try {
    data = (await res.json()) as ContactResult;
  } catch {
    data = { ok: res.ok };
  }

  if (res.status === 429) {
    return { ok: false, detail: "You've sent a few requests already. Please try again later." };
  }
  return data;
}
