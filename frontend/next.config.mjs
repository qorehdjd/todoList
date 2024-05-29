/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    return {
      ...config,
      devtool: process.env.NODE_ENV ? 'hidden-source-map' : 'inline-source-map',
    };
  },
};

export default nextConfig;
