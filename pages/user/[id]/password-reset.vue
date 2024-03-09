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
                v-model="password"
                :rules="passwordRules"
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
import { checkPasswordStrength } from "../../../helpers";
definePageMeta({ layout: "auth" });
const route = useRoute();
const { userToken } = useAuth();
const id = route.params.id;
const { data: userData } = await useMyFetch(`/api/user?page=1&id=${id}`);
const user = userData.value?.results[0];
const loading = ref(false);
const form = ref(null);
const password = ref(user?.password ?? "");
const passwordRules = ref([
  (v) => !!v || "كلمة السر مطلوبة",
  (v) => checkPasswordStrength(v),
]);
const isActive = ref(user?.stat);
const { snackbar } = useSnackbar();
const router = useRouter();
const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    loading.value = true;
    await useMyFetch(`/api/user/change-password/${id}`, {
      method: "POST",
      body: {
        password: password.value,
      },
      onResponse: async ({ response }) => {
        loading.value = false;
        if (response.status < 300 && response.status >= 200) {
          snackbar({
            isOpen: true,
            mode: "info",
            // content: "نجحت عملية تعيين كلمة السر",
            _responseMsg: response._data?.message || "",
          });
          form.value.reset();
          //   await navigateTo("/user");
        }
      },
      onResponseError: async ({ response }) => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية تعيين كلمة السر.",
          _responseMsg: response._data?.message || "",
        });
      },
      onRequestError: () => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية تعيين كلمة السر.",
          _responseMsg: response._data?.message || "",
        });
      },
    });
  }
};
</script>

<style lang="scss" scoped></style>
