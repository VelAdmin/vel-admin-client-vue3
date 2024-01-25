<template>
  <div class="navigation-bar">
    <Hamburger :is-active="sidebar.opened" class="hamburger" @toggle-click="toggleSidebar" />
    <Breadcrumb class="breadcrumb" />
    <div class="right-menu">
      <el-dropdown class="right-menu-item">
        <div class="right-menu-avatar">
          <el-avatar :icon="UserFilled" :size="30" />
          <span>{{ userStore.userinfo.username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <a target="_blank" href="https://github.com/un-pany/v3-admin-vite">
              <el-dropdown-item>GitHub</el-dropdown-item>
            </a>
            <a target="_blank" href="https://gitee.com/un-pany/v3-admin-vite">
              <el-dropdown-item>Gitee</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { useRouter } from "vue-router";
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store/modules/app"
import { useUserStore } from "@/store/modules/user"
import {UserFilled} from "@element-plus/icons-vue";
import Hamburger from "@/layout/components/Hamburger/Hamburger.vue";
import Breadcrumb from "@/layout/components/Breadcrumb/Breadcrumb.vue";

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const { sidebar } = storeToRefs(appStore)

/** 切换侧边栏 */
const toggleSidebar = () => {
  appStore.toggleSidebar(false)
}

/** 登出 */
const logout = () => {
  router.push("/login")
}
</script>

<style lang="scss" scoped src="./NavBar.scss"></style>
