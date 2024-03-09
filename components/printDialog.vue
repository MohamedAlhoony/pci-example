<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent fullscreen>
      <v-card>
        <v-card-title
          ><div
            :style="{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }"
          >
            <div>التاريخ:&nbsp;{{ dateFormat(new Date(), "dd-mm-yyyy") }}</div>
            <div>
              <img width="200" src="../assets/images/moamalat_logo.png" />
            </div>
          </div>
          <h2 class="text-center">{{ title }}</h2>
        </v-card-title>
        <v-card-text>
          <div class="mt-5">
            <slot />
          </div>
        </v-card-text>
        <v-card-actions :style="{ position: 'fixed', bottom: 0, left: '3rem' }">
          <v-spacer></v-spacer>
          <v-btn id="cancelPrintButton" variant="text" @click="closeDialog">
            الغاء
          </v-btn>
          <v-btn
            id="printButton"
            @click="print()"
            color="primary"
            variant="elevated"
            size="large"
          >
            طباعة
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { dateFormat } from "../helpers";
const print = () => {
  window.print();
};
const { dialog, closeDialog, openDialog, title } = usePrintDialog();
const pdfSection = (ref < HTMLElement) | (null > null);
</script>

<style>
@media print {
  #printButton,
  #cancelPrintButton,
  #snackBar *,
  ::-webkit-scrollbar {
    display: none !important;
  }
}
</style>
