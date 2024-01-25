import {request} from "@/utils/request.ts";

export function getLoginCodeApi() {
  return request({
    url: "admin/code",
    method: "get"
  })
}

export function loginApi(params: any) {
  return request({
    url: "admin/login",
    method: "post",
    data: params
  })
}
