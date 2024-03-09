<template>
  <div>
    <loader v-if="loading || userDataPending" />
    <h1 class="mb-5">الحركات</h1>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :style="{ maxWidth: '700px' }"
            placeholder="رقم حساب المستلم"
            variant="outlined"
            v-model="creditorIDSearch"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :style="{ maxWidth: '700px' }"
            placeholder="رقم حساب المرسل"
            variant="outlined"
            v-model="debitorIDSearch"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="من تاريخ"
            type="date"
            :style="{ maxWidth: '700px' }"
            placeholder="من تاريخ"
            variant="outlined"
            v-model="fromSearch"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="الى تاريخ"
            type="date"
            :style="{ maxWidth: '700px' }"
            placeholder="الى تاريخ"
            variant="outlined"
            v-model="toSearch"
          >
          </v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="6">
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
        </v-col> -->
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
            <th>القيمة</th>
            <th>العملة</th>
            <th>قيمة العمولة</th>
            <th>عملة العمولة</th>
            <th>حساب المرسل</th>
            <th>حساب المستلم</th>
            <th>اسم المستلم</th>
            <th>مصرف المستلم</th>
            <th>رمز مصرف المستلم</th>
            <th>الوصف</th>
            <th>تاريخ العملية</th>
            <!-- <th></th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in userData?.results" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.currency }}</td>
            <td>{{ item.charge_amount }}</td>
            <td>{{ item.charge_currency }}</td>
            <td>{{ item.debtor_account_identification }}</td>
            <td>{{ item.creditor_account_identification }}</td>
            <td>{{ item.creditor_account_name }}</td>
            <td>{{ item.creditor_agent_name }}</td>
            <td>{{ item.creditor_agent_code }}</td>
            <td>{{ item.description }}</td>
            <td>
              {{ dateFormat(item.created_at, "yyyy-mm-dd h:MM TT") }}
            </td>
            <!-- <td>
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
            </td> -->
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
import { baseURL, dateFormat } from "~~/helpers";
const route = useRoute();
const { userToken, user } = useAuth();
// const stateList = ref([
//   {
//     name: "الكل",
//     id: -1,
//   },
//   {
//     name: "نشط",
//     id: 1,
//   },
//   {
//     name: "غير نشط",
//     id: 0,
//   },
// ]);
// const isActive = ref(null);
// const isActiveQuery = route.query?.isActive
//   ? parseInt(route.query?.isActive)
//   : -1;
// const _isActive = stateList.value.find(
//   (isActive) => isActive.id === isActiveQuery
// );
// isActive.value = _isActive;
const pageQuery = route.query.page ? parseInt(route.query.page) : 1;
const page = ref(pageQuery);
const loading = ref(false);
const creditorIDQuery = route.query.creditorID ? route.query.creditorID : "";
const creditorIDSearch = ref(creditorIDQuery);
const debitorIDQuery = route.query.debitorID ? route.query.debitorID : "";
const debitorIDSearch = ref(debitorIDQuery);
const fromQuery = route.query.from ? route.query.from : "";
const fromSearch = ref(fromQuery);
const toQuery = route.query.to ? route.query.to : "";
const toSearch = ref(toQuery);
const _toSearch = debounce(async () => {
  navigateTo({
    query: {
      page: page.value,
      // phone: phoneSearch.value,
      debitorID: debitorIDSearch.value,
      creditorID: creditorIDSearch.value,
      from: fromSearch.value,
      to: toSearch.value,
      // isActive: isActive.value.id,
    },
  });
  await refresh();
  page.value = 1;
}, 500);
watch(toSearch, (value) => {
  _toSearch();
});
const _fromSearch = debounce(async () => {
  navigateTo({
    query: {
      page: page.value,
      // phone: phoneSearch.value,
      debitorID: debitorIDSearch.value,
      creditorID: creditorIDSearch.value,
      from: fromSearch.value,
      to: toSearch.value,
      // isActive: isActive.value.id,
    },
  });
  await refresh();
  page.value = 1;
}, 500);
watch(fromSearch, (value) => {
  _fromSearch();
});
const _creditorIDSearch = debounce(async () => {
  navigateTo({
    query: {
      page: page.value,
      // phone: phoneSearch.value,
      debitorID: debitorIDSearch.value,
      creditorID: creditorIDSearch.value,
      from: fromSearch.value,
      to: toSearch.value,

      // isActive: isActive.value.id,
    },
  });
  await refresh();
  page.value = 1;
}, 500);
watch(creditorIDSearch, (value) => {
  _creditorIDSearch();
});

