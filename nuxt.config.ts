import ar from "./locales/ar.json";
import en from "./locales/en.json";
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: "service-worker",
  },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/css/main.css",
  ],

  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "",
    },
  },
  app: {
    // pageTransition: { name: "page", mode: "out-in" },
    head: {
      title: "معاملات - Moamalat",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap",
        },
      ],
    },
  },

  modules: [
    "@sidebase/nuxt-pdf",
    [
      "@nuxtjs/i18n",
      {
        locales: ["ar"],
        defaultLocale: "ar",
        vueI18n: {
          legacy: false,
          fallbackLocale: "ar",
          messages: {
            en,
            ar,
          },
        },
      },
    ],
  ],
});
