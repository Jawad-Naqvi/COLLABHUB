/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'hnfetimxhezkhdgcdshw.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      
      {
        protocol: 'https',
        hostname: 'nkttakyotftrwqdqmnaa.supabase.co', // Add your correct Supabase storage domain here
      },
    ],
  },
};

export default nextConfig;
