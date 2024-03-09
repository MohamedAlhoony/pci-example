<template>
  <div :style="{ position: 'relative' }">
    <loader v-if="loading" />
    <v-sheet elevation="1" class="pa-4">
      <v-form @submit.prevent="onSubmit" lazy-validation ref="form">
        <v-container>
          <v-row>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                type="password"
                class="mb-2"
                v-model="password"
                :rules="passwordRules"
                label="كلمة السر الحالية"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                type="password"
                class="mb-2"
                v-model="new_password"
                :rules="new_passwordRules"
                label="كلمة السر الجديدة"
                required
            /></v-col>

            <v-col cols="12">
              <v-btn type="submit" variant="elevated" color="primary"
                >تعيين</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import { checkPasswordStrength } from "../../helpers";
definePageMeta({ layout: "auth" });
const loading = ref(false);
const form = ref(null);
const password = ref("");
const passwordRules = ref([(v) => !!v || "الحقل مطلوب"]);
const new_password = ref("");
const new_passwordRules = ref([
  (v) => !!v || "الحقل مطلوب",
  (v) => checkPasswordStrength(v),
]);
const { snackbar } = useSnackbar();
const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    loading.value = true;
    await useMyFetch("/api/user/update-password", {
      method: "POST",
      body: {
        password: password.value,
        new_password: new_password.value,
      },
      onResponse: async ({ response }) => {
        loading.value = false;
        if (
          response.status === 200 &&
          response._data.message === "Password has been updated"
        ) {
          snackbar({
            isOpen: true,
            mode: "success",
            content: "نجحت عملية اعادة تعيين كلمة السر",
          });
          await navigateTo("/profile");
        } else {
          snackbar({
            isOpen: true,
            mode: "error",
            content:
              "فشلت عملية اعادة تعيين كلمة السر, تأكد ان كلمة السر تحتوي على 6 خانات على الاقل وكذالك تحتوي على رمز واحد على الأقل.",
          });
        }
      },
      onResponseError: async ({ response }) => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية اعادة تعيين كلمة السر .",
          _responseMsg: response._data?.message || "",
        });
      },
      onRequestError: () => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية اعادة تعيين كلمة السر .",
          _responseMsg: response._data?.message || "",
        });
      },
    });
  }
};
</script>

<style lang="scss" scoped></style>
