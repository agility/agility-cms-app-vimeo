/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  async headers() {
    return [
      {
        source: "/.well-known/agility-app.json",
        headers: [
          {
            //need to allow CORS requests to at LEAST to the app definition
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'autoplay=*, encrypted-media=*, fullscreen=*, clipboard-write=*, web-share=*'
          },
        ],
      }
    ]
  },
}

module.exports = nextConfig
