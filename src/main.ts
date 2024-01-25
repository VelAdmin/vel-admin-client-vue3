import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store"

import "@/router/permission"
import ElementPlus from "element-plus"

import "element-plus/dist/index.css"
import './style/index.scss'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(ElementPlus)
router.isReady().then(() => {
  app.mount("#app")
})

