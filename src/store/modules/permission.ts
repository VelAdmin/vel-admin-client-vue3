import store from "@/store";
import { ref } from "vue"
import {RouteRecordRaw} from "vue-router";
import { defineStore } from "pinia"
import {asyncRoutes, constantRoutes} from "@/router";

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  const roleKey = route.meta?.roleKey as string;
  return roleKey ? roles.includes(roleKey) : false
}

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[] | string) => {
  if (roles === '#') { // 超级管理员拥有所有权限
    return routes;
  }
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles as string[], tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterAsyncRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([])
  const dynamicRoutes = ref<RouteRecordRaw[]>([])

  // 调整路由
  const setRoutes = (roles: string[] | string) => {
    const accessedRoutes =  filterAsyncRoutes(asyncRoutes, roles)
    routes.value = constantRoutes.concat(accessedRoutes)
    dynamicRoutes.value = accessedRoutes
  }

  return { routes, dynamicRoutes, setRoutes }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
