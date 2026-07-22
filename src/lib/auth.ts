import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
  throw new Error("BETTER_AUTH_SECRET environment variable is required");
}

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "Medimind";

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
};

function getMongoClient(): MongoClient | null {
  if (!mongoUri) {
    if (isProduction) {
      console.warn("[MediMind] MONGODB_URI not set on frontend - Better Auth will not persist sessions. Set MONGODB_URI and DB_NAME in Vercel frontend env.");
    }
    return null;
  }
  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(mongoUri, {
      maxPoolSize: 5,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
  }
  return globalForMongo._mongoClient;
}

const mongoClient = getMongoClient();
const db = mongoClient ? mongoClient.db(dbName) : null;
const databaseConfig = db ? mongodbAdapter(db) : undefined;

const trustedOrigins = [baseURL];

if (isProduction && process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL !== baseURL) {
  trustedOrigins.push(process.env.NEXT_PUBLIC_APP_URL);
}

if (process.env.VERCEL_URL) {
  trustedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

if (process.env.VERCEL_BRANCH_URL) {
  trustedOrigins.push(`https://${process.env.VERCEL_BRANCH_URL}`);
}

if (process.env.VERCEL_GIT_PREVIEW_URL) {
  trustedOrigins.push(`https://${process.env.VERCEL_GIT_PREVIEW_URL}`);
}

if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.startsWith("https://")) {
  trustedOrigins.push(process.env.NEXT_PUBLIC_APP_URL);
}

const uniqueTrustedOrigins = [...new Set(trustedOrigins)];

export const auth = betterAuth({
  database: databaseConfig,
  baseURL,
  trustedOrigins: uniqueTrustedOrigins,
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

