<template>
  <div>
    <h1 class="mb-5">المجموعات</h1>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :style="{ maxWidth: '700px' }"
            placeholder="الاسم"
            variant="outlined"
            v-model="nameSearch"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-card color="grey-lighten-4" flat rounded="0">
      <v-toolbar>
        <v-spacer></v-spacer>
        <v-btn
          v-if="
            ['Add-Group', 'Index-Permission'].every((e) =>
              user.permission.includes(e)
            )
          "
          to="/group/create"
          size="large"
          variant="elevated"
          prepend-icon="mdi-account-multiple-plus-outline"
        >
          مجموعة
        </v-btn>
      </v-toolbar>
      <v-table fixed-header>
        <thead>
          <tr>
            <th>المعرف</th>
            <th>الاسم</th>
            <!-- <th>الوصف</th> -->
            <!-- <th>تاريخ الانشاء</th> -->
            <th>الصلاحيات</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in groupsData" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.group_name }}</td>
            <!-- <td>{{ item.desc }}</td> -->
            <!-- <td>{{ item.created_at }}</td> -->
            <td>
              <v-menu location="bottom center" max-height="500">
                <template v-slot:activator="{ props }">
                  <v-btn rounded="" v-bind="props">
                    عرض: {{ item.permissions?.length ?? 0 }}</v-btn
                  >
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in item.permissions"
                    :key="index"
                    :value="index"
                  >
                    <v-list-item-title>{{
                      getPermissionsById(item).Per_name
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
                      ['Update-Group', 'Index-Permission'].every((e) =>
                        user.permission.includes(e)
                      )
                    "
                    :link="true"
                    :to="`./group/${item.id}/update`"
                  >
                    <v-list-item-title
                      ><div>
                        تعديل
                        <v-icon size="small"> mdi-pencil </v-icon>
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
    <!-- <v-pagination
      v-model="page"
      :length="Math.ceil(groupsData?.count / 10)"
      rounded="circle"
    ></v-pagination> -->
  </div>
</template>

<script setup>
import debounce from "lodash.debounce";
import { baseURL } from "../../helpers";
const route = useRoute();
const { userToken, user } = useAuth();
const nameQuery = route.query.name ? route.query.name : "";
const nameSearch = ref(nameQuery);
const _nameSearch = debounce(async () => {
  navigateTo({
    query: { name: nameSearch.value },
  });
  await refresh();
}, 500);
watch(nameSearch, (value) => {
  _nameSearch();
});
// const pageQuery = route.query.page ? parseInt(route.query.page) : 1;
// const page = ref(pageQuery);
// watch(page, async (newPage) => {
//   navigateTo({ query: { page: newPage } });
//   refresh();
// });
definePageMeta({
  layout: "auth",
  // middleware: "auth",
});
const [{ data: groupsData, refresh }, { data: permissionsData }] =
  await Promise.all([
    useAsyncData("getCities", () =>
      $fetch(`${baseURL}/api/user/group?group_name=${nameSearch.value}`, {
        headers: { Authorization: `${userToken.value}` },
        method: "GET",
      })
    ),
    useMyFetch("/api/user/group/permission"),
  ]);
const getPermissionsById = (id) => {
  return permissionsData.value.find((per) => per?.id === id);
};
</script>

<style lang="scss" scoped></style>
