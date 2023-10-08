<template>
  <div class="table-form-container">
    <el-col :span="item.span === undefined ? 12 : item.span" class="part" style="padding: 0" v-for="item in data" :key="item.label">
      <div class="form-item" v-if="item.triggerShow === undefined || item.triggerShow === true">
        <div class="label">
          <span>{{ item.label }}</span>
          <span v-if="item.require" style="color: #f56c6c; margin-left: 3px">*</span>
        </div>
        <div class="value">
          <!-- 当前表单text显示 -->
          <span v-if="item.type === 'text'" class="indent">{{ item.value }} </span>
          <!-- 当前表单text显示 -->

          <!-- 当前表单date和禁用显示 -->
          <span v-if="item.type === 'date' && componentDisabled" class="indent">{{ item.value }} </span>
          <el-date-picker
            :disabled="componentDisabled || item.disabled"
            v-if="item.type === 'date' && !componentDisabled"
            v-model="item.value"
            :type="item.pickerType"
            :format="item.format"
            :value-format="item.valueFormat"
            size="mini"
            :placeholder="'请选择' + item.label"
          >
          </el-date-picker>
          <!-- 当前表单date和禁用显示 -->

          <!-- 当前表单input和禁用显示 -->
          <span v-if="item.type === 'input' && componentDisabled" class="indent">{{ item.value }} </span>
          <el-input
            size="mini"
            v-if="item.type === 'input' && !componentDisabled"
            :placeholder="item.type === 'input' ? '请输入' + item.label : ''"
            v-model="item.value"
            :disabled="componentDisabled || item.disabled"
            @blur="item.onblur ? item.onblur(data) : () => {}"
          ></el-input>
          <!-- 当前表单input和禁用显示 -->

          <!-- 当前表单select和禁用显示 -->
          <span v-if="item.type === 'select' && componentDisabled" class="indent"
            >{{ item.options.find((s) => s.value == item.value) ? item.options.find((s) => s.value == item.value).label : '' }}
          </span>
          <el-select
            v-if="item.type === 'select' && !componentDisabled"
            :disabled="item.disabled"
            size="mini"
            v-model="item.value"
            :placeholder="'请选择' + item.label"
          >
            <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"> </el-option>
          </el-select>
          <!-- 当前表单select和禁用显示 -->

          <div v-if="item.type === 'checkbox'" style="display: flex">
            <el-checkbox-group v-model="item.value">
              <el-checkbox v-for="(check, index) in item.checkList" :key="index" :label="check.label" :disabled="check.disabled"></el-checkbox>
            </el-checkbox-group>
            <span style="margin-left: 10px; color: #f56c6c; font-size: 12px">{{ item.mark }}</span>
          </div>

          <div v-if="item.type === 'actions'" class="value-actions">
            <el-input
              size="mini"
              :placeholder="item.type === 'input' ? '请输入' + item.label : ''"
              v-model="item.value"
              :disabled="componentDisabled || item.disabled"
              @blur="item.onblur ? item.onblur(data) : () => {}"
            ></el-input>
            <div style="display: inline-block" v-for="(button, index) in item.actions" :key="index">
              <el-button
                class="action-button"
                v-if="button.visible"
                :type="button.type"
                :loading="button.loading"
                :disabled="button.disabled"
                :size="button.size"
                @click="button.clicked"
              >
                {{ button.text }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'tableForm',
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      componentDisabled: null
    }
  },
  created() {}
}
</script>

<style scoped>
.table-form-container {
  overflow: hidden;
  border: 1px #dfe6ec solid;
  border-left: none;
  display: flex;
  flex-wrap: wrap;
}
.part {
  font-size: 13px;
  line-height: 35px;
  margin-top: 1px;
  margin-bottom: -1px;
}
.form-item {
  box-sizing: border-box;
  display: flex;
  height: 100%;
}
.label {
  box-sizing: border-box;
  width: 160px;
  color: #666;
  background: #f8f8f9;
  border-left: 1px #dfe6ec solid;
  border-right: 1px #dfe6ec solid;
  border-bottom: 1px #dfe6ec solid;
  text-indent: 10px;
}
.value {
  box-sizing: border-box;
  flex: 1;
  border-bottom: 1px #f2f6fc solid;
  border-right: 1px #f2f6fc solid;
  display: flex;
  padding: 0 6px;
  margin-right: -1px;
}
.value-actions {
  flex: 1;
  display: flex;
  align-items: center;
}
.action-button {
  height: 28px;
  margin: 0 8px;
}
::v-deep .el-date-editor.el-input {
  width: 100%;
}
::v-deep .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa !important;
}
::v-deep .el-input__inner {
  background-color: transparent !important;
  padding: 0 8px !important;
}
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-icon-date {
  display: none;
}
::v-deep .el-date-editor .el-input__inner {
  padding: 0 10px;
}
::v-deep .el-checkbox-group {
  display: flex;
}
.indent {
  text-indent: 6px;
}
</style>
