import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "Medimind";

const mongoClient = mongoUri ? new MongoClient(mongoUri) : null;
const db = mongoClient?.db(dbName);

const databaseConfig = db ? mongodbAdapter(db) : undefined;

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
  throw new Error(
    "BETTER_AUTH_SECRET environment variable is required"
  );
}

export const auth = betterAuth({
  database: databaseConfig,
  baseURL,
  trustedOrigins: [baseURL],
  secret,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: true,
      },
      dob: {
        type: "string",
        required: false,
        input: true,
      },
      bloodGroup: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const validRoles = ["user", "doctor"];
          const role = ctx?.body?.role;
          return {
            data: {
              ...user,
              role: role && validRoles.includes(role) ? role : "user",
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

