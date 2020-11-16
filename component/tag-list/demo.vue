<template>
  <div>
    <p>正常</p>
    <tag-list :title="'我是标题'"
      v-model="list"
      @closeItem="onCloseItem" />
    <a @click="setValue">设置值</a>


  </div>
</template>

<script>
import TagList from './index';

export default {
  components: { TagList },
  data() {
    return {
      list: [],
    };
  },
  created() {},
  mounted() {
    for (let i = 0; i < 10; i += 1) {
      this.list.push({
        title: `${i}L`,
        key: i,
      });
    }
  },
  methods: {
    onCloseItem(closeItem, allList) {
      console.log('我关闭了一个tag', closeItem);
      console.log('关闭之后的所有值为', allList);
    },
    setValue() {
      this.list = [{ key: 2, title: '2L' }, { key: 7, title: '7L' }];
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
</style>
