// plugins/vuetify.js
import { createVuetify, ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            primary: "#1A1AFF",
          },
        },
        dark: {
          colors: {
            primary: "#0F0F99",
          },
        },
      },
    },
    components,
    directives,
  });

  nuxtApp.vueApp.use(vuetify);
});
