import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import {loginApi} from "@/api/login.ts";
import {getToken, removeToken, setToken} from "@/utils/cookies.ts";
import {getUserinfo, removeUserinfo, setUserinfo} from "@/utils/localStorage.ts";
import {getMenuNodeBySelfApi} from "@/api/node.ts";


export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const userinfo = ref<any>(getUserinfo() || {})
  const nodeList = ref<string[] | string>([])

  const getNodeList = async () => {
    const res: any = await getMenuNodeBySelfApi()
    if (res.code === 0) {
      nodeList.value = res.data
    }
  }

  // 登录
  const login = async (params: any) => {
    const res: any = await loginApi(params)
    if (res.code === 0) {
      setToken(res.data.token)
      token.value = res.data.token
      userinfo.value = res.data.user
      setUserinfo(res.data.user)
    }
  }
  // 退出登录
  const logout = () => {
    removeToken()
    removeUserinfo()
    token.value = ""
    userinfo.value = {}
  }

  return { userinfo, nodeList, getNodeList, login, logout }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
