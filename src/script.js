import "./swiper";

new Vue({
  el: "#app",
  template: `
    <vue-swiper v-model="index" ref="swiper">
        <h1>Hello<br/>World</h1><h1>This<br/>Is</h1><h1>vue-swiper</h1><h1 slot="nodata">No Data</h1>
    </vue-swiper>`,
  data: {
    index: 0
  },
  mounted() {
    // 自动调用 ui-swiper 的 next 方法
    setTimeout(() => {
      this.$refs.swiper.next();
    }, 1e3);
  },
  watch: {
    index(val) {
      console.log(val);
    }
  }
});
