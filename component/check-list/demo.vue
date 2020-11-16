<template>
  <div>
    <p>正常</p>
    <check-list :button-text="'测试'"
                :list="list" />

    <hr>
    <p>带宽度和高度</p>
    <check-list :button-text="'测试2'"
                :list="list"
                :width="'250'"
                :height="'150'" />

    <hr>
    <p>回调事件</p>
    <check-list @cancel="onCancel"
                @confirm="onConfirm"
                :button-text="'测试3'"
                :list="list"
                :width="'250'"
                :height="'150'" />

    <hr>
    <p>绑定v-model</p>
    <a @click="setList4">设置一个值</a>|
    <a @click="clearAll">清空选择的所有值</a>|
    <check-list v-model="list4"
                ref="list4"
                @cancel="onCancel"
                @confirm="onConfirm"
                :button-text="'测试4'"
                :list="list"
                :width="'250'"
                :height="'150'" />
  </div>
</template>

<script>
import CheckList from './index';

export default {
  components: { CheckList },
  data() {
    return {
      visible: false,
      list: [],
      list4: [{ key: 1 }, { key: 6 }],
    };
  },
  created() {},
  mounted() {
    for (let i = 0; i < 50; i += 1) {
      this.list.push({
        title: `${i}L`,
        key: i,
      });
    }
  },
  methods: {
    onCancel() {
      console.log('我关闭了');
    },
    onConfirm(list) {
      console.log('我关闭了且返回数据了。', list);
    },
    setList4() {
      this.list4 = [{ title: 2 }, { key: 7 }];
    },
    clearAll() {
      this.$refs.list4.clear();
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
</style>
