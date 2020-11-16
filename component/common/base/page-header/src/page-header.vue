<template>
  <div class="el-page-header">
    <scm-breadcrumb separator="/">
      <scm-breadcrumb-item
        v-for="(crumb, index) in breadCrumbListProxy"
        :to="crumb.path && index !== breadCrumbListProxy.length - 1
        ? { path: crumb.path } : undefined"
        replace
        :key="`${crumb.path}-${crumb.path}`">{{ crumb.title }}</scm-breadcrumb-item>
    </scm-breadcrumb>
  </div>
</template>
<script>
// import _ from 'lodash';
import { constants } from 'scm-sdk';

export default {
  name: 'ScmPageHeader',
  props: {
    // 自定义面包屑内容
    // {
    //   title:'我是标题', //必填
    //   path:'/web-xxxx/abc' //选填，如不填则点击不了
    // }
    customerBreadcrumb: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    breadCrumbList() {
      return this.$store.getters[constants.STORE_KEY.GET_BREAD_CRUMB_LIST];
    },
    breadCrumbListProxy() {
      if (this.customerBreadcrumb && this.customerBreadcrumb.length !== 0) {
        return this.customerBreadcrumb;
      }
      return this.breadCrumbList;
    },
  },
  methods: {
    getRootBreadCrumbList() {
      return this.breadCrumbList;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-page-header {
  .el-breadcrumb {
    margin: 15px 0;
  }
}
</style>
