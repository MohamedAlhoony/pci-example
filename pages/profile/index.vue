<template>
  <div>
    <h1 class="mb-5">الحساب الشخصي</h1>
    <v-row>
      <v-col cols="12">
        <v-toolbar>
          <v-spacer></v-spacer>
          <v-btn
            v-if="user.permission.includes('Update-password')"
            to="/profile/change-password"
            size="large"
            variant="elevated"
            prepend-icon="mdi-account-lock"
          >
            اعادة تعيين كلمة السر
          </v-btn>
        </v-toolbar>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="h-100" prepend-icon="mdi-account">
          <template v-slot:title>الاسم</template>
          <v-card-text class="text-subtitle-1">
            {{ user.data.F_name + " " + user.data.L_Name }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="h-100" prepend-icon="mdi-account">
          <template v-slot:title>اسم المستخدم</template>

          <v-card-text class="text-subtitle-1">
            {{ user.data.user_name }}
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col cols="12" md="6" lg="4">
        <v-card class="h-100" prepend-icon="mdi-email">
          <template v-slot:title> البريد الالكتروني </template>

          <v-card-text class="text-subtitle-1"> {{ user.email }} </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card class="h-100" prepend-icon="mdi-phone" height="100">
          <template v-slot:title>الهاتف</template>

          <v-card-text class="text-subtitle-1"> {{ user.phone }} </v-card-text>
        </v-card>
      </v-col> -->
      <v-col cols="12" md="6" lg="4">
        <v-card class="h-100" prepend-icon="mdi-lock">
          <template v-slot:title>الصلاحيات</template>
          <v-card-actions>
            <v-btn
              size="large"
              :prepend-icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="show = !show"
            >
              عرض
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>

              <v-card-text class="text-subtitle-1">
                &nbsp;&nbsp;<span
                  class="text-subtitle-1"
                  v-for="item in user.permission"
                  ><strong>{{ item }}</strong> &nbsp;&nbsp;</span
                >
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const { user } = useAuth();
definePageMeta({
  layout: "auth",
});
const show = ref(false);
</script>

<style lang="scss" scoped></style>
