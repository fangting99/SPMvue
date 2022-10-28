<!-- root component -->
<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<!-- output of html -->
<template>
  <div class="container-fluid">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/LJhome">Learner</RouterLink>
      <RouterLink to="/hrHome">HR</RouterLink>
    </nav>

  </div>


  <RouterView />
</template>

<style>


</style>