const _debitorIDSearch = debounce(async () => {
  navigateTo({
    query: {
      page: page.value,
      // phone: phoneSearch.value,
      creditorID: creditorIDSearch.value,
      debitorID: debitorIDSearch.value,
      from: fromSearch.value,
      to: toSearch.value,

      // isActive: isActive.value.id,
    },
  });
  await refresh();
  page.value = 1;
}, 500);
watch(debitorIDSearch, (value) => {
  _debitorIDSearch();
});
// const phoneQuery = route.query.phone ? route.query.phone : "";
// const phoneSearch = ref(phoneQuery);
// const _phoneSearch = debounce(async () => {
//   navigateTo({
//     query: {
//       page: page.value,
//       phone: phoneSearch.value,
//       creditorID: creditorIDSearch.value,
//       isActive: isActive.value.id,
//     },
//   });
//   await refresh();
//   page.value = 1;
// }, 500);
// watch(phoneSearch, (value) => {
//   _phoneSearch();
// });
watch(page, async (newPage) => {
  navigateTo({
    query: {
      page: newPage,
      // phone: phoneSearch.value,
      debitorID: debitorIDSearch.value,
      creditorID: creditorIDSearch.value,
      from: fromSearch.value,
      to: toSearch.value,

      // isActive: isActive.value.id,
    },
  });
  refresh();
});
// watch(isActive, async (newIsActive) => {
//   page.value = 1;
//   navigateTo({
//     query: {
//       isActive: newIsActive,
//       page: page.value,
//       phone: phoneSearch.value,
//       creditorID: creditorIDSearch.value,
//       isActive: isActive.value.id,
//     },
//   });
//   refresh();
// });
const { snackbar } = useSnackbar();

definePageMeta({
  layout: "auth",
});
const {
  data: userData,
  pending: userDataPending,
  refresh,
} = await useAsyncData(
  "getTransactions",
  () =>
    $fetch(`${baseURL}/api/transaction`, {
      headers: { Authorization: `${userToken.value}` },
      method: "GET",
      query: {
        creditor_account_identification: creditorIDSearch.value,
        debtor_account_identification: debitorIDSearch.value,
        from_date: fromSearch.value,
        to_date: toSearch.value,
        // phoneNumber: phoneSearch.value,
        page: page.value,
        // state: isActive.value?.id !== -1 ? isActive.value?.id : null,
      },
    }),

  { watch: [page] }
);

// const updateUserState = async (userId, state) => {
//   loading.value = true;
//   await useMyFetch(`api/user-ips/update-state/${userId}`, {
//     method: "POST",
//     body: {
//       state: state == 1 ? 0 : 1,
//     },
//     onResponse: async ({ response }) => {
//       await refresh();
//       loading.value = false;
//       snackbar({
//         isOpen: true,
//         mode: "success",
//         content: "نجحت العملية",
//         _responseMsg: response._data.message,
//       });
//     },
//     onResponseError: async () => {
//       loading.value = false;
//       snackbar({
//         isOpen: true,
//         mode: "error",
//         content: " فشلت العملية",
//         _responseMsg: response._data.message,
//       });
//     },
//     onRequestError: () => {
//       loading.value = false;
//       snackbar({
//         isOpen: true,
//         mode: "error",
//         content: "فشلت العملية",
//       });
//     },
//   });
// };
</script>

<style lang="scss" scoped></style>
