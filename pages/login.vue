<template>
  <loader v-if="loading" />
  <v-row justify="center">
    <v-col
      :style="{ maxWidth: '45rem', height: 'calc(100vh - 32px)' }"
      class="d-flex flex-column justify-center"
    >
      <v-sheet elevation="1" class="pa-8">
        <div
          :style="{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }"
        >
          <!-- <img width="300" src="../assets/images/moamalat_logo.png" /> -->
        </div>
        <h1 class="text-center mb-10">نظام الدفع الفوري</h1>
        <v-form @submit.prevent="onSubmit" ref="form" lazy-validation>
          <v-text-field
            class="mb-2"
            variant="outlined"
            v-model="username"
            :rules="usernameRules"
            label="اسم المستخدم"
            required
          />

          <v-text-field
            class="mb-2"
            variant="outlined"
            v-model="password"
            type="password"
            :rules="passwordRules"
            label="كلمة السر"
            required
          />
          <v-btn color="primary" class="w-100 text-white" type="submit">
            تسجيل دخول
          </v-btn>
          <div>
            <v-toolbar height="150px" flat class="mt-10">
              <v-btn icon @click="toggleTheme">
                <v-icon v-if="theme !== 'light'">mdi-weather-sunset</v-icon>
                <v-icon v-else>mdi-weather-night</v-icon>
              </v-btn>
            </v-toolbar>
          </div>
        </v-form>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
const { theme, toggleTheme } = useMyTheme();
const { locale } = useI18n();
const { login } = useAuth();
const { snackbar } = useSnackbar();
const loading = useState("loading", () => false);
const form = ref(null);
const username = ref("");
//admin01
const usernameRules = ref([
  (v) => !!v || "اسم المستخدم مطلوب",
  // (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
]);
const password = ref("");
//123456@@
const passwordRules = ref([(v) => !!v || "كلمة السر مطلوبة"]);
const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    loading.value = true;
    const { data } = await login(username.value, password.value);
    loading.value = false;
    debugger;
    // if (data?.value?.token) {
    snackbar({
      isOpen: true,
      mode: "success",
      content: "تم تسجيل الدخول بنجاح",
    });

    // if (locale.value === "ar") {
    navigateTo("/");
    // } else {
    // navigateTo("/en");
    // }
    // }
    // else {
    //   snackbar({
    //     isOpen: true,
    //     mode: "error",
    //     content: "فشلت العملية, تأكد من مدخلاتك.",
    //   });
    // }
  }
};
const reset = () => {
  form.value.reset();
};

const resetValidation = () => {
  form.value.resetValidation();
};
</script>

<style lang="scss" scoped></style>
