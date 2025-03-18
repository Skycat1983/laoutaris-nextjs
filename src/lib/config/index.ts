// src/config/index.ts

// Define TypeScript interface for configuration
interface Config {
  // **Server-Side Variables**
  MONGO_URI: string;
  JWT_SECRET: string;
  PORT: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  FETCH_COUNT: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  GITHUB_ID: string;
  GITHUB_SECRET: string;
  AUTH_SECRET: string;
  COLLECTIONS_STEM: string;
  BIOGRAPHY_STEM: string;

  // **Client-Side Variables**
  // BASEURL: string;
}

// Extract and assign environment variables
// const config: Config = {
//   // **Server-Side Variables**
//   MONGO_URI: process.env.MONGO_URI || "",
//   JWT_SECRET: process.env.JWT_SECRET || "",
//   PORT: process.env.PORT || "3000",
//   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
//   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
//   FETCH_COUNT: process.env.FETCH_COUNT || "5",
//   NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
//   NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
//   GITHUB_ID: process.env.GITHUB_ID || "",
//   GITHUB_SECRET: process.env.GITHUB_SECRET || "",
//   AUTH_SECRET: process.env.AUTH_SECRET || "",
//   COLLECTIONS_STEM: process.env.COLLECTIONS_STEM || "artwork",
//   BIOGRAPHY_STEM: process.env.BIOGRAPHY_STEM || "biography",

//   // **Client-Side Variables**
//   // BASEURL: process.env.NEXT_PUBLIC_BASEURL || "http://localhost:3000",
// };

// const missingVars = Object.entries(config)
//   .filter(([_, value]) => !value)
//   .map(([key]) => key);

// if (missingVars.length > 0) {
//   throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
// }

// export default config;
