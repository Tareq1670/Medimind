import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "Medimind";

const databaseConfig = mongoUri
  ? mongodbAdapter(new MongoClient(mongoUri).db(dbName))
  : undefined;

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const secret = process.env.BETTER_AUTH_SECRET;

export const auth = betterAuth({
  database: databaseConfig,
  baseURL,
  ...(secret ? { secret } : {}),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const validRoles = ["user", "doctor", "admin"];
          const role = ctx?.body?.role;
          return {
            data: {
              ...user,
              role: validRoles.includes(role) ? role : "user",
            },
          };
        },
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
  plugins: [jwt()],
});

