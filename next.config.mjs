const contentSecurityPolicy = [
  // Allow resources from self and data URLs
  "default-src 'self' https: data: blob:",
  // Scripts from self and inline + Cloudinary widget
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  // Frames + Cloudinary widget
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  // Styles + Cloudinary
  "style-src 'self' 'unsafe-inline' https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  // Images + Cloudinary
  "img-src 'self' data: https: blob:",
  // Fonts + Cloudinary
  "font-src 'self' data: https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  // API and external connections + Cloudinary
  "connect-src 'self' data: https: blob:",
  // Media sources
  "media-src 'self' data: https: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["node_modules/bcrypt/prebuilds/**/*"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dzncmfirr/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = "source-map"; // Enable better source maps in development
    }
    return config;
  },
};

export default nextConfig;
