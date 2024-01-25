<template>
  <div :class="layoutClasses" class="app-wrapper">
    <!-- 左侧menu -->
    <SideBar></SideBar>
    <!-- 右侧 -->
    <div class="main-container">
      <div class="layout-header">
        <NavBar />
        <TagBar />
      </div>
      <!-- 内容区 -->
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import SideBar from "@/layout/components/SideBar/SideBar.vue";
import NavBar from "@/layout/components/NavBar/NavBar.vue";
import TagBar from "@/layout/components/TagBar/TagBar.vue";
import AppMain from "@/layout/components/AppMain/AppMain.vue";
import {useAppStore} from "@/store/modules/app.ts";

const appStore = useAppStore()

/** 定义计算属性 layoutClasses，用于控制布局的类名 */
const layoutClasses = computed(() => {
  return {
    hideSidebar: !appStore.sidebar.opened,
    openSidebar: appStore.sidebar.opened,
    withoutAnimation: appStore.sidebar.withoutAnimation,
  }
})

</script>

<style lang="scss" src="./index.scss" scoped></style>
