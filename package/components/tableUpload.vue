<template>
  <div>
    <div class="title">
      <p>相关附件上传要求：需上传营业执照、公司章程、投资协议（只针对合资公司）、公司设立会议纪要（只针对近年新设立公司）</p>
    </div>
    <el-table border v-loading="tableLoading" @selection-change="handleSelectionChange" :data="fileList" style="width: 100%">
      <el-table-column label="序号" align="center" :type="type" :width="70" />
      <el-table-column v-for="column in columns" :key="column.label" :label="column.label" align="center">
        <template slot-scope="scope">
          <div>
            <span v-if="column.filed !== 'fileName'">{{ scope.row[column.filed] }}</span>
            <span v-if="column.filed === 'fileName' && componentDisabled && !couldApprovingView">{{ scope.row[column.filed] }}</span>
            <el-link v-if="column.filed === 'fileName' && (!componentDisabled || couldApprovingView)" type="primary" @click="column.click(scope.row)">
              {{ scope.row[column.filed] }}
            </el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="!componentDisabled" label="操作" align="center" :width="actionColumnWidth">
        <template slot-scope="scope">
          <el-button
            :disabled="componentDisabled"
            icon="el-icon-download"
            size="mini"
            type="success"
            @click="handleDownload(scope.row)"
            style="margin-right: 10px"
            >下载</el-button
          >
          <el-button v-if="deletable" :disabled="componentDisabled" icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'tableUpload',
  props: {
    type: {
      type: String,
      default: 'selection'
    },
    fields: {
      type: Object
    },
    fileList: {
      type: Array
    },
    columns: {
      type: Array
    },
    deletable: {
      // 表格操作列可删除
      type: Boolean
    },
    actionColumnWidth: {
      // 表格操作列列宽
      type: Number,
      default: 80
    }
  },
  watch: {
    $route: {
      async handler(value) {
        const { id } = value.params
        const { workflowId, version } = value.query
        const versionList = await this.$store.dispatch('getVersionList', id)
        const currentVersion = versionList?.find((s) => s.version === version)
        if (currentVersion.status == 1 && workflowId) {
          // 工作流页面 且 审核中版本，支持查看相关附件
          this.couldApprovingView = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      file: null,
      tableLoading: false,
      componentDisabled: null,
      selection: [],
      couldApprovingView: false
    }
  },
  created() {},
  methods: {
    handleSelectionChange(val) {
      this.selection = val
    },
    handleDelete(file) {
      this.$emit('handleDelete', file)
    },
    handleDownload(file) {
      this.$emit('handleDownload', file)
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
  color: #f56c6c;
  display: flex;
}
::v-deep .el-table .el-table__header-wrapper th,
.el-table .el-table__fixed-header-wrapper th {
  height: 30px;
}
::v-deep .el-table--medium .el-table__cell {
  padding: 6px 0;
}
::v-deep .el-icon-delete:before {
  margin-right: 5px;
}
</style>
