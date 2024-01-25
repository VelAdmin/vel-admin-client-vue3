<template>
  <el-menu
      router
      unique-opened
      :collapse="props.isCollapse"
      class="horizontal-header-menu"
      :default-active="defaultActive"
  >
    <SideBarItem
        v-for="route in permissionStore.routes"
        :key="route.path"
        :is-collapse="props.isCollapse"
        :item="route"
        :base-path="route.path"
    />
  </el-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from "vue-router";
import { usePermissionStore } from "@/store/modules/permission.ts"
import SideBarItem from "@/layout/components/SideBarItem/SideBarItem.vue";

interface Props {
  isCollapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCollapse: false,
})

const route = useRoute()
const permissionStore = usePermissionStore()

const defaultActive = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})


</script>

<style lang="scss" scoped src="./Menu.scss"></style>
