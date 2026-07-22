import { createAuthClient } from "better-auth/react";
import { jwtClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  (typeof window !== "undefined" ? window.location.origin : undefined) ||
  "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    jwtClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});