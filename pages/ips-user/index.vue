<template>
  <div>
    <loader v-if="loading || userDataPending" />
    <h1 class="mb-5">مستخدمين نظام IPS</h1>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :style="{ maxWidth: '700px' }"
            placeholder="الاسم بالانجليزية"
            variant="outlined"
            v-model="enNameSearch"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :style="{ maxWidth: '700px' }"
            placeholder="رقم الهاتف"
            variant="outlined"
            v-model="phoneSearch"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            variant="outlined"
            v-model="isActive"
            :items="stateList"
            item-title="name"
            item-value="id"
            label="الحالة"
            return-object
          >
          </v-select>
        </v-col>
        <!-- <v-col sm="12" md="6">
          <v-select
            variant="outlined"
            v-model="bank"
            :items="bankData"
            item-title="bank_name"
            item-value="id"
            label="المصرف"
            return-object
          >
          </v-select>
        </v-col> -->
        <!-- <v-col cols="12" md="6">
        <v-text-field
          :style="{ maxWidth: '700px' }"
          placeholder="رقم الواصل"
          variant="outlined"
          v-model="idSearch"
        >
        </v-text-field>
      </v-col> -->
      </v-row>
    </v-container>
    <v-card color="grey-lighten-4" flat rounded="0">
      <v-toolbar>
        <v-spacer></v-spacer>
        <!-- <v-btn
          v-if="
            ['Add-User', 'Index-Groups'].every((e) =>
              user.permission.includes(e)
            )
          "
          to="/user/create"
          size="large"
          variant="elevated"
          prepend-icon="mdi-account-plus-outline"
        >
          مستخدم
        </v-btn> -->
      </v-toolbar>
      <v-table fixed-header>
        <thead>
          <tr>
            <th>المعرف</th>
            <th>الاسم</th>
            <th>الاسم بالانجليزي</th>
            <th>رقم الهاتف</th>
            <th>الحالة</th>
            <th>تاريخ الانشاء</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in userData?.results" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.fullName }}</td>
            <td>{{ item.full_english_name }}</td>
            <td>{{ item.phoneNumber }}</td>
            <td>
              <span v-if="item.state == 1">نشط</span>
              <span v-else>غير نشط</span>
            </td>
            <td>{{ dateFormat(item.create_at, "yyyy-mm-dd") }}</td>
            <td>
              <v-menu
                v-if="
                  ['Change-State-Ips'].every((e) => user.permission.includes(e))
                "
              >
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                </template>

                <v-list>
                  <v-list-item
                    v-if="
                      ['Change-State-Ips'].every((e) =>
                        user.permission.includes(e)
                      )
                    "
                    :link="true"
                    @click="updateUserState(item.id, item.state)"
                  >
                    <v-list-item-title
                      ><div>
                        <span v-if="item.state == 1">الغاء النشاط</span>
                        <span v-else>تفعيل النشاط</span>
                        <v-icon size="small"
                          >{{
                            item.state == 1
                              ? "mdi-account-lock"
                              : "mdi-account-lock-open"
                          }}
                        </v-icon>
                      </div></v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    <v-pagination
      v-model="page"
      :length="Math.ceil(userData?.count / 10)"
      rounded="circle"
    ></v-pagination>
  </div>
</template>

<script setup>
import debounce from "lodash.debounce";
import { dateFormat, baseURL } from "~~/helpers";
const route = useRoute();
const { userToken, user } = useAuth();
const stateList = ref([
  {
    name: "الكل",
    id: -1,
  },
  {
    name: "نشط",
    id: 1,
  },
  {
    name: "غير نشط",
    id: 0,
  },
]);
const isActive = ref(null);
const isActiveQuery = route.query?.isActive
  ? parseInt(route.query?.isActive)
  : -1;
const _isActive = stateList.value.find(
  (isActive) => isActive.id === isActiveQuery
);
isActive.value = _isActive;
const pageQuery = route.query.page ? parseInt(route.query.page) : 1;
const page = ref(pageQuery);
const loading = ref(false);
const enNameQuery = route.query.enName ? route.query.enName : "";
const enNameSearch = ref(enNameQuery);
const _enNameSearch = debounce(async () => {
  navigateTo({
    query: {
      page: page.value,
      phone: phoneSearch.value,
      enName: enNameSearch.value,
      isActive: isActive.value.id,
    },
  });
  await refresh();
  page.value = 1;
}, 500);
watch(enNameSearch, (value) => {
  _enNameSearch();
});
const phoneQuery = route.query.phone ? route.query.phone : "";
const phoneSearch = ref(phoneQuery);
const _phoneSearch = debounce(async () => {
  navigateTo({
    query: {
      page: page.value,
      phone: phoneSearch.value,
      enName: enNameSearch.value,
      isActive: isActive.value.id,
    },
  });
  await refresh();
  page.value = 1;
}, 500);
watch(phoneSearch, (value) => {
  _phoneSearch();
});
watch(page, async (newPage) => {
  navigateTo({
    query: {
      page: newPage,
      phone: phoneSearch.value,
      enName: enNameSearch.value,
      isActive: isActive.value.id,
    },
  });
  refresh();
});
watch(isActive, async (newIsActive) => {
  page.value = 1;
  navigateTo({
    query: {
      isActive: newIsActive,
      page: page.value,
      phone: phoneSearch.value,
      enName: enNameSearch.value,
      isActive: isActive.value.id,
    },
  });
  refresh();
});
const { snackbar } = useSnackbar();

definePageMeta({
  layout: "auth",
});
const {
  data: userData,
  pending: userDataPending,
  refresh,
} = await useAsyncData(
  "getUsers",
  () =>
    $fetch(`${baseURL}/api/user-ips`, {
      headers: { Authorization: `${userToken.value}` },
      method: "GET",
      query: {
        english_name: enNameSearch.value,
        phoneNumber: phoneSearch.value,
        page: page.value,
        state: isActive.value?.id !== -1 ? isActive.value?.id : null,
      },
    }),

  { watch: [page] }
);

const updateUserState = async (userId, state) => {
  loading.value = true;
  await useMyFetch(`api/user-ips/update-state/${userId}`, {
    method: "POST",
    body: {
      state: state == 1 ? 0 : 1,
    },
    onResponse: async ({ response }) => {
      await refresh();
      loading.value = false;
      snackbar({
        isOpen: true,
        mode: "success",
        content: "نجحت العملية",
        _responseMsg: response._data.message,
      });
    },
    onResponseError: async () => {
      loading.value = false;
      snackbar({
        isOpen: true,
        mode: "error",
        content: " فشلت العملية",
        _responseMsg: response._data.message,
      });
    },
    onRequestError: () => {
      loading.value = false;
      snackbar({
        isOpen: true,
        mode: "error",
        content: "فشلت العملية",
      });
    },
  });
};
</script>

<style lang="scss" scoped></style>
