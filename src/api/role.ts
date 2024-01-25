import { request } from "@/utils/request"

/** 增 */
export function createRoleApi(data: any) {
  return request({
    url: "role/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteRoleApi(data: any) {
  return request({
    url: `role/del`,
    method: "post",
    data
  })
}

/** 改 */
export function updateRoleApi(data: any) {
  return request({
    url: "role/update",
    method: "post",
    data
  })
}

/**
 * 查询所有角色
 */
export function getRoleListApi() {
  return request<any>({
    url: "role/all",
    method: "get"
  })
}

/**
 * 获取角色列表【分页】
 */
export function getAllRoleApi(params: any) {
  return request<any>({
    url: "role/list",
    method: "get",
    params
  })
}
