<template>
  <scm-menu active-text-color="#4a4a4a"
            :default-active="activeMenu"
            collapse
            @select="onSelectMenu"
            class="scm-auto-menu">
    <scm-auto-menu-item v-for="(menuItem, index) in innerData"
                        :key="`top-${index}`"
                        :menu-item-data="menuItem"
                        :baseData="baseData"
                        :parent-index="`${index}`"
                        :sub-menu-popper-class="subMenuPopperClass"></scm-auto-menu-item>
  </scm-menu>
</template>

<script>
import _ from 'lodash';
import ScmAutoMenuItem from './scm-auto-menu-item';

export default {
  name: 'ScmAutoMenu',
  props: {
    data: Array,
    activeMenu: String,
    subMenuPopperClass: String,
  },
  data() {
    return {
      innerData: [],
      baseData: [],
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        // this.innerData = val;
        this.baseData = _.cloneDeep(val);
        this.innerData = this.deleteSubList(val);
      },
    },
  },
  methods: {
    deleteSubList(parentList) {
      parentList.map((item) => {
        const i = item;
        if (i.list) {
          i.list = [];
        }
        return i;
      });
      return parentList;
    },
    onSelectMenu(index, indexPath, value) {
      this.$emit('select', index, indexPath, value);
    },
  },
  components: {
    ScmAutoMenuItem,
  },
};
</script>
<style lang="scss">
.el-menu {
  .el-submenu__title,
  .el-menu-item {
    font-size: 12px;
    color: #4a4a4a;
  }
  .el-submenu {
    height: 30px;
    line-height: 30px;

    & > .el-submenu__title {
      height: 30px;
      line-height: 30px;

      &:hover {
        background-color: #0085d0;
        color: #fff;
      }
      color: #4a4a4a;
    }
    &.is-opened {
      background-color: #0085d0;
      & > .el-submenu__title {
        color: #fff;
      }
    }
  }
  .el-menu-item {
    color: #4a4a4a;
    &:hover {
      background-color: #0085d0;
      color: #fff;
    }
  }
}
</style>
