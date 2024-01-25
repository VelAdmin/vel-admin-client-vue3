<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.isCollapse }">
    <transition name="sidebarLogoFade">
      <router-link
          v-if="props.isCollapse"
          key="collapse"
          :title="title"
          class="sidebar-logo-link"
          :to="path"
      >
        <img class="sidebar-logo" src="/logo.png" alt="logo" />
        <span class="sidebar-title">{{ title }}</span>
      </router-link>
      <router-link
          v-else
          key="expand"
          :title="title"
          class="sidebar-logo-link"
          :to="path"
      >
        <img class="sidebar-logo" src="/logo.png" alt="logo" />
        <span class="sidebar-title">{{ title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts" setup>

import {ADMIN_PATH, PROJECT_NAME} from "@/config/config.ts";

const props = defineProps({
  isCollapse: Boolean
});

const title = PROJECT_NAME
const path = ADMIN_PATH

</script>

<style lang="scss" scoped src="./Logo.scss"></style>
