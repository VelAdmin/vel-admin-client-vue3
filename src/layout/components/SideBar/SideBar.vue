<template>
  <div class="side-bar-container">
    <Logo :isCollapse="isCollapse"/>
    <Menu :isCollapse="isCollapse"/>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store/modules/app"
import Logo from "@/layout/components/Logo/Logo.vue";
import Menu from "@/layout/components/Menu/Menu.vue";

const appStore = useAppStore()

const { sidebar } = storeToRefs(appStore)
const isCollapse = computed(() => !sidebar.value.opened)

</script>

<style lang="scss" scoped src="./SideBar.scss"></style>
