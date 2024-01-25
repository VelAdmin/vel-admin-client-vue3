<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="角色名">
          <el-input v-model="searchData.name" placeholder="请输入" />
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
          <el-button type="primary" :icon="CirclePlus" @click="openAddAdmin">新增角色</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="角色名" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" align="center" >
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
        :title="currentUpdateId === undefined ? '新增角色' : '修改角色'"
        @close="resetForm"
        width="40%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" label-position="left">
        <el-form-item prop="name" label="角色名">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="node" label="权限点">
          <el-tree-select
              v-model="formData.node"
              :data="nodeData"
              multiple
              :render-after-expand="false"
              show-checkbox
              check-strictly
              check-on-click-node
          />
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
import { reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { formatTime } from "@/utils/tools.ts";
import {createRoleApi, deleteRoleApi, getAllRoleApi, updateRoleApi} from "@/api/role.ts";
import {getMenuNodeApi} from "@/api/node.ts";

defineOptions({
  // 命名当前组件
  name: "Role"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const getDefaultData = () => {
  return {
    name: "",
    node: "",
    status: 1
  }
}


const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive<any>(getDefaultData())
const formRules: FormRules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入角色名" }],
})

// 打开添加弹窗
const openAddAdmin = () => {
  formData.value = getDefaultData()
  dialogVisible.value = true
}

// 创建
const handleCreate = () => {
  formRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        const params = {
          ...formData,
          node: formData.node.toString()
        }
        const createRes: any = await createRoleApi(params)
        if (createRes.code === 0) {
          ElMessage.success("新增成功")
          getTableData()
        } else {
          ElMessage.success("新增失败")
        }
        dialogVisible.value = false
      } else {
        const params = {
          ...formData,
          id: currentUpdateId.value,
          node: formData.node.toString()
        }
        const updateRes: any = await updateRoleApi(params)
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
  formData.name = ""
  formData.node = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除角色：${row.username}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteRoleApi({id: row.id}).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion


const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id
  formData.name = row.name
  formData.node = row.node
  formData.status = row.status
  dialogVisible.value = true
}

const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
})
const getTableData = async () => {
  loading.value = true
  const params = {
    page: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    name: searchData.name || undefined
  }
  const res: any = await getAllRoleApi(params)
  if (res.code === 0) {
    paginationData.total = res.data.total
    tableData.value = res.data.list.map((i: any) => {
      return {
        ...i,
        node: i.node.split(',').map((i: any) => Number(i))
      }
    })
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

const nodeData = ref<any>([])
const initData = async () => {
  const res: any = await getMenuNodeApi()
  if (res.code === 0) {
    nodeData.value = res.data
  }
}
initData()

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<style lang="scss"  src="./index.scss" scoped></style>
