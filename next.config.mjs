/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Применяем CORS ко всем API маршрутам
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Разрешить доступ с любых источников (для разработки)
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS", // Разрешённые методы
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization", // Разрешённые заголовки
          },
        ],
      },
    ];
  }
};

export default nextConfig;
