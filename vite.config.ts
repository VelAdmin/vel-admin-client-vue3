import {ConfigEnv, loadEnv, UserConfigExport} from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";


// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

// 设置别名
const alias: Record<string, string> = {
  "@": pathResolve("src"),
};

// https://vitejs.dev/config/
export default (configEnv: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as any
  const { VITE_PUBLIC_PATH, VITE_APP_PORT,VITE_BASE_API } = viteEnv
  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias
    },
    server: {
      /** 是否开启 HTTPS */
      https: false,
      /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
      host: true, // host: "0.0.0.0"
      /** 端口号 */
      port: VITE_APP_PORT,
      /** 是否自动打开浏览器 */
      open: false,
      /** 跨域设置允许 */
      cors: true,
      /** 端口被占用时，是否直接退出 */
      strictPort: false,
      /** 接口代理 */
      proxy: {
        "/api": {
          target: VITE_BASE_API,
          /** 是否允许跨域 */
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    plugins: [
      vue()
    ],
  }
}
