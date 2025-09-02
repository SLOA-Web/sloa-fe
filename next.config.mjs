/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'bwawrnmjdzjqjbvhldrv.supabase.co',
				port: '',
				pathname: '/storage/v1/object/**',
			},
		],
	},
};

export default nextConfig;
