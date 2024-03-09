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
                v-model="inst_code"
                :rules="inst_code_rules"
                label="bank code"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="key"
                :rules="key_rules"
                label="key"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="url_account_access"
                :rules="url_account_access_rules"
                label="url_account_access"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="url_account_confirm"
                :rules="url_account_confirm_rules"
                label="url_account_confirm"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="url_auth"
                :rules="url_auth_rules"
                label="url_auth"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="url_balance"
                :rules="url_balance_rules"
                label="url_balance"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="url_credit"
                :rules="url_credit_rules"
                label="url_credit"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="url_debit"
                :rules="url_debit_rules"
                label="url_debit"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="url_info"
                :rules="url_info_rules"
                label="url_info"
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
const inst_code = ref("");
const inst_code_rules = ref([
  (v) => !!v || "الحقل مطلوب",
  // (v) => v.length <= 6 || "الطول يجب أن يكون 6 أو أقل",
]);
const key = ref("");
const key_rules = ref([
  (v) => !!v || "الحقل مطلوب",
  // (v) => v.length <= 6 || "الطول يجب أن يكون 6 أو أقل",
]);
const url_account_access = ref("");
const url_account_access_rules = ref([
  (v) => !!v || "الحقل مطلوب",
  // (v) => v.length <= 6 || "الطول يجب أن يكون 6 أو أقل",
]);
const url_account_confirm = ref("");
const url_account_confirm_rules = ref([
  (v) => !!v || "الحقل مطلوب",
  // (v) => v.length <= 6 || "الطول يجب أن يكون 6 أو أقل",
]);
const url_auth = ref("");
const url_auth_rules = ref([
  (v) => !!v || "الحقل مطلوب",
  // (v) => v.length <= 6 || "الطول يجب أن يكون 6 أو أقل",
]);
const url_balance = ref("");
const url_balance_rules = ref([
  (v) => !!v || "الحقل مطلوب",
  // (v) => v.length <= 6 || "الطول يجب أن يكون 6 أو أقل",
]);
const url_credit = ref("");
const url_credit_rules = ref([
  (v) => !!v || "الحقل مطلوب",
  // (v) => v.length <= 6 || "الطول يجب أن يكون 6 أو أقل",
]);
const url_debit = ref("");
const url_debit_rules = ref([
  (v) => !!v || "الحقل مطلوب",
  // (v) => v.length <= 6 || "الطول يجب أن يكون 6 أو أقل",
]);
const url_info = ref("");
const url_info_rules = ref([
  (v) => !!v || "الحقل مطلوب",
  // (v) => v.length <= 6 || "الطول يجب أن يكون 6 أو أقل",
]);
const { snackbar } = useSnackbar();
const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    loading.value = true;
    await useMyFetch("/api/bank/create-ips", {
      method: "POST",
      body: {
        bank_name: name.value,
        inst_code: inst_code.value,
        key: key.value,
        url_account_access: url_account_access.value,
        url_account_confirm: url_account_confirm.value,
        url_auth: url_auth.value,
        url_balance: url_balance.value,
        url_credit: url_credit.value,
        url_debit: url_debit.value,
        url_info: url_info.value,
      },
      onResponse: async ({ response }) => {
        loading.value = false;
        if (response.status === 200) {
          snackbar({
            isOpen: true,
            mode: "success",
            content: "نجحت عملية انشاء المصرف",
          });
          await navigateTo("/ips-bank");
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
