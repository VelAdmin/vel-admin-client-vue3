<template>
  <div class="login-container">
    <img class="welcome-icon" src="../../assets/welcome.svg" alt=""/>
    <div class="login-box">
      <div class="login-form">
        <img class="logo" src="/logo.png" alt=""/>
        <h2>HAdmin</h2>
        <el-form ref="loginFormRef" size="large" :model="loginData" :rules="loginFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="phone">
            <el-input :prefix-icon="User" v-model="loginData.phone" placeholder="请输入"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" show-password v-model="loginData.password" placeholder="请输入"/>
          </el-form-item>
          <el-form-item prop="code">
            <el-input :prefix-icon="Key" v-model="loginData.code" placeholder="请输入">
              <template #append>
                <el-image :src="codeUrl" @click="createCode" draggable="false"></el-image>
              </template>
            </el-input>
          </el-form-item>
          <el-button class="btn" :loading="loading" type="primary" @click.prevent="handleLogin">登 录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {FormInstance} from "element-plus";
import {Key, User, Lock} from "@element-plus/icons-vue";
import {getLoginCodeApi} from "@/api/login.ts";
import {useUserStore} from "@/store/modules/user.ts";
import {useRouter} from "vue-router";

const router = useRouter()

const loginFormRef = ref<FormInstance | null>(null)
/** 登录表单数据 */
const loginData: any = reactive({
  phone: "11122223333",
  password: "123456",
  code: ""
})

/** 登录按钮 Loading */
const loading = ref(false)

/** 登录表单校验规则 */
const loginFormRules: any = {
  username: [{required: true, message: "请输入用户名", trigger: "blur"}],
  password: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"}
  ],
  code: [{required: true, message: "请输入验证码", trigger: "blur"}]
}
/** 验证码图片 URL */
const codeUrl = ref("")
/** 创建验证码 */
const createCode = () => {
  // 先清空验证码的输入
  loginData.code = ""
  // 获取验证码
  codeUrl.value = ""
  getLoginCodeApi().then((res) => {
    codeUrl.value = res.data
  })
}

/** 初始化验证码 */
createCode()

const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useUserStore().login(loginData)
          .then(() => {
            router.push({ path: "/" })
          })
          .catch(() => {
            createCode()
          })
          .finally(() => {
            loading.value = false
          })
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

</script>

<style lang="scss" scoped src="./login.scss"></style>
