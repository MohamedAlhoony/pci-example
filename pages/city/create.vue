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
                label="الاسم بالعربي"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="enName"
                :rules="enNameRules"
                label="الاسم بالانجليزي"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="cityCode"
                :rules="cityCodeRules"
                label="الرمز"
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
const enName = ref("");
const enNameRules = ref([(v) => !!v || "الحقل مطلوب"]);
const cityCode = ref("");
const cityCodeRules = ref([(v) => !!v || "الحقل مطلوب"]);
const { snackbar } = useSnackbar();
const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    loading.value = true;
    await useMyFetch("/api/city/create", {
      method: "POST",
      body: {
        city_name: name.value,
        code_id: cityCode.value,
        city_name_en: enName.value,
      },
      onResponse: async ({ response }) => {
        loading.value = false;
        if (response.status === 200) {
          snackbar({
            isOpen: true,
            mode: "success",
            content: "نجحت عملية اضافة المدينة",
          });
          await navigateTo("/city");
        }
      },
      onResponseError: async () => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية اضافة المدينة.",
        });
      },
      onRequestError: () => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية اضافة المدينة.",
        });
      },
    });
  }
};
</script>

<style lang="scss" scoped></style>
