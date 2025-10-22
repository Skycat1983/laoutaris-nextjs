/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGO_URI: process.env.MONGO_URI,
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
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          { key: "Access-Control-Allow-Headers", value: "*" },
          // {
          //   key: "Access-Control-Allow-Headers",
          //   value:
          //     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          // },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
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
            ].join("; "),
          },
        ],
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
