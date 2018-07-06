import "./swiper";

new Vue({
  el: "#app",
  template: `
    <div class="app">
      <vue-swiper v-model="index" ref="swiper" :async="items">
          <article v-for="item in items">
              <h1 v-html="item.title"></h1>
              <p v-html="item.content"></p>
          </article>
          <div slot="nodata" style="width:100%;text-align:center;">加载中。。。</div>
      </vue-swiper>
      <div class="btn-group">
          <button @click="$refs.swiper.prev()">prev</button>
          <button @click="$refs.swiper.next()">next</button>
      </div>
    </div>
    `,
  data: {
    index: 0,
    items: []
  },
  mounted() {
    // 模拟异步获取填充数据
    setTimeout(()=>{
      this.items = [
        {
          title: "nobis",
          content:
            "Voluptas nostrum odio qui earum dolores sed facilis dolor error."
        },
        {
          title: "sequi quidem dolor",
          content: "Exercitationem inventore fuga aliquid veritatis non ut."
        },
        {
          title: "quas vitae inventore",
          content:
            "Ipsa explicabo ut asperiores quas. Sed qui qui nulla cupiditate. Et non voluptatem vero. Sit reiciendis odio consequatur non doloribus sed cupiditate dolor."
        },
        {
          title: "voluptates dolorum quod",
          content:
            "Sed quae illo fugiat ipsum sunt eligendi expedita magnam. Omnis consequatur delectus. "
        },
        {
          title: "consequuntur nostrum laboriosam",
          content: "Dolore itaque aliquam vel libero."
        },
        {
          title: "velit rerum repudiandae",
          content:
            "Est fugiat est numquam molestiae temporibus et molestias laborum."
        }
      ]
    },1e3);
    // 自动调用 ui-swiper 的 next 方法
    setTimeout(() => {
      this.$refs.swiper.next();
    }, 2e3);
  },
  watch: {
    index(val) {
      console.log(val);
    }
  }
});
