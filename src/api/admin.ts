import { request } from "@/utils/request"

/** 增 */
export function createAdminApi(data: any) {
  return request({
    url: "admin/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteAdminApi(data: any) {
  return request({
    url: `admin/del`,
    method: "post",
    data
  })
}

/** 改 */
export function updateAdminApi(data: any) {
  return request({
    url: "admin/update",
    method: "post",
    data
  })
}

/**
 * 查询账号信息
 */
export function getAdminApi() {
  return request<any>({
    url: "admin/get",
    method: "get"
  })
}

/**
 * 获取所有账号列表
 */
export function getAllAdminApi(params: any) {
  return request<any>({
    url: "admin/list",
    method: "get",
    params
  })
}
