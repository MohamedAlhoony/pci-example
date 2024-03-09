<template>
  <v-row justify="center">
    <v-dialog v-model="props.dialog" persistent width="auto">
      <v-card>
        <v-card-title> رسالة تأكيد </v-card-title>
        <v-card-text>هل أنت متأكد من رغبتك في المتابعة؟</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="props.onReject"> الغاء </v-btn>
          <v-btn color="primary" variant="text" @click="props.onConfirm">
            تأكيد
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
const props = defineProps({
  dialog: {
    required: true,
    type: Boolean,
    default: false,
  },
  onConfirm: {
    type: Function,
    required: true,
    default: null,
  },
  onReject: {
    type: Function,
    required: true,
    default: null,
  },
});
</script>
