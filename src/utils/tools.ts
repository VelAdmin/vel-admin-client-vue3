import {isExternal} from "@/utils/validate.ts";
import path from "path-browserify"
import moment from "momnet";

// 解析路径
export const resolvePath = (routePath: string, basePath: string) => {
  switch (true) {
    case isExternal(routePath):
      return routePath
    case isExternal(basePath):
      return basePath
    default:
      return path.resolve(basePath, routePath)
  }
}

// 格式化时间
export const formatTime = (time: number) => {
  return moment(time * 1000).format('YYYY-MM-DD HH:MM:ss')
}
