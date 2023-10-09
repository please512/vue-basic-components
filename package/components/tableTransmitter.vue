<template>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" :width="dialogWidth">
        <div class="table-container">
            <div style="width: 48%">
                <div class="search-top">
                    <el-input @input="frontPagination ? searchByFront() : searchBy()" clearable suffix-icon="el-icon-search"
                        size="small" v-model="searchValue" :placeholder="placeholder" class="search-input" />
                </div>
                <el-table element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" v-loading="loading" border
                    :data="tableList">
                    <el-table-column prop="date" align="center" label="操作" width="80">
                        <template slot-scope="scope">
                            <span class="select" @click="selectIt(scope.row)">选择</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item, index) in tableConfigs" :key="'left' + index" :prop="item.prop"
                        :align="item.align" :label="item.label" :width="item.width">
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination @size-change="currentPageChange" @current-change="currentPageChange"
                        :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next"
                        :total="leftTableData.length" background>
                    </el-pagination>
                </div>
            </div>
            <div style="width: 48%">
                <el-table border :data="rightTableData" :height="rightTableHeight">
                    <el-table-column v-for="(item, index) in tableConfigs" :key="'left' + index" :prop="item.prop"
                        :align="item.align" :label="item.label" :width="item.width">
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="操作" width="80">
                        <template slot-scope="scope">
                            <span class="select delete" @click="deleteIt(scope.row)">删除</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="cancelButton.visible" :type="cancelButton.type" @click="dialogVisible = false">{{
                cancelButton.text }}</el-button>
            <el-button v-if="comfirmButton.visible" :type="comfirmButton.type" @click="confirm()">{{ comfirmButton.text
            }}</el-button>
        </span>
    </el-dialog>
</template>
  
<script>
function throttle(func, delay) {
    let timer = null
    return function () {
        if (!timer) {
            timer = setTimeout(() => {
                func.apply(this)
                timer = null
            }, delay)
        }
    }
}
let instance = null
export default {
    name: 'tableTransmitter',
    props: {
        dialogTitle: {
            type: String,
            default: '标题'
        },
        dialogWidth: {
            type: String,
            default: '70%'
        },
        placeholder: {
            type: String,
            default: '请输入'
        },
        comfirmButton: {
            type: Object,
            default: () => {
                return {
                    visible: true,
                    text: '确定',
                    size: 'small',
                    type: 'primary'
                }
            }
        },
        cancelButton: {
            type: Object,
            default: () => {
                return {
                    visible: true,
                    text: '取消',
                    size: 'small',
                    type: ''
                }
            }
        },
        leftTableDataProp: {
            type: Array,
            default: () => []
        },
        tableConfigs: {
            type: Array,
            default: () => {
                return [
                    {
                        label: '',
                        align: 'center',
                        prop: ''
                    }
                ]
            }
        },
        rightTableHeight: {
            type: Number,
            default: 520
        },
        frontPagination: {
            type: Array | String,
            default: ''
        },
        pageSize: {
            type: Number,
            default: 8
        },
    },
    watch: {
        leftTableDataProp: {
            handler() {
                this.leftTableData = this.leftTableDataProp
                const start = (this.currentPage - 1) * this.pageSize
                const end = this.currentPage * this.pageSize
                this.tableList = this.leftTableData.slice(start, end)
                this.total = this.leftTableData ? this.leftTableData.length : 0
            },
            deep: true,
            immediate: true
        },
    },
    data() {
        return {
            dialogVisible: false,
            leftTableData: [],
            rightTableData: [],
            currentPage: 1,
            tableList: [],
            searchValue: '',
            loading: true
        };
    },
    mounted() {
        instance = this
    },
    methods: {
        show() {
            this.rightTableData = []
            this.currentPage = 1
            this.searchValue = ''
            this.dialogVisible = true
        },
        confirm() {
            this.$emit('selected', this.rightTableData)
            this.dialogVisible = false
        },
        searchByFront() {
            if (Array.isArray(this.frontPagination)) {
                let arr = []
                this.frontPagination.forEach(perporty => {
                    arr = arr.concat(this.leftTableDataProp.filter(s => s[perporty].includes(this.searchValue)))
                })
                this.leftTableData = [...new Set(arr)]
            } else {
                this.leftTableData = this.leftTableDataProp.filter(s => s[this.frontPagination].includes(this.searchValue))
            }
            this.currentPageChange(1)
        },
        searchBy: throttle(() => {
            instance.tableLoading = true
            instance.$emit('searchByValue', instance.searchValue)
        }, 500),
        currentPageChange(val) {
            this.currentPage = val
            const start = (this.currentPage - 1) * this.pageSize
            const end = this.currentPage * this.pageSize
            this.tableList = this.leftTableData.slice(start, end)
        },
        selectIt(row) {
            let isContain = false
            for (let i = 0; i < this.rightTableData.length; i++) {
                const rightRow = this.rightTableData[i]
                if (JSON.stringify(row) === JSON.stringify(rightRow)) {
                    isContain = true
                    break
                }
            }
            if (isContain) return
            this.rightTableData.push(row)
        },
        deleteIt(row) {
            let index = 0
            for (let i = 0; i < this.rightTableData.length; i++) {
                const rightRow = this.rightTableData[i]
                if (JSON.stringify(row) === JSON.stringify(rightRow)) {
                    index = i
                    break
                }
            }
            this.rightTableData.splice(index, 1)
        }
    }
};
</script>
  
<style scoped>
::v-deep .el-dialog__body {
    padding: 10px 20px;
}

.table-container {
    display: flex;
    justify-content: space-between;
}

.search-top {
    width: 50%;
    height: 40px;
}

.select {
    color: #1989fa;
    text-decoration: underline;
    cursor: pointer;
}

.delete {
    color: #F56C6C;
}

.pagination-container {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}
</style>
  