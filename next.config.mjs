/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'bwawrnmjdzjqjbvhldrv.supabase.co',
				port: '',
				pathname: '/storage/v1/object/public/**',
			},
			{
				protocol: 'https',
				hostname: 'xfqwvmtittfhjvhkdoic.supabase.co',
				port: '',
				pathname: '/storage/v1/object/public/**',
			},
			{
        		protocol: 'https',
        		hostname: 'cdn.sanity.io',
        		port: '',
        		pathname: '/images/**',
      		},
		],
	},
};

export default nextConfig;
