<template>
  <scm-menu active-text-color="#4a4a4a"
            :default-active="activeMenu"
            v-show="isShowAutomenu"
            collapse
            mode="vertical"
            @select="onSelectMenu"
            class="scm-auto-menu">
    <scm-auto-menu-item v-for="(menuItem, index) in innerData"
                        @click.native="dissCode(menuItem)"
                        :key="`top-${index}`"
                        @getCode="efferentCode"
                        :menu-item-data="menuItem"
                        :parent-index="`${index}`"></scm-auto-menu-item>
  </scm-menu>
</template>

<script>
import ScmAutoMenuItem from './scm-auto-menu-item';

export default {
  name: 'ScmAutoMenu',
  props: {
    data: Array,
    activeMenu: String,
    isShowAutomenu: Boolean,
  },
  data() {
    return {
      innerData: [],
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.innerData = val;
      },
    },
  },
  methods: {
    onSelectMenu(index, indexPath, value) {
      this.$emit('select', index, indexPath, value);
    },
    dissCode(val) {
      this.$emit('getCodename', val);
    },
    efferentCode(val) {
      this.$emit('getCodename', val);
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
    height: 30px;
    line-height: 30px;
    &:hover {
      background-color: #0085d0;
      color: #fff;
    }
  }
}
</style>
