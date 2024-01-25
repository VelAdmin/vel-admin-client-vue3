import router from "@/router/index.ts";
import {usePermissionStoreHook} from "@/store/modules/permission";
import {setRouteChange} from "@/hooks/useRouteListener.ts";
import {getToken} from "@/utils/cookies.ts";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/store/modules/user.ts";

router.beforeEach(async (to, _from, next) => {
  const token = getToken()

  // 判断该用户是否已经登录
  if (!token) {
    // 其他没有访问权限的页面将被重定向到登录页面
    next("/login")
    return
  }

  // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    return next({ path: "/" })
  }

  try {
    // 计算动态用户权限
    await useUserStore().getNodeList()
    const nodeList = useUserStore().nodeList
    const permissionStore = usePermissionStoreHook()
    permissionStore.setRoutes(nodeList)
    // 将'有访问权限的动态路由' 添加到 Router 中
    permissionStore.dynamicRoutes.forEach((route) => router.addRoute(route))
    next()
  } catch (err: any) {
    // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
    useUserStore().logout()
    ElMessage.error(err.message || "路由守卫过程发生错误")
    next("/login")
  }
})

router.afterEach((to) => {
  setRouteChange(to)
})
