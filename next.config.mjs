/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  api: {
    bodyParser: {
      sizeLimit: '1000mb', // Adjust this limit as needed
    },
  },
};

export default nextConfig;
