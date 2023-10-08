<template>
  <div class="progress-container">
    <span>{{ parseInt(per * 100) / 100 }}%</span>
    <i class="el-icon-minus icon" @click="minus"></i>
    <div class="slider" ref="slider" @click.stop="handelClickSlider">
      <div class="process" :style="{ width: progressWidth + 'px', background: bgColor }"></div>
      <div class="thunk" ref="trunk" :style="{ left }">
        <div class="block" ref="dot">
          <div class="circle" ref="circle"></div>
        </div>
      </div>
    </div>
    <i class="el-icon-plus icon" @click="plus"></i>
  </div>
</template>
<script>
/*
 * min 进度条最小值
 * max 进度条最大值
 * v-model 对当前值进行双向绑定实时显示拖拽进度
 * */
export default {
  name: 'dragProgress',
  props: {
    // 最小值
    min: {
      type: Number,
      default: 0
    },
    // 最大值
    max: {
      type: Number,
      default: 100
    },
    // 当前值
    value: {
      type: Number,
      default: 0
    },
    // 进度条颜色
    bgColor: {
      type: String,
      default: '#4ab157'
    },
    // 是否可拖拽
    isDrag: {
      type: Boolean,
      default: true
    },
    // 当前值
    width: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      slider: null, //滚动条DOM元素
      thunk: null, //拖拽DOM元素
      per: this.value, //当前值
      progressWidth: 100,
      beforeMoveWidth: 100
    }
  },
  mounted() {
    this.slider = this.$refs.slider
    this.thunk = this.$refs.trunk
    if (!this.isDrag) return
    this.thunk.onmousedown = (e) => {
      var disX = e.clientX

      document.onmousemove = (e) => {
        let newWidth = e.clientX - disX + this.beforeMoveWidth
        newWidth = newWidth < 0 ? 0 : newWidth > this.width ? this.width : newWidth

        const percent = newWidth / this.width
        this.per = percent * 100 < 0 ? 0 : percent * 100 > 100 ? 100 : percent * 100
        this.progressWidth = newWidth
        this.$emit('stop', this.per)
      }
      document.onmouseup = () => {
        this.beforeMoveWidth = this.progressWidth
        document.onmousemove = document.onmouseup = null
      }
    }
  },
  methods: {
    init() {
      this.progressWidth = 100
      this.beforeMoveWidth = 100
      this.per = this.value
    },
    minus() {
      this.per = Number(this.per - 1)
      if (this.per <= 0) {
        this.per = 0
      }
      this.progressWidth = this.per * (this.width / 100)
      this.$emit('stop', this.per)
    },
    plus() {
      this.per = Number(this.per) + 1
      if (this.per >= 100) {
        this.per = 100
      }
      this.progressWidth = this.per * (this.width / 100)
      this.$emit('stop', this.per)
    },
    handelClickSlider(event) {
      //禁止点击
      if (!this.isDrag) return
      const dot = this.$refs.dot
      const circle = this.$refs.circle
      if (event.target == dot || event.target == circle) return
      //获取元素的左边距
      let ev = event || window.event
      //获取当前点击位置的百分比
      let scale = ((ev.offsetX / this.width) * 100).toFixed(2)
      this.progressWidth = scale * (this.width / 100)
      this.beforeMoveWidth = this.progressWidth
      this.per = Number(scale)
      this.$emit('stop', this.per)
    }
  },
  computed: {
    scale() {
      return (this.per - this.min) / (this.max - this.min)
    },
    left() {
      return this.slider ? this.slider.offsetWidth * this.scale - this.thunk.offsetWidth / 2 + 'px' : '0px'
    }
  },
  watch: {
    value: {
      handler: function () {
        this.per = this.value
      }
    }
  }
}
</script>
<style scoped>
.box {
  margin: 100px auto 0;
  width: 80%;
}

.clear:after {
  content: '';
  display: block;
  clear: both;
}

.progress-container {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon {
    cursor: pointer;
    margin: 0 20px;
    color: #000;
    font-weight: 600;
  }
}

.slider {
  margin: 20px 0;
  width: 200px;
  height: 6px;
  background: #747475;
  cursor: pointer;
  position: relative;
}

.slider .process {
  width: 112px;
  height: 6px;
  border-radius: 5px;
  background: #409eff;
  z-index: 111;
  position: absolute;
}

.slider .thunk {
  position: absolute;
  left: 100px;
  top: -7px;
  width: 10px;
  height: 6px;
  z-index: 122;
}

.slider .block {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 1px #ccc solid;
  transition: 0.2s all;

  .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 4px;
    background: #aaa;
  }
}

.slider .block:hover {
  transform: scale(1.1);
}
</style>
