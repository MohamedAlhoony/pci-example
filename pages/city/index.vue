<template>
  <div>
    <h1 class="mb-5">المدن</h1>
    <v-card color="grey-lighten-4" flat rounded="0">
      <v-toolbar>
        <v-spacer></v-spacer>
        <v-btn
          to="/city/create"
          size="large"
          variant="elevated"
          prepend-icon="mdi-plus"
        >
          مدينة
        </v-btn>
      </v-toolbar>
      <v-table fixed-header>
        <thead>
          <tr>
            <th>المعرف</th>
            <th>الاسم</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cityData" :key="item.id">
            <td>{{ item.city_id }}</td>
            <td>{{ item.city_name }}</td>
            <!-- <td>
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
            </td> -->
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
const { data: cityData } = await useAsyncData("getCities", () =>
  $fetch(`http://192.168.12.38:8086/api/city/get`, {
    headers: { Authorization: `${userToken.value}` },
    method: "GET",
  })
);
</script>

<style lang="scss" scoped></style>
