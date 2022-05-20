/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  env: {
    STORAGE_URL: `https://levecontatos9e53e40ea7f745c9b23117c897a3f9c2112033-dev.s3.amazonaws.com/public/`
  },
};