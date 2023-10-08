import TableEdit from './components/tableEdit.vue'
import TableForm from './components/tableForm.vue'
import DragProgress from './components/dragProgress.vue'
import TableUpload from './components/tableUpload.vue'


const components = [
  TableEdit,
  TableForm,
  DragProgress,
  TableUpload
]

const install = function (Vue) { // 遍历注册全局组件 
  if (install.installed) return
  install.installed = true
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

// 判断是否直接引入文件，如果是，就不用调用Vue.use()
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// 导出的对象必须具有 install，才能被 Vue.use() 方法安装 
export default install
