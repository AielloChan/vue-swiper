<script>
export default {
  name: "vue-swiper",
  data() {
    return {
      curIndex: this.value, // 当前活动的页面
      pages: this.$slots.default || [],
      startPoint: null, // 滑动开始的点
    };
  },
  props: {
    loop: {
      type: Boolean,
      default: false,
    },
    // 如果你的 slot 是异步的，那把你的数据赋值给该 props
    async: {
      default: false,
    },
    // 是否支持手指滑动
    swipe: {
      type: Boolean,
      default: true,
    },
    // 是否能左滑动
    canGoLeft: {
      type: Boolean,
      default: true,
    },
    // 是否能右滑动
    canGoRight: {
      type: Boolean,
      default: true,
    },
    // 指定当前显示的页
    value: {
      type: Number,
      default: 0,
    },
    // 横向滑动的阈值；默认 30
    deltaX: {
      type: Number,
      default: 30,
    },
    // 纵向滑动的阈值；默认 30
    deltaY: {
      type: Number,
      default: 30,
    },
  },
  computed: {
    // 计算上一个 page 的 index
    prevIndex() {
      var pagesLen = this.pages.length,
        prevIndex = this.curIndex - 1;
      if (this.loop) {
        // 循环
        prevIndex = (prevIndex + pagesLen) % pagesLen; // 加一个 pagesLen 是为了防止负数
      }
      return prevIndex;
    },
    // 计算下一个 page 的 index
    nextIndex() {
      var nextIndex = this.curIndex + 1;
      if (this.loop) {
        // 循环
        nextIndex = nextIndex % this.pages.length;
      }
      return nextIndex;
    },
  },
  methods: {
    // 通过 index 来获取对应的类名
    getClassName(index) {
      var classNameList = {
        "vue-swiper-inner": true,
      };
      switch (index) {
        case this.curIndex:
          classNameList["vue-swiper-active"] = true;
          break;
        case this.prevIndex:
          classNameList["vue-swiper-prev"] = true;
          break;
        case this.nextIndex:
          classNameList["vue-swiper-next"] = true;
          break;
        default:
          classNameList["vue-swiper-hide"] = true;
      }
      return classNameList;
    },
    // 每页的点击事件
    onClick(index) {
      if (this.preventClick) {
        this.preventClick = false;
        return;
      }
      switch (index) {
        case this.prevIndex:
          this.prev();
          break;
        case this.nextIndex:
          this.next();
          break;
        case this.curIndex:
          break;
        default:
          return;
      }
    },
    // 跳转到指定位置
    goto(index) {
      var pagesLen = this.pages.length;
      if (this.loop) {
        // 循环
        index = (index + pagesLen) % pagesLen;
      }
      // 在范围内才继续跳转
      if (-1 < index && index < pagesLen) {
        this.curIndex = index;
        // 数据双向绑定
        this.$emit("input", this.curIndex);
      }
    },
    // 跳转到上一项
    // 默认跳转到上一项，如果有传参 n，则跳转到上 n 项
    prev(n) {
      n = n || 1;
      if (this.canGoLeft) {
        n = Math.abs(n); // 步数取正
        this.goto(this.curIndex - n);
      }
    },
    // 跳转到下一项
    // 默认跳转到上一项，如果有传参 n，则跳转到上 n 项
    next(n) {
      n = n || 1;
      if (this.canGoRight) {
        n = Math.abs(n); // 步数取正
        this.goto(this.curIndex + n);
      }
    },
    // 滑动事件
    onTouchstart(e) {
      var touchPoint = e.changedTouches[0];
      this.startPoint = Object.freeze({
        x: touchPoint.clientX,
        y: touchPoint.clientY,
      });
    },
    // 处理滑动结束事件
    onTouchend(e) {
      var touchPoint = e.changedTouches[0];

      this.doSwipe({
        x: touchPoint.clientX - this.startPoint.x,
        y: touchPoint.clientY - this.startPoint.y,
      });
    },
    // 根据滑动位移，给予页面反馈
    doSwipe(delta) {
      if (this.swipe) {
        switch (true) {
          case delta.x > this.deltaX: // 动作为向右滑
            this.prev();
            break;
          case delta.x < -this.deltaX: // 动作为向左滑
            this.next();
            break;
          default:
            break;
        }
      }
    },
  },
  watch: {
    async() {
      // 同步异步 slot 的状态
      this.pages = this.$slots.default || [];
    },
  },
  // 渲染函数
  render(h) {
    var defaultSlot = this.$slots.default || [],
      nodataSlot = this.$slots.nodata || [],
      innerDom = null, // 内层元素
      result = null; // 渲染结果
    if (defaultSlot.length === 0) {
      if (nodataSlot.length === 0) {
        // 既无默认 slot 也无 nodata slot
        innerDom = [];
      } else {
        // 有 nodata slot
        innerDom = [nodataSlot[0]];
      }
    } else {
      innerDom = Array(defaultSlot.length); // 提前申请内存
      for (var i = 0; i < defaultSlot.length; i++) {
        innerDom[i] = h(
          "div",
          {
            class: this.getClassName(i),
            key: i,
            on: {
              touchstart: this.onTouchstart,
              touchend: this.onTouchend,
              click: this.onClick.bind(this, i),
            },
          },
          [defaultSlot[i]]
        );
      }
    }
    result = h(
      "div",
      {
        class: {
          "vue-swiper-outer": true,
        },
      },
      innerDom
    );

    return result;
  },
};
</script>

<style lang="scss">
$box_h: 500px;
$time: 250ms;

.vue-swiper-outer {
  height: $box_h;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.vue-swiper-inner {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  height: auto;
  min-height: 50%;
  max-height: 90%;
  left: 50%;
  z-index: 0;
  overflow: auto;
  background: white;
  border-radius: .5rem;
  box-shadow: 0 0 1.5rem .5rem #D5E9F6;
  transition: all $time ease-in-out;
  &.vue-swiper-active,
  &.vue-swiper-prev,
  &.vue-swiper-next {
    width: 80%;
  }
  &.vue-swiper-hide {
    display: none;
  }
  &.vue-swiper-prev,
  &.vue-swiper-next {
    opacity: .85;
    transform: scale(0.75, 0.85);
  }
  &.vue-swiper-prev::before,
  &.vue-swiper-next::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  &.vue-swiper-active {
    opacity: 1;
    left: 10%;
    margin: auto;
    z-index: 10;
  }
  &.vue-swiper-prev {
    left: -7%;
  }
  &.vue-swiper-next {
    left: 27.5%;
  }
}
</style>
