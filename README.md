# vue-basic-components

[![version](https://badgen.net/badge/version/v1.0.0/green)](https://npmjs.com/package/vue-basic-components)

[![version](https://badgen.net/badge/author/please512/red)](https://npmjs.com/package/vue-basic-components)

vue 项目基础组件库

### **安装**：

#### es5 在 main.js 引入：

```
	const install = require('vue-basic-components').default.install
    install(Vue);
```

#### es6 在 main.js 引入：

```
	import { install } from 'vue-basic-components'
    install(Vue);
```

#### 引入样式

```
	import 'vue-basic-components/dist/vue-basic-components.css'

```

### **介绍**：

###### 1，TableEdit 组件支持分页

```
<table-edit
      title="董事"
      :required="true"
      type="index"
      @handleDelete="handleDelete"
      :deletable="true"
      :actionColumnWidth="100"
      :fields="fields"
      :columns="columns"
    />
```

###### 2，TableForm 组件

### **usage**:

```
<table-form ref="originTableForm" :data="originInfo" />

```

###### 3，TableUpload 组件

### **usage**:

```
<table-upload
      :deletable="true"
      type="index"
      @handleDelete="handleDelete"
      @handleDownload="handleDownload"
      :actionColumnWidth="200"
      :fileList="fileList"
      :fields="fields"
      :columns="columns"
    />

```

###### 4，DragProgress 组件

### **usage**:

```
<drag-progress
	  @stop="progress"
	  :min="0"
	  :max="100"
	  :value="progressVal"
	  :width="200"
	  :isDrag="true"
	  bgColor="#409EFF"
	/>

```
