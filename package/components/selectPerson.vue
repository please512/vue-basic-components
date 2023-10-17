<template>
  <el-dialog :title="title" :visible.sync="visible" style="margin-top: 3vh;" width="1200px">
    <div class="person-body">
      <div class="left">
        <el-button-group>
          <el-button size="mini" @click="changeSearchBy('account')"
            :type="searchBy === 'account' ? 'primary' : ''">按账号查询</el-button>
          <el-button size="mini" @click="changeSearchBy('org')"
            :type="searchBy === 'org' ? 'primary' : ''">按机构查询</el-button>
        </el-button-group>
        <div class="pre">
          <div class="search-box" v-if="searchBy === 'account'">
            <el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" clearable v-model="keyword">
            </el-input>
            <el-button type="primary" size="mini" class="search-btn" icon="el-icon-search" @click="search">查询</el-button>
          </div>
          <div class="pre-select-box">
            <div class="pre-select-box-org" v-loading="treeLoading" v-if="searchBy === 'org'">
              <el-input class="searchOrg" clearable placeholder="请输入内容" size="mini" suffix-icon="el-icon-search"
                v-model="filterText"> </el-input>
              <el-tree class="filter-tree" :data="userTree" node-key="id" :props="defaultProps"
                :filter-node-method="usersFilterNode" highlight-current @node-click="usersHandleNodeClick"
                :default-expanded-keys="usersExpandData" :expand-on-click-node="false" ref="tree" />
            </div>
            <el-table size="mini" v-loading="preTableLoading" :border="true" :data="preList" class="pre-select-box-table">
              <el-table-column prop="nickName" label="员工姓名"> </el-table-column>
              <el-table-column prop="userName" label="OA名"> </el-table-column>
              <el-table-column prop="dept" label="所属机构"> </el-table-column>
              <el-table-column label="操作" :width="80">
                <template slot-scope="scope">
                  <el-button @click="selectPerson(scope.row)" type="text" size="small">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="right">
        <el-table size="mini" :border="true" :data="data" class="right-table">
          <el-table-column prop="nickName" label="员工姓名"> </el-table-column>
          <el-table-column prop="userName" label="OA名"> </el-table-column>
          <el-table-column prop="dept" label="所属机构"></el-table-column>
          <el-table-column label="操作" :width="80">
            <template slot-scope="scope">
              <el-button @click="deletePerson(scope.row, scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="() => { visible = false }">取 消</el-button>
      <el-button size="mini" type="primary" @click="handleSelectedUser">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'selectPerson',
  props: {
    title: {
      type: String,
      default: '选择人员'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    interfaces: {
      type: Object
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      usersExpandData: [],
      filterText: '',
      data: [],
      defaultProps: {
        label: 'orgName'
      },
      keyword: '',
      preTableLoading: false,
      searchBy: 'account',
      userTree: null,
      preList: [],
      clickState: false,
      treeLoading: true,
      visible: false
    }
  },
  created() {
    this.getAllUser()
  },
  mounted() {
    document.onkeydown = (e) => {
      if (this.searchBy !== 'account') return
      let _key = window.event.keyCode
      if (_key === 13 && !this.clickState) {
        this.clickState = true
        this.search()
      }
    }
    document.onkeyup = (e) => {
      this.clickState = false
    }
  },
  methods: {
    handleSelectedUser() {
      this.visible = false
      this.$emit('selected', this.data)
    },
    async getSelfDept(list, index = 0) {
      const user = list[index]
      try {
        const { data } = await this.interfaces.getUserInfoByOA(user.userName)
        list[index].dept = data.orgName
      } catch (error) {
        list[index].dept = ''
      }
      index++
      if (index < list.length) {
        this.getSelfDept(list, index)
      }
    },
    async search() {
      if (!this.keyword) return
      let oaName = ''
      if (new RegExp('[\\u4E00-\\u9FFF]+', 'g').test(this.keyword)) {
        const res = await this.interfaces.getUsersByName(this.keyword)
        oaName = res.data
      } else {
        oaName = this.keyword
      }
      this.preTableLoading = true
      this.interfaces.getUsersByOA({
        loginName: oaName
      })
        .then(async (res) => {
          if (res.code === 200) {
            this.preList = res.data.map((s) => {
              s.dept = ''
              s.nickName = s.userName
              s.userName = s.loginName
              return s
            })
            this.getSelfDept(this.preList)
          }
        })
        .finally(() => {
          this.preTableLoading = false
        })
    },
    getAllUser() {
      this.interfaces.getOrgTree()
        .then((res) => {
          if (res.code === 200) {
            const root = res.data[0]
            this.usersExpandData.push(root.id)
            this.userTree = [root]
          }
        })
        .finally(() => (this.treeLoading = false))
    },
    changeSearchBy(value) {
      this.reset()
      this.searchBy = value
    },
    reset() {
      this.searchBy = 'account'
      this.filterText = ''
      this.keyword = ''
      this.preList = []
      this.data = []
    },
    deletePerson(row, index) {
      this.data.splice(index, 1)
    },
    selectPerson(user) {
      if (this.multiple) {
        if (!this.data.find((s) => s.userId === user.userId)) {
          this.data.push(user)
        }
      } else {
        this.data = []
        this.data.push(user)
      }
    },
    usersFilterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1 || data.orgName.indexOf(value) !== -1
    },
    usersHandleNodeClick(data) {
      this.preTableLoading = true
      this.interfaces.getUsersByOrg({
        orgNo: data.orgNo,
        pageNum: 1,
        pageSize: 10000
      })
        .then((res) => {
          if (res.code === 200) {
            this.preList = res.rows.map((s) => {
              s.dept = ''
              s.phone = s.phonenumber
              return s
            })
            this.getSelfDept(this.preList)
          }
        })
        .finally(() => {
          this.preTableLoading = false
        })
    }
  }
}
</script>
<style scoped>
::v-deep .el-table::before {
  height: 0;
}

::v-deep .el-table .el-table__header-wrapper th,
.el-table .el-table__fixed-header-wrapper th {
  text-align: center;
  height: 35px !important;
}

::v-deep .el-table--mini .el-table__cell {
  padding: 0;
}

::v-deep .el-table td.el-table__cell div {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .el-dialog__body {
  padding: 0 20px;
}

::v-deep .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}

::v-deep .el-tree-node__label {
  font-size: 12px;
}

::v-deep .el-tree,
.el-tree-node {
  max-width: 210px;
  height: 100%;
  overflow: auto;
}

.person-body {
  height: 70vh;
  display: flex;
  justify-content: space-between;
}

.person-body .left {
  width: calc(100% - 500px);
  height: 100%;
}

.person-body .left .search-box {
  width: 70%;
  display: flex;
  margin: 10px 0;
}

.person-body .left .search-box .search-btn {
  margin-left: 10px;
}

.person-body .left .pre {
  height: calc(100% - 28px);
  display: flex;
  flex-direction: column;
}

.person-body .left .pre .pre-select-box {
  flex: 1;
  display: flex;
  overflow-y: auto;
  margin-top: 10px;
  border: 1px solid #dfe6ec;
  border-right: none;
}

.person-body .left .pre .pre-select-box .pre-select-box-org {
  display: flex;
  flex-direction: column;
}

.person-body .left .pre .pre-select-box .pre-select-box-org .searchOrg {
  width: 90%;
  margin: 10px 0 5px 10px;
}

.person-body .left .pre .pre-select-box .pre-select-box-table {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.person-body .right {
  width: 470px;
  height: 100%;
  overflow-y: auto;
  border-bottom: 1px solid #dfe6ec;
}

.person-body .right .right-table {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
