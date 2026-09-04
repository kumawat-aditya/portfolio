import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the corner instrument lives at bottom-left, which is exactly where the
  // dev overlay sits — and it is the site's signature element, so the overlay
  // moves rather than the design
  devIndicators: false,
  agentRules: false,
};

export default nextConfig;
