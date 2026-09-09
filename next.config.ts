import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: { cpus: 2 },
  async redirects() {
    return [{source:'/:path*',has:[{type:'host' as const,value:'www.luxia-it.com'}],destination:'https://luxia-it.com/:path*',permanent:true}];
  },
};
export default nextConfig;
