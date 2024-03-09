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
                v-model="firstName"
                :rules="firstNameRules"
                label="الاسم"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="lastName"
                :rules="lastNameRules"
                label="اللقب"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-select
                v-model="sex"
                :rules="sexRules"
                label="الجنس"
                :items="[
                  { name: 'ذكر', value: 1 },
                  { name: 'أنثى', value: 0 },
                ]"
                item-title="name"
                item-value="value"
                return-object=""
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="email"
                :rules="emailRules"
                validate-on="submit"
                label="البريد الالكتروني"
                required
              />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="username"
                :rules="usernameRules"
                label="اسم المستخدم"
                required
            /></v-col>
            <v-col cols="12" md="6" lg="4">
              <v-locale-provider :rtl="false">
                <v-text-field
                  class="mb-2"
                  v-model="phone"
                  :rules="phoneRules"
                  label="رقم الهاتف"
                  prefix=""
                  validate-on="submit"
                  :maxLength="14"
                  required
                />
              </v-locale-provider>
            </v-col>
            <!-- <v-col cols="12" md="6" lg="4">
              <v-text-field
                class="mb-2"
                v-model="password"
                :rules="passwordRules"
                label="كلمة السر"
                required
            /></v-col> -->
            <v-col cols="12" md="6" lg="4">
              <v-switch
                color="blue"
                v-model="isActive"
                hide-details
                inset
                :label="`${isActive ? 'الحساب نشط' : 'الحساب غير نشط'}`"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-select
                :rules="bankRules"
                v-model="bank"
                :items="cities"
                item-title="bank_name"
                item-value="id"
                label="المصرف"
                return-object
              />
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-select
                :rules="groupsRules"
                v-model="selectedGroups"
                :items="groups"
                item-title="group_name"
                item-value="id"
                label="المجموعات"
                return-object
                multiple
              >
                <template v-slot:prepend-item>
                  <v-list-item title="اختيار الكل" @click="toggle">
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        disabled
                        :color="isSomeSelected ? 'indigo-darken-4' : undefined"
                        :indeterminate="isSomeSelected && !isAllSelected"
                        :model-value="isSomeSelected"
                      ></v-checkbox-btn>
                    </template>
                  </v-list-item>

                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-btn type="submit" variant="elevated" color="primary"
                >تحديث</v-btn
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
const route = useRoute();
const { userToken } = useAuth();
const id = route.params.id;
const { data: userData } = await useMyFetch(`/api/user?page=1&id=${id}`);
const user = userData.value?.results[0];
const { data: groupData } = await useAsyncData("getGroups", () =>
  $fetch(`http://192.168.12.38:8086/api/user/group`, {
    headers: { Authorization: `${userToken.value}` },
    method: "GET",
  })
);
const { data: bankData } = await useAsyncData("getCities", () =>
  $fetch(`http://192.168.12.38:8086/api/bank/get`, {
    headers: { Authorization: `${userToken.value}` },
    method: "GET",
  })
);
const groups = groupData.value ?? [];
const cities = bankData.value ?? [];
const selectedGroups = ref(
  user.group.map((group) => {
    return groupData.value.find((_group) => {
      return _group.id === group;
    });
  })
);
const loading = ref(false);
const isAllSelected = computed(
  () => selectedGroups.value?.length === groups?.length
);

const isSomeSelected = computed(() => selectedGroups.value?.length > 0);
const toggle = () => {
  if (isAllSelected.value) {
    selectedGroups.value = [];
  } else {
    selectedGroups.value = groups.slice();
  }
};
const form = ref(null);
const firstName = ref(user?.F_name ?? "");
const firstNameRules = ref([(v) => !!v || "الاسم مطلوب"]);
const lastName = ref(user?.L_Name ?? "");
const lastNameRules = ref([(v) => !!v || "اللقب مطلوب"]);
const email = ref(user?.email ?? "");
const emailRules = ref([
  (v) => !!v || "البريد الالكتروني مطلوب",
  (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || "البريد المدخل غير صحيح",
]);
const bank = ref(bankData.value.find((bank) => bank.id === user?.bank) ?? null);
const bankRules = ref([(v) => !!v || "المصرف مطلوب"]);
const sex = ref(
  user?.sex === 1
    ? { name: "ذكر", value: 1 }
    : user?.sex === 0
    ? { name: "أنثى", value: 0 }
    : null
);
const sexRules = ref([(v) => !!v || "حقل الجنس مطلوب"]);
const username = ref(user?.user_name ?? "");
const usernameRules = ref([(v) => !!v || "اسم المستخدم مطلوب"]);
const groupsRules = ref([(v) => !!v.length || "يجب تحديد المجموعات"]);
const phone = ref(user?.phone ?? "");
const phoneRules = ref([
  (v) => !!v || "رقم الهاتف  مطلوب",
  // (v) => v.length === 9 || "رقم الهاتف غير صحيح",
]);
const password = ref(user?.password ?? "");
const passwordRules = ref([(v) => !!v || "كلمة السر مطلوبة"]);
const isActive = ref(user?.stat);
const { snackbar } = useSnackbar();
const router = useRouter();
const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    loading.value = true;
    await useMyFetch(`/api/user/update/${id}`, {
      method: "POST",
      body: {
        // password: password.value,
        user_name: username.value,
        F_name: firstName.value,
        L_Name: lastName.value,
        sex: sex.value.value,
        stat: isActive.value,
        Email: email.value,
        Phone_No: phone.value,
        Bank: bank.value.id,
        group: selectedGroups.value.map((group) => {
          return group?.id;
        }),
      },
      onResponse: async ({ response }) => {
        loading.value = false;
        if (response.status === 200) {
          snackbar({
            isOpen: true,
            mode: "success",
            content: "نجحت عملية تحديث الحساب",
          });
          await navigateTo("/user");
        }
      },
      onResponseError: async ({ response }) => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية تحديث الحساب.",
          _responseMsg:
            response._data?.message || JSON.stringify(response._data) || "",
        });
      },
      onRequestError: () => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية تحديث الحساب.",
          _responseMsg: response._data?.message || "",
        });
      },
    });
  }
};
</script>

<style lang="scss" scoped></style>
