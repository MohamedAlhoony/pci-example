<template>
  <div>
    <h1 class="mb-5">المستخدمين</h1>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :style="{ maxWidth: '700px' }"
            placeholder="اسم المستخدم"
            variant="outlined"
            v-model="usernameSearch"
          >
          </v-text-field>
        </v-col>
        <v-col sm="12" md="6">
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
        </v-col>
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
        <v-btn
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
        </v-btn>
      </v-toolbar>
      <v-table fixed-header>
        <thead>
          <tr>
            <th>المعرف</th>
            <th>الاسم</th>
            <th>اللقب</th>
            <th>اسم المستخدم</th>
            <th>رقم الهاتف</th>
            <th>البريد الالكتروني</th>
            <th>المصرف</th>
            <th>الجنس</th>
            <th>الحالة</th>
            <th>تاريخ الانشاء</th>
            <th>المجموعات</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in userData.results" :key="item.id">
            <td>{{ item.user_id }}</td>
            <td>{{ item.F_name }}</td>
            <td>{{ item.L_Name }}</td>
            <td>{{ item.user_name }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.email }}</td>
            <td>
              {{ bankData.find((bank) => bank.id === item.bank)?.bank_name }}
            </td>
            <td>{{ item.sex === 0 ? "أنثى" : "ذكر" }}</td>
            <td>
              <span v-if="item.stat">نشط</span>
              <span v-else>غير نشط</span>
            </td>
            <td>{{ dateFormat(item.CreateDateTime, "yyyy-mm-dd") }}</td>
            <td>
              <v-menu location="bottom center" max-height="500">
                <template v-slot:activator="{ props }">
                  <v-btn rounded="" v-bind="props">
                    عرض: {{ item.group?.length }}</v-btn
                  >
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in item.group"
                    :key="index"
                    :value="index"
                  >
                    <v-list-item-title>{{
                      getGroupById(item)?.group_name
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
            <td>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                </template>

                <v-list>
                  <v-list-item
                    v-if="
                      ['Update-User', 'Index-Groups'].every((e) =>
                        user.permission.includes(e)
                      )
                    "
                    :link="true"
                    :to="`./user/${item.user_id}/update`"
                  >
                    <v-list-item-title
                      ><div>
                        تعديل
                        <v-icon size="small"> mdi-account-edit </v-icon>
                      </div></v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="user?.permission.includes('Change-Password')"
                    :link="true"
                    :to="`./user/${item.user_id}/password-reset`"
                  >
                    <v-list-item-title
                      ><div>
                        اعادة تعيين كلمة السر
                        <v-icon size="small">mdi-lock-reset </v-icon>
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
const pageQuery = route.query.page ? parseInt(route.query.page) : 1;
const usernameQuery = route.query.username ? route.query.username : "";
const usernameSearch = ref(usernameQuery);
const page = ref(pageQuery);
watch(page, async (newPage) => {
  navigateTo({ query: { page: newPage, bank: bank.value?.id } });
  refresh();
});
const _usernaemSearch = debounce(async () => {
  navigateTo({
    query: { page: page.value, username: usernameSearch.value },
  });
  await refresh();
  page.value = 1;
}, 500);
watch(usernameSearch, (value) => {
  _usernaemSearch();
});
definePageMeta({
  layout: "auth",
});
const bank = ref(null);
const bankQuery = route.query.bank ? parseInt(route.query.bank) : -1;
const { data: bankData } = await useAsyncData("getCities", () =>
  $fetch(`${baseURL}/api/bank/get`, {
    headers: { Authorization: `${userToken.value}` },
    method: "GET",
  })
);
bankData.value?.unshift({
  id: -1,
  bank_name: "الكل",
});
const _bank = bankData.value.find((bank) => bank.id === bankQuery);
bank.value = _bank;
watch(bank, async (newCity) => {
  page.value = 1;
  navigateTo({ query: { bank: newCity?.id, page: page.value } });
});
const {
  data: userData,
  pending: userDataPending,
  refresh,
} = await useAsyncData(
  "getUsers",
  () =>
    $fetch(`${baseURL}/api/user`, {
      headers: { Authorization: `${userToken.value}` },
      method: "GET",
      query: {
        page: page.value,
        username: usernameSearch.value,
        bank: bank.value?.id !== -1 ? bank.value?.id : null,
      },
    }),

  { watch: [page, bank] }
);
const { data: groupsData } = await useMyFetch(() => `/api/user/group`);
const getGroupById = (id) => {
  return groupsData.value.find((group) => group.id === id);
};
</script>

<style lang="scss" scoped></style>
