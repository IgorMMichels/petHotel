<script setup>
import { RouterView } from 'vue-router';
import AppNavbar from './appNavbar.vue';
import AppSidebar from './appSidebar.vue';
</script>

<template>
  <AppNavbar />
  <div class="container-fluid">
    <div class="row">
      <aside class="col-md-3"></aside>
    </div>
  </div>
</template>
