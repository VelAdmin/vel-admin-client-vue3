import {shallowRef} from "vue";
import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import Layout from "@/layout/index.vue"
import {HomeFilled, UserFilled} from "@element-plus/icons-vue";

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    redirect: "/welcome",
    children: [
      {
        path: "welcome",
        name: "Welcome",
        component: () => import("@/views/welcome/welcome.vue"),
        meta: {
          title: "工作台",
          elIcon: shallowRef(HomeFilled),
          isOneChild: true,
          affix: true
        }
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/login.vue"),
    meta: {
      hidden: true
    }
  },
];


/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/account",
    component: shallowRef(Layout),
    redirect: "/account/admin",
    name: "Account",
    meta: {
      title: "账户管理",
      roleKey: 'account',
      elIcon: shallowRef(UserFilled)
    },
    children: [
      {
        path: "admin",
        component: () => import("@/views/account/admin/index.vue"),
        name: "Admin",
        meta: {
          title: "用户管理",
          roleKey: 'admin',
          keepAlive: true
        }
      },
      {
        path: "role",
        component: () => import("@/views/account/role/index.vue"),
        name: "Role",
        meta: {
          title: "角色管理",
          roleKey: 'role',
          keepAlive: true
        }
      }
    ]
  },
]


const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes: constantRoutes,
})

export default router;
