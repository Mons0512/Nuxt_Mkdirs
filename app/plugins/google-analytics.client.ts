/**
 * Google Analytics plugin
 * Only loads on client-side
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const gaId = config.public.googleAnalyticsId;

  if (!gaId) {
    return;
  }

  // Load Google Analytics script
  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
        async: true,
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `,
      },
    ],
  });
});
