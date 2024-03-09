<template>
  <div
    v-if="error?.statusCode === 406"
    class="h-screen d-flex justify-center flex-column"
  >
    <h1 class="text-center mt-5">{{ error?.message }}</h1>
    <div class="d-flex justify-center mt-5">
      <v-btn href="/" li size="large" color="primary">
        الذهاب للصفحة الرئيسية
      </v-btn>
    </div>
  </div>
  <div
    v-if="error?.statusCode === 404"
    class="h-screen d-flex justify-center flex-column"
  >
    <h1 class="text-center mt-5">{{ error?.message }}</h1>
    <div class="d-flex justify-center mt-5">
      <v-btn href="/" li size="large" color="primary">
        الذهاب للصفحة الرئيسية
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const error = useError();
</script>

<style lang="scss" scoped></style>
