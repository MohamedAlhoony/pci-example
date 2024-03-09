<template>
  <div :style="{ position: 'relative' }">
    <loader v-if="loading" />
    <v-sheet elevation="1" class="pa-4">
      <v-form @submit.prevent="onSubmit" lazy-validation ref="form">
        <v-container>
          <v-row>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="name"
                :rules="nameRules"
                label="الاسم"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                type="number"
                v-model="bank_code"
                :rules="bank_code_rules"
                label="رمز المصرف"
                required
            /></v-col>

            <v-col cols="12">
              <v-btn type="submit" variant="elevated" color="primary"
                >انشاء</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
definePageMeta({ layout: "auth" });
const loading = ref(false);
const form = ref(null);
const name = ref("");
const nameRules = ref([(v) => !!v || "الحقل مطلوب"]);
const bank_code = ref("");
const bank_code_rules = ref([
  (v) => !!v || "الحقل مطلوب",
  (v) => v.length <= 6 || "الطول يجب أن يكون 6 أو أقل",
]);
const { snackbar } = useSnackbar();
const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    loading.value = true;
    await useMyFetch("/api/bank/create", {
      method: "POST",
      body: {
        bank_name: name.value,
        BANK_CODE: bank_code.value,
      },
      onResponse: async ({ response }) => {
        loading.value = false;
        if (response.status === 200) {
          snackbar({
            isOpen: true,
            mode: "success",
            content: "نجحت عملية انشاء المصرف",
          });
          await navigateTo("/bank");
        }
      },
      onResponseError: async ({ response }) => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية انشاء المصرف.",
          _responseMsg:
            response._data?.message || JSON.stringify(response._data) || "",
        });
      },
      onRequestError: () => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية انشاء المصرف.",
        });
      },
    });
  }
};
</script>
<style lang="scss" scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
