<template>
  <div :class="[size && size === 'normal' ? 'normal' : 'mini']">
    <div v-if="title" class="title">
      <p>{{ title }} <span v-if="required" style="color: red">*</span></p>
    </div>
    <el-table row-key="id" border v-loading="tableLoading" element-loading-text="正在加载数据..." @selection-change="handleSelectionChange" :data="tableList">
      <el-table-column :type="type" label="序号" align="center" />
      <el-table-column v-for="column in columns" :key="column.label" align="center" :width="column.width ? column.width : 'auto'">
        <template slot="header">
          {{ column.label }}
          <span v-if="column.required" style="color: red"> *</span>
        </template>
        <template slot-scope="scope">
          <div>
            <template>
              <!-- 点击当列text跳转链接 -->
              <span
                v-if="(column.type === 'text' && column.linkable) || (column.type === 'input' && componentDisabled && column.linkable)"
                style="font-size: 14px; color: #409eff; cursor: pointer"
                @click="column.clicked(scope.row)"
                >{{ scope.row[column.filed] }}</span
              >
              <span v-if="column.type === 'text' && !column.linkable" style="font-size: 14px">{{ scope.row[column.filed] }}</span>
              <!-- 点击当列text跳转链接 -->

              <!-- 当列input和禁用显示 -->
              <span v-if="column.type === 'input' && componentDisabled && !column.linkable" style="font-size: 14px">{{ scope.row[column.filed] }}</span>
              <el-input
                v-if="column.type === 'input' && !componentDisabled"
                :disabled="componentDisabled || column.disabled"
                size="mini"
                v-model="scope.row[column.filed]"
                :placeholder="'请输入' + column.label"
                @blur="column.onblur ? column.onblur(scope.$index) : () => {}"
              ></el-input>
              <!-- 当列input和禁用显示 -->

              <!-- 当列date和禁用显示 -->
              <span v-if="column.type === 'date' && componentDisabled" style="font-size: 14px">{{
                scope.row[column.filed] ? scope.row[column.filed].slice(0, 10) : ''
              }}</span>
              <el-date-picker
                :disabled="componentDisabled || column.disabled"
                v-if="column.type === 'date' && !componentDisabled"
                v-model="scope.row[column.filed]"
                :type="column.pickerType"
                :format="column.format"
                :value-format="column.valueFormat"
                size="mini"
                :placeholder="'请选择' + column.label"
              >
              </el-date-picker>
              <!-- 当列date和禁用显示 -->

              <!-- 当列select和禁用显示 -->
              <span v-if="(column.type === 'select' && componentDisabled) || column.type === 'select-text'" style="font-size: 14px">
                {{ column.options.find((s) => s.value == scope.row[column.filed]) ? column.options.find((s) => s.value == scope.row[column.filed]).label : '' }}
              </span>
              <el-select
                :disabled="componentDisabled || column.disabled"
                v-if="column.type === 'select' && !componentDisabled"
                size="mini"
                v-model="scope.row[column.filed]"
                :placeholder="'请选择' + column.label"
              >
                <el-option v-for="option in column.options" :key="option.label" :label="option.label" :value="option.value"> </el-option>
              </el-select>
              <!-- 当列select和禁用显示 -->
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="(deletable || sortable) && !componentDisabled" label="操作" :width="actionColumnWidth" align="center">
        <template slot-scope="scope">
          <el-button v-if="sortable" :class="componentDisabled? 'not-sortable': 'vue-sortable'" :disabled="componentDisabled" icon="el-icon-sort" size="mini" :type="componentDisabled? 'info': 'warning'"
            >排序</el-button
          >
          <el-button v-if="deletable" :disabled="componentDisabled" icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div v-if="addable && !componentDisabled" class="add-button-box">
      <el-button class="button" icon="el-icon-plus" type="primary" :disabled="componentDisabled" size="mini" @click="handleAdd"></el-button>
    </div>
    <el-pagination
      v-if="tableList && tableList.length && isPagination"
      @size-change="currentPageChange"
      @current-change="currentPageChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  name: 'tableEdit',
  props: {
    //表格title
    title: {
      type: String
    },
    //表格大小
    size: {
      type: String
    },
    // 表格必填
    required: {
      type: Boolean,
      default: false
    },
    // 单行数据
    fields: {
      type: Object
    },
    // 表格列
    columns: {
      type: Array
    },
    // 表格类型（selection、index）
    type: {
      type: String,
      default: 'selection'
    },
    // 表格下边显示添加行按钮
    addable: {
      type: Boolean,
      default: true
    },
    // 表格操作列删除按钮
    deletable: {
      type: Boolean
    },
    // 表格行拖拽
    sortable: {
      type: Boolean,
      default: false
    },
    // 表格操作列列宽
    actionColumnWidth: {
      type: Number,
      default: 80
    },
    // 表格是否显示分页
    isPagination: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 14
    },
    // handleAdd事件是否触发
    isAddedTrigger: {
      type: Boolean
    }
  },
  watch: {
    data: {
      handler() {
        if (this.isPagination) {
          const start = (this.currentPage - 1) * this.pageSize
          const end = this.currentPage * this.pageSize
          this.tableList = this.data.slice(start, end)
          this.total = this.data ? this.data.length : 0
        } else {
          this.tableList = this.data
        }
      },
      deep: true
    },
    componentDisabled: {
      handler() {
        if(!this.sortable) return
        this.$nextTick(() => {
          this.rowDrop()
        })
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      loading: false,
      tableLoading: false,
      componentDisabled: null,
      currentPage: 1,
      total: 0,
      data: [],
      tableList: [],
      selection: [],
      sortableInstance: null
    }
  },
  created() {},
  methods: {
    rowDrop() {
      const _this = this
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      _this.sortableInstance = new Sortable(tbody, {
        handle: '.vue-sortable',
        filter: '.not-sortable',  // 过滤.not-sort的元素
        async onEnd({ newIndex, oldIndex }) {
          _this.$emit('handleSort', { newIndex, oldIndex })
        }
      })
    },
    handleSelectionChange(val) {
      this.selection = val
    },
    currentPageChange(val) {
      this.currentPage = val
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      this.tableList = this.data.slice(start, end)
    },
    handleAdd() {
      if (this.isAddedTrigger) {
        this.$emit('handleAdd')
      } else {
        this.data.push({ ...this.fields, emptyId: true })
      }
    },
    handleDelete(index, row) {
      if (!this.isPagination) {
        if (row.emptyId) {
          this.$delete(this.data, index)
          return
        }
      }
      this.$emit('handleDelete', index, row)
    }
  }
}
</script>

