<template>
  <v-dialog :scrollable="true" max-width="1500" v-model="props.dialog">
    <v-card class="pa-5">
      <v-progress-linear
        v-if="dialogLoading"
        indeterminate
        color="black"
        class="mb-0"
      ></v-progress-linear>
      <v-card-title>
        <h2>تقرير الطلب</h2>
      </v-card-title>
      <v-card-text>
        <v-toolbar color="transparent" class="mb-5">
          <v-chip size="large" class="ma-2" color="blue"
            >عدد البطاقات الكلي: {{ data?.total }}
          </v-chip>
          <v-chip size="large" class="ma-2" color="green"
            >عدد البطاقات الصحيحة: {{ data?.total - data?.total_error }}
          </v-chip>
          <v-chip size="large" class="ma-2" color="red"
            >عدد البطاقات الخطأ: {{ data?.total_error }}
          </v-chip>
        </v-toolbar>
        <h4 class="mb-1">البطاقات الخطأ:</h4>
        <v-table fixed-header>
          <thead>
            <tr>
              <th>رقم الدفعة</th>
              <th>اسم الملف</th>
              <th>pan</th>
              <th>رقم الحساب</th>
              <th>معرف الفرع</th>
              <th>تاريخ انتهاء الصلاحية</th>
              <th>effdate</th>
              <th>رمز الخدمة</th>
              <th>cvc</th>
              <th>embossname</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data?.error" :key="item.file_name">
              <td>{{ item.batch_no }}</td>
              <td>{{ item.file_name }}</td>
              <td>{{ item.pan }}</td>
              <td>{{ item.accno }}</td>
              <td>{{ item.branch_id }}</td>
              <td>{{ item.expdate }}</td>
              <td>{{ item.effdate }}</td>
              <td>{{ item.service_code }}</td>
              <td>{{ item.cvc }}</td>
              <td>{{ item.embossname }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="dialogLoading" variant="text" @click="toggleDialog">
          اغلاق
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  dialog: {
    required: true,
    type: Boolean,
  },
  toggleDialog: {
    required: true,
    type: Function,
  },
  data: {
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
