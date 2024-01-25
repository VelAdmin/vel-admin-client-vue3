import {request} from "@/utils/request.ts";

export function getMenuNodeApi() {
  return request({
    url: "node/getMenuNode",
    method: "get"
  })
}


export function getMenuNodeBySelfApi() {
  return request({
    url: "node/getMenuNodeBySelf",
    method: "get"
  })
}
