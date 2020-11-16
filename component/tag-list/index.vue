<template>
  <div class="tagListContainer" v-show="targetShow">
    <p class="title">{{title}}：</p>
    <div class="tagArea">
      <div class="tagItem"
        v-for="(item,index) in value"
        :key="index">
        <span>{{item.title}}</span>
        <!-- <span>{{item.key}}</span> -->
        <scm-icon @click="closeItem(item,index)"
          name="close"
          class="close-icon"
          content="关闭"></scm-icon>
      </div>
    </div>
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
  name: 'tag-list',
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // targetShow: false,
    };
  },
  created() {},
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler() {
        // console.log('sssss', this.value);
        // this.selectList = [
        //   ...new Set([
        //     ...sourceList.map(item => item.value),
        //     ...this.selectList,
        //   ]),
        // ];
      },
    },
  },
  computed: {
    targetShow() {
      if (JSON.stringify(this.value) === '[{}]' || this.value.length === 0) {
        return false;
      }
      return true;
    },
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
    // innerVisible: {
    //   get() {
    //     return this.visible;
    //   },
    //   set(val) {
    //     this.$emit('update:visible', val);
    //   },
    // },
  },
  methods: {
    closeItem(sourceItem, sourceIndex) {
      this.value.splice(sourceIndex, 1);
      this.$emit('closeItem', sourceItem, this.value);
      this.$emit('update:key', this.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.tagListContainer {
  min-height: 32px;
  .title {
    display: inline-block;
    vertical-align: top;
    color: #33517e;
    font-weight: 900;
    text-align: left;
    margin-top: 5px;
  }
  .tagArea {
    display: inline-block;
    .tagItem {
      display: inline-block;
      height: 25px;
      line-height: 25px;
      border: 1px solid #d0d0d0;
      padding-left: 10px;
      padding-right: 10px;
      margin-right: 10px;
      margin-bottom: 5px;
      color: #0085D0;
      .close-icon {
        margin-left: 5px;
        color: #a9a9a9;
        cursor: pointer;
      }
    }
    & .tagItem:last-child {
      margin-right: 0;
    }
  }
}
</style>
