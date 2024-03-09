<template>
  <v-dialog v-model="dialog" :scrim="false" persistent width="auto">
    <v-card color="primary">
      <v-card-text>
        انتظر من فضلك
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup>
const dialog = ref(true);
</script>
<style lang="scss" scoped></style>
