<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.username" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="openAddAdmin">新增用户</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle/>
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="username" label="用户名" align="center"/>
          <el-table-column prop="roles" label="角色" align="center">
            <template #default="scope">
              <span>{{ getCurRole(scope.row.role_id) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" align="center"/>
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" align="center">
            <template #default="scope">
              <span>{{ formatTime(scope.row.create_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
            background
            :layout="paginationData.layout"
            :page-sizes="paginationData.pageSizes"
            :total="paginationData.total"
            :page-size="paginationData.pageSize"
            :currentPage="paginationData.currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
        v-model="dialogVisible"
        :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
        @close="resetForm"
        width="40%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" label-position="left">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="username" label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="role_id" label="角色">
          <el-select v-model="formData.role_id" placeholder="请选择角色">
            <el-option
                v-for="item in roleData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="currentUpdateId === undefined">
          <el-input v-model="formData.password" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="username" label="状态">
          <el-switch
              v-model="formData.status"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
              :active-value="1"
              :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from "vue"
import {createAdminApi, deleteAdminApi, updateAdminApi, getAllAdminApi} from "@/api/admin"
import {type FormInstance, type FormRules, ElMessage, ElMessageBox} from "element-plus"
import {Search, Refresh, CirclePlus, Download, RefreshRight} from "@element-plus/icons-vue"
import {usePagination} from "@/hooks/usePagination"
import {formatTime} from "@/utils/tools.ts";
import {getRoleListApi} from "@/api/role.ts";

defineOptions({
  // 命名当前组件
  name: "Admin"
})

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()

const getDefaultData = () => {
  return {
    username: "",
    phone: "",
    password: "",
    status: 1
  }
}


const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive<any>(getDefaultData())
const formRules: FormRules = reactive({
  username: [{required: true, trigger: "blur", message: "请输入用户名"}],
  phone: [{required: true, trigger: "blur", message: "请输入手机号"}],
  password: [{required: true, trigger: "blur", message: "请输入密码"}]
})

// 打开添加弹窗
const openAddAdmin = () => {
  const defaultData: any = getDefaultData()
  formData.username = defaultData.username
  formData.phone = defaultData.phone
  formData.status = defaultData.status
  formData.role_id = defaultData.role_id
  formData.password = defaultData.password
  dialogVisible.value = true
}

// 创建
const handleCreate = () => {
  formRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        const createRes: any = await createAdminApi(formData)
        if (createRes.code === 0) {
          ElMessage.success("新增成功")
          getTableData()
        } else {
          ElMessage.success("新增失败")
        }
        dialogVisible.value = false
      } else {
        const params = {
          id: currentUpdateId.value,
          ...formData
        }
        const updateRes: any = await updateAdminApi(params)
        if (updateRes.code === 0) {
          ElMessage.success("修改成功")
          getTableData()
        } else {
          ElMessage.success("修改失败")
        }
        dialogVisible.value = false
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  const defaultData: any = getDefaultData()
  formData.username = defaultData.username
  formData.phone = defaultData.phone
  formData.status = defaultData.status
  formData.role_id = defaultData.role_id
  formData.password = defaultData.password
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteAdminApi({id: row.id}).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion


const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id
  formData.username = row.username
  formData.phone = row.phone
  formData.status = row.status
  formData.role_id = row.role_id
  dialogVisible.value = true
}

const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  username: "",
  phone: ""
})
const getTableData = async () => {
  loading.value = true
  const params = {
    page: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    username: searchData.username || undefined,
    phone: searchData.phone || undefined
  }
  const res: any = await getAllAdminApi(params)
  if (res.code === 0) {
    paginationData.total = res.data.total
    tableData.value = res.data.list
  } else {
    tableData.value = []
  }
  loading.value = false
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

const roleData = ref<any>([])
const initData = async () => {
  const res: any = await getRoleListApi()
  if (res.code === 0) {
    roleData.value = res.data
  }
}
initData()

const getCurRole = (role_id: number) => {
  const findOne = roleData.value.find((i: any) => i.value === role_id)
  if (findOne) {
    return findOne.label
  } else {
    return '未知'
  }
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {immediate: true})
</script>

<style lang="scss" src="./index.scss" scoped></style>
