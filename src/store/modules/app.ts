import { reactive, watch } from "vue"
import { defineStore } from "pinia"
import { getSidebarStatus, setSidebarStatus } from "@/utils/localStorage"
import { SIDEBAR_OPENED, SIDEBAR_CLOSED } from "@/constants/appKey"

interface Sidebar {
  opened: boolean
  withoutAnimation: boolean
}

/** 设置侧边栏状态本地缓存 */
function handleSidebarStatus(opened: boolean) {
  opened ? setSidebarStatus(SIDEBAR_OPENED) : setSidebarStatus(SIDEBAR_CLOSED)
}

export const useAppStore = defineStore("app", () => {
  /** 侧边栏状态 */
  const sidebar: Sidebar = reactive({
    opened: getSidebarStatus() !== SIDEBAR_CLOSED,
    withoutAnimation: false
  })

  /** 监听侧边栏 opened 状态 */
  watch(
    () => sidebar.opened,
    (opened) => handleSidebarStatus(opened)
  )

  /** 切换侧边栏 */
  const toggleSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = withoutAnimation
  }
  /** 关闭侧边栏 */
  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
  }


  return { sidebar, toggleSidebar, closeSidebar }
})
