Vue.component("vue-swiper", {
  data: function() {
    return {
      curIndex: this.value, // 当前活动的页面
      pages: this.$slots.default || [],
      startPoint: null // 滑动开始的点
    };
  },
  props: {
    loop: {
      type: Boolean,
      default: false
    },
    // 指定当前显示的页
    value: {
      type: Number,
      default: 0
    },
    // 横向滑动的阈值；默认 30
    deltaX: {
      type: Number,
      default: 30
    },
    // 纵向滑动的阈值；默认 30
    deltaY: {
      type: Number,
      default: 30
    }
  },
  computed: {
    // 计算上一个 page 的 index
    prevIndex: function() {
      var pagesLen = this.pages.length,
        prevIndex = this.curIndex - 1;
      if (this.loop) {
        // 循环
        prevIndex = (prevIndex + pagesLen) % pagesLen; // 加一个 pagesLen 是为了防止负数
      }
      return prevIndex;
    },
    // 计算下一个 page 的 index
    nextIndex: function() {
      var nextIndex = this.curIndex + 1;
      if (this.loop) {
        // 循环
        nextIndex = nextIndex % this.pages.length;
      }
      return nextIndex;
    }
  },
  methods: {
    // 通过 index 来获取对应的类名
    getClassName: function(index) {
      var classNameList = {
        "vue-swiper-inner": true
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
          classNameList["vue-swiper-other"] = true;
      }
      return classNameList;
    },
    // 每页的点击事件
    onClick: function(index) {
      switch (index) {
        case this.prevIndex:
          this.goto(-1);
          break;
        case this.nextIndex:
          this.goto(+1);
          break;
        case this.curIndex:
          break;
        default:
          return;
      }
    },
    // 步进
    // +1 则是前进一页，-1 则是后退一页，+n、-n 同理
    goto: function(step) {
      var pagesLen = this.pages.length,
        index = this.curIndex + Number(step);
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
    prev: function() {
      this.goto(-1);
    },
    // 跳转到下一项
    next: function() {
      this.goto(+1);
    },
    // 滑动事件
    onTouchstart: function(e) {
      var touchPoint = e.changedTouches[0];
      this.startPoint = Object.freeze({
        x: touchPoint.clientX,
        y: touchPoint.clientY
      });
    },
    // 处理滑动结束事件
    onTouchend: function(e) {
      var touchPoint = e.changedTouches[0];
      var touchEndX = touchPoint.clientX;
      var touchEndY = touchPoint.clientY;
      var deltaX = touchEndX - this.startPoint.x;
      var deltaY = touchEndY - this.startPoint.y;

      switch (true) {
        case deltaX > this.deltaX: // 动作为向右滑
          this.goto(-1);
          break;
        case deltaX < -this.deltaX: // 动作为向左滑
          this.goto(+1);
          break;
        default:
          break;
      }
    }
  },
  // 渲染函数
  render: function(h) {
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
              click: this.onClick.bind(this, i)
            }
          },
          [defaultSlot[i]]
        );
      }
    }
    result = h(
      "div",
      {
        class: {
          "vue-swiper-outer": true
        },
        on: {
          touchstart: this.onTouchstart,
          touchend: this.onTouchend
        }
      },
      innerDom
    );

    return result;
  }
});
