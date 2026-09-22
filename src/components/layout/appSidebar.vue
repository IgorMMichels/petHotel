<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>
  <nav>
    <div class="flex-collumn nav-pills gap-1" >
      <router-link to="/pets/novo">
        <i class="bi bi-plus-circle me-2">

        </i>
        Novo Pet
      </router-link>
    </div>
  </nav>
</template>
