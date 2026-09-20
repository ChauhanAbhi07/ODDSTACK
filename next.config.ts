import type { NextConfig } from "next";
const pages = process.env.NEXT_PUBLIC_STATIC_SITE === "true";
const config: NextConfig = {
  // Allow phone previews through this computer's current Wi-Fi address.
  allowedDevOrigins: ["127.0.0.1", "192.168.1.9"],
  output: pages ? "export" : "standalone",
  ...(pages
    ? {
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
        trailingSlash: true,
        outputFileTracingRoot: process.cwd(),
      }
    : {}),
  poweredByHeader: false,
  ...(!pages && {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            { key: "X-Frame-Options", value: "DENY" },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=()",
            },
          ],
        },
      ];
    },
  }),
};
export default config;
