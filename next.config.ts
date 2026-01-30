import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 禁用静态页面生成，因为使用了客户端状态
  output: 'standalone',
};

export default nextConfig;
