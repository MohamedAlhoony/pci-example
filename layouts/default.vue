<template>
  <div>
    <ClientOnly>
      <v-locale-provider :rtl="true">
        <v-app :theme="theme">
          <v-main>
            <slot />
          </v-main>
        </v-app>
      </v-locale-provider>
      <v-snackbar
        id="snackBar"
        :style="{ direction: 'rtl', zIndex: 10000 }"
        location="top center"
        v-model="show"
        :timeout="timeout"
        :color="color"
      >
        <p>{{ text }}</p>
        <p :style="{ fontSize: '14px' }">{{ responseMsg }}</p>
        <template v-slot:actions>
          <v-btn variant="text" @click="show = false"> إغلاق </v-btn>
        </template>
      </v-snackbar>
    </ClientOnly>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const { theme } = useMyTheme();
const { show, text, timeout, color, responseMsg } = useSnackbar();
</script>

<style lang="scss" scoped></style>