<style scoped>
p {
  margin: 0;
  flex: 1;
}
.title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  margin: 0;
  text-indent: 10px;
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  background: #f8f8f9;
  display: flex;
}
.button {
  margin: auto 25px;
  height: 28px;
}
.normal ::v-deep .el-table .el-table__header-wrapper th,
.el-table .el-table__fixed-header-wrapper th {
  height: 44px;
}
::v-deep .el-table__header-wrapper table {
  width: 100% !important;
}
::v-deep .el-table__body-wrapper table {
  width: 100% !important;
}
.mini ::v-deep .el-table .el-table__header-wrapper th,
.el-table .el-table__fixed-header-wrapper th {
  height: 40px;
}
.normal ::v-deep .el-table--medium .el-table__cell {
  padding: 10px 0;
}
.mini ::v-deep .el-table--medium .el-table__cell {
  padding: 6px 0;
}
::v-deep .el-table td.el-table__cell div {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .el-date-editor--date {
  width: 100%;
}
::v-deep .el-icon-date {
  display: none;
}
::v-deep .el-input__inner {
  background-color: transparent !important;
  padding: 0 12px;
}
::v-deep .el-button [class*='el-icon-'] + span {
  margin-left: 5px !important;
}
.add-button-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  margin: 0;
  text-indent: 10px;
  border-bottom: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  background: #f8f8f9;
  display: flex;
}
::v-deep .el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
::v-deep .el-table--border .el-table__cell:first-child .cell {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cell div {
  display: flex;
  justify-content: center;
}

.vue-sortable {
  cursor: move;
  margin-right: 10px;
}

.not-sortable {
  margin-right: 10px;
}

</style>
