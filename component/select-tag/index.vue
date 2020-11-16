<template>
  <div class="tagListContainer"
       v-if="targetShow">
    <div class="tagArea">
      <div class="tagItem"
           v-for="(item,key) in selectTagInfo"
           :key="item.title"
           v-show="item.value && key !== 'YEAR'"
           v-if="!(statusType && item.title.indexOf('状态') !== -1)">
        <span class="tagTitle">{{item.title}}:</span>
        <span class="tagValue">{{item.value}}</span>
        <scm-icon @click="closeItem(item,key)"
                  name="close"
                  class="close-icon"></scm-icon>
      </div>
      <div class="tagItem"
           v-for="(item,key) in selectTagInfo"
           :key="key"
           v-show="item.value && key === 'YEAR'">
        <span class="tagTitle">{{item.title}}:</span>
        <span class="tagValue">{{item.value}}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'select-list',
  props: {
    selectTagInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    selectInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    activeTabName: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {};
  },
  created() {},
  watch: {
    selectTagInfo: {
      immediate: true,
      deep: true,
      handler() {},
    },
  },
  computed: {
    targetShow() {
      if (JSON.stringify(this.selectTagInfo) === '{}' || Object.keys(this.selectTagInfo).length === 0) {
        return false;
      }
      return true;
    },
    statusType() {
      if (this.activeTabName === 'notFinsh') {
        return true;
      }
      return false;
    },
  },
  methods: {
    closeItem(sourceItem, sourceIndex) {
      if (sourceIndex !== 'YEAR') {
        this.$delete(this.selectTagInfo, sourceIndex);
        this.$delete(this.selectInfo, sourceIndex);
        this.$emit('closeItem', sourceItem, this.selectTagInfo);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.tagListContainer {
  min-height: 32px;
  .tagArea {
    display: inline-block;
    .tagItem {
      display: inline-block;
      height: 25px;
      line-height: 25px;
      border: 1px solid #d0d0d0;
      padding-left: 10px;
      padding-right: 10px;
      margin-right: 20px;
      margin-bottom: 5px;
      .tagTitle {
        color: #515a5a;
        margin-right: 8px;
      }
      .tagValue {
        color: #0085d0;
        font-weight: bold;
      }
      .close-icon {
        margin-left: 8px;
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
