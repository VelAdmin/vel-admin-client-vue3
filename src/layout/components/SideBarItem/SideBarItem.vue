<template>
  <div
      v-if="!props.item.meta?.hidden"
      :class="{ 'simple-mode': props.isCollapse && !isTop, 'first-level': props.isFirstLevel }"
  >
    <template v-if="theOnlyOneChild">
      <SideBarItemLink v-if="theOnlyOneChild.meta && !theOnlyOneChild.children" :to="resolvePath(theOnlyOneChild.path)">
        <el-menu-item :index="resolvePath(theOnlyOneChild.path)">
          <component :is="theOnlyOneChild.meta.elIcon" class="el-icon" />
          <template v-if="theOnlyOneChild.meta.title" #title>
            {{ theOnlyOneChild.meta.title }}
          </template>
        </el-menu-item>
      </SideBarItemLink>
    </template>
    <el-sub-menu v-else :index="resolvePath(props.item.path)" teleported>
      <template #title>
        <component :is="props.item?.meta?.elIcon" class="el-icon" />
        <span v-if="props.item.meta?.title">{{ props.item.meta?.title }}</span>
      </template>
      <template v-if="props.item.children">
        <SideBarItem
            v-for="child in props.item.children"
            :key="child.path"
            :item="child"
            :is-collapse="props.isCollapse"
            :is-first-level="false"
            :base-path="resolvePath(child.path)"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { type RouteRecordRaw } from "vue-router"
import { isExternal } from "@/utils/validate.ts"
import path from "path-browserify"
import SideBarItemLink from "@/layout/components/SideBarItemLink/SideBarItemLink.vue";

interface Props {
  item: RouteRecordRaw
  isCollapse?: boolean
  isTop?: boolean
  isFirstLevel?: boolean
  basePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  isCollapse: false,
  isTop: false,
  isFirstLevel: true,
  basePath: ""
})

/** 显示的子菜单 */
const showingChildren = computed(() => {
  return props.item.children?.filter((child) => !child.meta?.hidden) ?? []
})

/** 显示的子菜单数量 */
const showingChildNumber = computed(() => {
  return showingChildren.value.length
})

/** 唯一的子菜单项 */
const theOnlyOneChild = computed(() => {
  const number = showingChildNumber.value
  switch (true) {
    case number > 1:
      return null
    case number === 1 && showingChildren.value[0].meta?.isOneChild:
      return showingChildren.value[0]
    default:
      return { ...props.item, path: "" }
  }
})

/** 解析路径 */
const resolvePath = (routePath: string) => {
  switch (true) {
    case isExternal(routePath):
      return routePath
    case isExternal(props.basePath):
      return props.basePath
    default:
      return path.resolve(props.basePath, routePath)
  }
}
</script>

<style lang="scss" src="./SideBarItem.scss" scoped>

</style>
