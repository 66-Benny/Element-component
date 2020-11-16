<template>
  <div class="collapseFormContainer">
    <slot name="base"></slot>
    <scm-divider dashed></scm-divider>
    <p>
      <font class="title">{{title}}</font>
      <a class="expander"
        @click="handleExpand">
        {{ innerExpand ? '收起' : '展开' }}
        <i :class="{'el-icon-arrow-down': !innerExpand,
        'el-icon-arrow-up':innerExpand
          }"></i>
      </a>
    </p>

    <scm-collapse-transition>
      <div v-show="innerExpand">
        <slot name="collapse"></slot>
      </div>
    </scm-collapse-transition>
  </div>
</template>

<script>
// props
// title 标题内容
// v-model="Array[{value:1,label:'1L'},{value:2,label:'2L'}]" 绑定value值

// event
// closeItem 当关闭一个tag事件

// methods
// clear 清空选择

export default {
  name: 'collapse-form',
  props: {
    title: {
      type: String,
      default: '更多查询条件',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  created() {},
  watch: {},
  computed: {
    // listBySearchTxt() {
    //   this.reSetCheckAll();
    //   return this.list.filter(item => item.label.includes(this.searchTxt));
    // },
    // middleAreaStyleCom() {
    //   if (endsWith(this.height, 'px') || endsWith(this.height, '%')) {
    //     return `height:${this.height};`;
    //   }
    //   return `height:${this.height}px;`;
    // },
    innerExpand: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    handleExpand() {
      this.innerExpand = !this.innerExpand;
    },
  },
};
</script>
<style lang="scss" scoped>
.collapseFormContainer {
  .title {
    display: inline-block;
    vertical-align: top;
    color: #33517e;
    font-weight: 700;
    width: 100px;
    text-align: left;
  }
  .expander {
    float: right;
    cursor: pointer;
  }
}
</style>
