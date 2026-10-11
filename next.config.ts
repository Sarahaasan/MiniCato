import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ar"],
  },
};

export default nextConfig;