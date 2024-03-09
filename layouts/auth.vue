<template>
  <NuxtLayout name="default">
    <v-navigation-drawer width="290" v-model="drawer" permanent>
      <v-card elevation="0" class="mx-auto pa-2" max-width="290">
        <div>
          <img width="180" src="../assets/images/moamalat_logo.png" />
        </div>
        <v-list>
          <v-list-item
            prepend-icon="mdi-account-circle"
            :title="`${user?.data?.F_name} ${user?.data?.L_Name}`"
            :subtitle="user?.data.user_name"
          >
          </v-list-item>
          <v-list-subheader>الادارات</v-list-subheader>
          <v-list-group v-for="(item, i) in drawerList" :value="item.name">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-if="item.visible"
                :key="i"
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.name"
              ></v-list-item>
            </template>
            <template v-for="(subitem, i) in item.subItems" :key="i">
              <v-list-item
                v-if="subitem.visible"
                :value="subitem.name"
                rounded="xl"
                class="mb-1"
                :to="subitem.link"
                :prepend-icon="subitem.icon"
                active-color="primary"
                :link="true"
                :exact="true"
              >
                {{ subitem.name }}
              </v-list-item>
            </template>
          </v-list-group>
        </v-list>
      </v-card>
      <v-divider></v-divider>
    </v-navigation-drawer>
    <v-main class="pa-0 py-10">
      <v-container>
        <v-app-bar color="primary" density="compact">
          <template v-slot:prepend>
            <v-app-bar-nav-icon
              @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>
          </template>

          <v-app-bar-title> نظام الدفع الفوري</v-app-bar-title>
          <template v-slot:append>
            <v-btn icon @click="toggleTheme">
              <v-icon v-if="theme !== 'light'">mdi-weather-sunset</v-icon>
              <v-icon v-else>mdi-weather-night</v-icon>
            </v-btn>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
              </template>

              <v-list>
                <v-list-item to="/">
                  <v-list-item-title
                    ><div>
                      حسابي الشخصي
                      <v-icon size="small">mdi-account-circle</v-icon>
                    </div></v-list-item-title
                  >
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="handleLogoutClick">
                  <v-list-item-title
                    ><div>
                      تسجيل خروج
                      <v-icon size="small" color="red"> mdi-logout </v-icon>
                    </div></v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-app-bar>
        <NuxtPage />
      </v-container>
    </v-main>
  </NuxtLayout>
</template>

<script setup>
const { logout, user } = useAuth();
const { theme, toggleTheme } = useMyTheme();
const { locale } = useI18n();
const { snackbar } = useSnackbar();

const drawerList = computed(() => [
  {
    name: "ادارة المستخدمين",
    visible:
      ["Index-Users", "Index-Groups", "Add-User"].every((e) =>
        user.value.permission.includes(e)
      ) ||
      ["Add-User", "Index-Groups"].every((e) =>
        user.value.permission.includes(e)
      ),
    subItems: [
      {
        visible: ["Index-Users", "Index-Groups", "Add-User"].every((e) =>
          user.value.permission.includes(e)
        ),
        name: "المستخدمين",
        link: "/user",
      },
      {
        visible: ["Add-User", "Index-Groups"].every((e) =>
          user.value.permission.includes(e)
        ),
        name: "اضافة مستخدم",
        link: "/user/create",
      },
    ],
  },

  {
    name: "ادارة المجموعات",
    visible:
      ["Index-Groups", "Index-Permission", "Add-Group"].every((e) =>
        user.value.permission.includes(e)
      ) ||
      ["Add-Group", "Index-Permission"].every((e) =>
        user.value.permission.includes(e)
      ),
    subItems: [
      {
        visible: ["Index-Groups", "Index-Permission", "Add-Group"].every((e) =>
          user.value.permission.includes(e)
        ),

        name: "المجموعات",
        link: "/group",
      },
      {
        visible: ["Add-Group", "Index-Permission"].every((e) =>
          user.value.permission.includes(e)
        ),
        name: "اضافة مجموعة",
        link: "/group/create",
      },
    ],
  },
  {
    name: "ادارة مستخدمين نظام IPS",
    visible: ["Index-Users-Ips"].every((e) =>
      user.value.permission.includes(e)
    ),
    subItems: [
      {
        visible: ["Index-Users-Ips"].every((e) =>
          user.value.permission.includes(e)
        ),
        name: "مستخدمين IPS",
        link: "/ips-user",
      },
    ],
  },
  {
    visible:
      ["Add-Bank", "Update-Bank"].every((e) =>
        user.value.permission.includes(e)
      ) || user.value?.permission.includes("Add-Bank"),
    name: "ادارة المصارف",
    subItems: [
      {
        visible: ["Add-Bank", "Update-Bank"].every((e) =>
          user.value.permission.includes(e)
        ),
        name: "المصارف",
        link: "/bank",
      },
      {
        visible: user.value?.permission.includes("Add-Bank"),
        name: "اضافة مصرف",
        link: "/bank/create",
      },
    ],
  },
  {
    visible:
      ["Index-Bank-IPS"].every((e) => user.value.permission.includes(e)) ||
      user.value?.permission.includes("Add-Bank-IPS"),
    name: "ادارة مصارف ال IPS",
    subItems: [
      {
        visible: ["Index-Bank-IPS"].every((e) =>
          user.value.permission.includes(e)
        ),
        name: "مصارف IPS",
        link: "/ips-bank",
      },
      {
        visible: user.value?.permission.includes("Add-Bank-IPS"),
        name: "اضافة مصرف",
        link: "/ips-bank/create",
      },
    ],
  },
  {
    name: "ادارة التقارير",
    visible: ["Index-Transaction"].every(
      (e) =>
        user.value.permission.includes(e) ||
        ["Index-Logs"].every((e) => user.value.permission.includes(e))
    ),
    subItems: [
      {
        visible: ["Index-Transaction"].every((e) =>
          user.value.permission.includes(e)
        ),
        name: "الحركات",
        link: "/transaction",
      },
      {
        visible: ["Index-Logs"].every((e) => user.value.permission.includes(e)),
        name: "Hub Logs",
        link: "/log/hub",
      },
      {
        visible: ["Index-Logs"].every((e) => user.value.permission.includes(e)),
        name: "Service Logs",
        link: "/log/service",
      },
    ],
  },
]);
const drawer = useState("drawer", () => null);
const handleLogoutClick = async () => {
  await logout(locale.value);
  snackbar({
    isOpen: true,
    mode: "success",
    content: "تم تسجيل الخروج بنجاح",
  });
};
</script>
