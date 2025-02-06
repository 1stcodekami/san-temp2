// next.config.mjs

export default {
    images: {
      domains: ['cdn.sanity.io'], // Allow images from your Sanity CDN
      disableStaticImages: true, // Disable static image caching in Next.js
    },
  };
  