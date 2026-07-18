import { createAuthClient } from "better-auth/react";
import { jwtClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [
    jwtClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});
