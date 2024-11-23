/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['uovuxazyhwrpucwwiyjg.supabase.co'],
    },
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
};

export default nextConfig;