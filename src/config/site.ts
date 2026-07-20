export const siteConfig = {
  name: "MediMind",
  description: "AI-powered healthcare platform connecting patients with trusted medical resources, real-time symptom analysis, and intelligent clinical insights.",
  tagline: "Intelligent Healthcare Navigation",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  ogImage: "/images/og.png",
  links: {
    facebook: "https://facebook.com",
    x: "https://x.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
  },
  creator: "MediMind Team",
  keywords: [
    "healthcare",
    "AI",
    "symptom checker",
    "medicines",
    "doctors",
    "telemedicine",
    "health records",
  ],
  version: "1.0.0",
  copyright: `© ${new Date().getFullYear()} MediMind. All rights reserved.`,
} as const;

export const paginationDefaults = {
  page: 1,
  limit: 12,
} as const;

export const queryStaleTimes = {
  session: 5 * 60 * 1000,
  dashboard: 2 * 60 * 1000,
  landing: 5 * 60 * 1000,
  resources: 3 * 60 * 1000,
} as const;
