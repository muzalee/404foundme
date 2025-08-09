import Cookies from "js-cookie";

const TOKEN_KEY = "auth-token";
const COOKIE_OPTIONS = {
  secure: true,
  sameSite: "strict" as const,
  path: "/",
};

interface JWTPayload {
  exp?: number;
}

export const TokenUtil = {
  decodeToken(token: string): JWTPayload {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch {
      return {};
    }
  },

  setToken(token: string): void {
    const payload = this.decodeToken(token);
    const options = {
      ...COOKIE_OPTIONS,
      expires: payload.exp ? new Date(payload.exp * 1000) : undefined,
    };

    Cookies.set(TOKEN_KEY, token, options);
  },

  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken(): void {
    Cookies.remove(TOKEN_KEY, { path: "/" });
  },

  hasToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload.exp) return true;

    return payload.exp * 1000 > Date.now();
  },
};
