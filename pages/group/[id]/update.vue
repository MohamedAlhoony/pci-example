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
              <v-select
                :rules="permissionsRules"
                v-model="selectedPermissions"
                :items="permissions"
                item-title="Per_name"
                item-value="id"
                label="الصلاحيات"
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
            <!-- <v-col cols="12" md="6" lg="4">
              <v-switch
                color="blue"
                v-model="isBank"
                :label="isBank ? 'المجموعة تمثل مصرف' : 'المجموعة لا تمثل مصرف'"
                hide-details
                inset
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6" lg="4">
              <v-textarea
                class="mb-2"
                v-model="desc"
                :rules="descRules"
                label="الوصف"
                required
              />
            </v-col> -->
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
const { data: groupData } = await useMyFetch(
  `/api/user/group?id=${route.params.id}`
);
const group = groupData.value[0];
const { data } = await useMyFetch("/api/user/group/permission");
const permissions = data.value ?? [];
const selectedPermissions = ref(
  group.permissions?.map((permission) => {
    return permissions.find((_permission) => {
      return _permission.id === permission;
    });
  })
);
const loading = ref(false);
const isAllSelected = computed(
  () => selectedPermissions.value?.length === permissions?.length
);
const isSomeSelected = computed(() => selectedPermissions?.value?.length > 0);
const toggle = () => {
  if (isAllSelected.value) {
    selectedPermissions.value = [];
  } else {
    selectedPermissions.value = permissions.slice();
  }
};

const form = ref(null);
const name = ref(group?.group_name ?? "");
const nameRules = ref([(v) => !!v || "الاسم مطلوب"]);
const desc = ref("");
const descRules = ref([]);
const permissionsRules = ref([(v) => !!v?.length || "يجب تحديد الصلاحيات"]);
const isBank = ref(true);
const { snackbar } = useSnackbar();

const onSubmit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    loading.value = true;
    await useMyFetch(`/api/user/group/update/${route.params.id}`, {
      method: "POST",
      body: {
        group_name: name.value,
        // desc: desc.value,
        // is_bank: isBank.value,
        permissions: selectedPermissions.value.map((group) => {
          return group.id;
        }),
      },
      onResponse: async ({ response }) => {
        loading.value = false;
        if (response.status === 200) {
          snackbar({
            isOpen: true,
            mode: "success",
            content: "نجحت عملية تحديث المجموعة",
          });
          await navigateTo("/group");
        }
      },
      onResponseError: async () => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية تحديث المجموعة.",
        });
      },
      onRequestError: () => {
        loading.value = false;
        snackbar({
          isOpen: true,
          mode: "error",
          content: "فشلت عملية تحديث المجموعة.",
        });
      },
    });
  }
};
</script>

<style lang="scss" scoped></style>
