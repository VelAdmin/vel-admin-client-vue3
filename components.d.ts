export {}

declare module 'vue' {
  export interface GlobalComponents {
    ElAvatar: typeof import('element-plus/es')['ElAvatar']
    ElBacktop: typeof import('element-plus/es')['ElBacktop']
    ElBreadcrumb: typeof import('element-plus/es')['ElBreadcrumb']
    ElBreadcrumbItem: typeof import('element-plus/es')['ElBreadcrumbItem']
    ElButton: typeof import('element-plus/es')['ElButton']
    ElCard: typeof import('element-plus/es')['ElCard']
    ElConfigProvider: typeof import('element-plus/es')['ElConfigProvider']
    ElDialog: typeof import('element-plus/es')['ElDialog']
    ElDropdown: typeof import('element-plus/es')['ElDropdown']
    ElDropdownItem: typeof import('element-plus/es')['ElDropdownItem']
    ElDropdownMenu: typeof import('element-plus/es')['ElDropdownMenu']
    ElForm: typeof import('element-plus/es')['ElForm']
    ElFormItem: typeof import('element-plus/es')['ElFormItem']
    ElIcon: typeof import('element-plus/es')['ElIcon']
    ElInput: typeof import('element-plus/es')['ElInput']
    ElMenu: typeof import('element-plus/es')['ElMenu']
    ElMenuItem: typeof import('element-plus/es')['ElMenuItem']
    ElPagination: typeof import('element-plus/es')['ElPagination']
    ElSubMenu: typeof import('element-plus/es')['ElSubMenu']
    ElSwitch: typeof import('element-plus/es')['ElSwitch']
    ElTable: typeof import('element-plus/es')['ElTable']
    ElTableColumn: typeof import('element-plus/es')['ElTableColumn']
    ElTag: typeof import('element-plus/es')['ElTag']
    ElTooltip: typeof import('element-plus/es')['ElTooltip']
    HelloWorld: typeof import('./src/components/HelloWorld.vue')['default']
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
  }
  export interface ComponentCustomProperties {
    vLoading: typeof import('element-plus/es')['ElLoadingDirective']
  }
}
