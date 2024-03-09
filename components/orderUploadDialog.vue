<template>
  <v-dialog max-width="1000" v-model="props.dialog">
    <v-card>
      <v-progress-linear
        v-if="dialogLoading"
        indeterminate
        color="black"
        class="mb-0"
      ></v-progress-linear>
      <v-card-title>
        <h3>تحميل طلب</h3>
      </v-card-title>
      <v-card-text>
        <v-file-input
          :disabled="dialogLoading"
          @change="handleFilesChange"
          :on-click:clear="handleFilesChange"
          color="deep-purple-accent-4"
          counter
          label="اختر الملفات"
          multiple
          placeholder="Select your files"
          prepend-icon="mdi-paperclip"
          variant="outlined"
          :show-size="1000"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
              <v-chip
                v-if="index < 2"
                color="deep-purple-accent-4"
                label
                size="small"
                class="me-2"
              >
                {{ fileName }}
              </v-chip>

              <span
                v-else-if="index === 2"
                class="text-overline text-grey-darken-3 mx-2"
              >
                +{{ files?.length - 2 }} File(s)
              </span>
            </template>
          </template>
        </v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="dialogLoading" variant="text" @click="toggleDialog">
          اغلاق
        </v-btn>
        <v-btn
          color="primary"
          :disabled="dialogLoading || !files?.length"
          variant="text"
          @click="handleUploadOrder"
        >
          تحميل
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  dialog: {
    required: true,
    type: Boolean,
  },
  toggleDialog: {
    required: true,
    type: Function,
  },
  files: {
    required: true,
  },
  handleFilesChange: {
    required: true,
    type: Function,
  },
  handleUploadOrder: {
    required: true,
    type: Function,
  },
  dialogLoading: {
    required: true,
    type: Boolean,
  },
});
</script>

<style lang="scss" scoped></style>
