/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    MONGO_URI: process.env.MONGO_URI,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    JWT_SECRET: process.env.JWT_SECRET,
    // Add more environment variables here
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
    ],
  },
};

export default nextConfig;
