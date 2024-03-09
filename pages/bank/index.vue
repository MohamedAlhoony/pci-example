<template>
  <div>
    <h1 class="mb-5">المصارف</h1>
    <v-card color="grey-lighten-4" flat rounded="0">
      <v-toolbar>
        <v-spacer></v-spacer>
        <v-btn
          v-if="user?.permission.includes('Add-Bank')"
          to="/bank/create"
          size="large"
          variant="elevated"
          prepend-icon="mdi-plus"
        >
          مصرف
        </v-btn>
      </v-toolbar>
      <v-table fixed-header>
        <thead>
          <tr>
            <th>المعرف</th>
            <th>الاسم</th>
            <th>رمز المصرف</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!banks?.length">
            <td class="text-center" colspan="18">لايوجد نتائج</td>
          </tr>
          <tr v-for="item in banks" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.bank_name }}</td>
            <td>{{ item.BANK_CODE }}</td>
            <!-- <td>
              <v-btn
                v-if="user?.permission.includes('Index-Branch')"
                color="primary"
                :href="`/bank/${item.id}/branch`"
                >الفروع</v-btn
              >
            </td> -->
            <td>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                </template>

                <v-list>
                  <v-list-item
                    v-if="user?.permission.includes('Update-Bank')"
                    :link="true"
                    :to="`/bank/${item.id}/update`"
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
const { userToken, user } = useAuth();
const route = useRoute();
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
const [{ data: banks, refresh }] = await Promise.all([
  useMyFetch(() => `/api/bank/get`),
]);
</script>

<style lang="scss" scoped></style>
