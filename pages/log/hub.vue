<template>
  <template>
    <v-row justify="center">
      <v-dialog v-model="dialog" width="auto">
        <v-card>
          <v-card-title> التفاصيل </v-card-title>
          <v-card-text>
            <v-locale-provider :rtl="false">
              <pre>{{ dialogData }}</pre>
            </v-locale-provider>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialog = false"> اغلاق </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>
  <div>
    <loader v-if="loading || userDataPending" />
    <h1 class="mb-5">Hub Logs</h1>
    <v-container>
      <v-row> </v-row>
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
            <th>id</th>
            <th>create date</th>
            <th>method</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in userData?.results" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              {{ dateFormat(item.created_at, "yyyy-mm-dd h:MM TT") }}
            </td>
            <td>{{ item.method }}</td>
            <td>
              <v-btn
                @click="
                  () => {
                    dialogData = item;
                    dialog = true;
                  }
                "
                variant="link"
                >التفاصيل</v-btn
              >
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
import { baseURL, dateFormat } from "~~/helpers";
const route = useRoute();
const dialog = ref(false);
const { userToken, user } = useAuth();
const pageQuery = route.query.page ? parseInt(route.query.page) : 1;
const page = ref(pageQuery);
watch(page, async (newPage) => {
  navigateTo({
    query: {
      page: newPage,
    },
  });
  refresh();
});
const { snackbar } = useSnackbar();

definePageMeta({
  layout: "auth",
});
const { data: shortUsers } = await useAsyncData("getShortUsers", () =>
  $fetch(`${baseURL}/api/user/short`, {
    headers: { Authorization: `${userToken.value}` },
  })
);
const {
  data: userData,
  pending: userDataPending,
  refresh,
} = await useAsyncData(
  "getLogs",
  () =>
    $fetch(`${baseURL}/api/logs/hub`, {
      headers: { Authorization: `${userToken.value}` },
      method: "GET",
      query: {
        page: page.value,
      },
    }),

  { watch: [page] }
);
</script>

<style lang="scss" scoped></style>
