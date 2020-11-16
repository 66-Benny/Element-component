<template>
  <scm-container direction="vertical" class="scm-system-fourth-container">
    <scm-header height="100px">
      <div class="title-bar">
        <span class="brand">
          <img src="./logo.png"/>
          <div class="brand-title">供应链管理系统(开发环境)</div>
        </span>
        <span class="user-container">
          <span class="user-name">
            {{ currentUser ?
            `${currentUser.employeeName}(${currentUser.addrName})` : '请点击切换用户' }}
          </span>
          <scm-button type="text"
                      @click="isShowSwitchUser = true">切换用户</scm-button>
        </span>
      </div>
      <scm-menu class="app-menu"
                mode="horizontal"
                background-color="#6F7E95"
                text-color="#FFFFFF"
                active-text-color="#FFFFFF"
                @select="handleSelect">
        <scm-menu-item index="workspace" disabled>我的工作台</scm-menu-item>
        <scm-submenu popper-class="scm-fake-basic-layout-submenu" index="businessManagement">
          <template slot="title">业务办理</template>
          <scm-menu-item v-for="menu in menuList"
                         :index="menu.name"
                         :key="menu.name"
                         class="menu-item">
            {{ menu.title }}
          </scm-menu-item>
        </scm-submenu>
        <scm-menu-item index="otherSystem" disabled>相关系统</scm-menu-item>
      </scm-menu>
    </scm-header>
    <scm-main>
      <basic-layout :prefix-cls="prefixCls"></basic-layout>
    </scm-main>
    <switch-user @select="isShowSwitchUser = false"
                 :visible.sync="isShowSwitchUser">
    </switch-user>
  </scm-container>
</template>
<script>
import _ from 'lodash';
import SwitchUser from '../../../switch-user';
import userList from '../../../switch-user/src/user-list.json';
import { updateUserInfo } from '../../../switch-user/src/util';
import BasicLayout from '../../basic-layout';

function convertRouteToMenuItem({
  children,
  meta,
  name,
  path,
}, parentPath) {
  const link = parentPath.indexOf('/') !== parentPath.length - 1
    ? `${parentPath}${path}` : `${parentPath}${path}`;
  const retChildren = [];
  if (children && children.length > 0 && (meta && meta.hideChildrenInMenu !== true)) {
    children.forEach((item) => {
      retChildren.push(convertRouteToMenuItem(item, link));
    });
  }
  return {
    name,
    title: meta.title,
    link,
    path: link,
    icon: meta.icon || '',
    children: retChildren,
  };
}

export default {
  name: 'app',
  props: {
    prefixCls: String,
  },
  components: {
    BasicLayout,
    SwitchUser,
  },
  beforeCreate() {
    if (typeof window.top.getSelectedTabId !== 'function') {
      window.top.getSelectedTabId = () => '';
    }
    if (typeof window.top.getMenuFullNameByMenuId !== 'function') {
      window.top.getMenuFullNameByMenuId = () => ['采购管理'];
    }
  },
  /**
   * 导航守卫，通过此守卫设置默认用户
   */
  beforeRouteEnter(to, from, next) {
    const session = window.sessionStorage;
    let currentEmployeeInfo = session.getItem('CURRENTEMPLOYEEINFO');
    // 如果没有设置用户的场合，使用 `zhanghuan6` 作为默认用户
    if (currentEmployeeInfo === undefined ||
      currentEmployeeInfo === null || currentEmployeeInfo === '') {
      currentEmployeeInfo = userList['zhanghuan6@tj.cmcc'];
      updateUserInfo(currentEmployeeInfo);
    }
    next();
  },
  computed: {
    currentUser() {
      const user = this.$store.getters['systemConfig/user'];
      return user;
    },
    menuList() {
      const ret = [];
      const index = _.findIndex(this.$router.options.routes, r => r.name.toLowerCase() === 'index');
      if (index !== -1) {
        const mainRoute = this.$router.options.routes[index];
        // ret = mainRoute.children.map(item => convertRouteToMenuItem(item, mainRoute.path));
        mainRoute.children.forEach((item) => {
          if (!item.meta.hidden) {
            ret.push(convertRouteToMenuItem(item, mainRoute.path));
          }
        });
      }
      return ret;
    },
  },
  data() {
    return {
      isShowSwitchUser: false,
    };
  },
  methods: {
    handleSelect(index) {
      this.$router.push({
        name: index,
      });
    },
  },
};
</script>
<style lang="scss">
.scm-fake-basic-layout-submenu {
    height:800px;
    overflow: auto;
  .menu-item {
    &.el-menu-item {
      font-size: 13px;
    }
  }
}
.scm-system-fourth-container {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  background-color: #f6f6f6;
  height: 100%;
  overflow-y: auto;

  .title-bar {
    height: 60px;
    line-height: 60px;
    max-width: 1280px;
    min-width: auto;
    margin-left: auto;
    margin-right: auto;

    .brand {
      img {
        vertical-align: middle;
      }

      .brand-title {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        margin-left: 15px;
        padding-left: 10px;
        border-left-color: #0085D0;
        border-left-width: 1px;
        border-left-style: solid;
        color: #0085D0;
        font-weight: 700;
      }
    }

    .user-container {
      float: right;
      .user-name,
      .el-button--text {
        font-size: 16px;
      }
    }
  }

  .app-menu {
    &.el-menu--horizontal {
      border-bottom: 0;

      & > .el-menu-item {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
      }

      & > .el-submenu {
        .el-submenu__title {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
        }
      }
    }
  }

  .el-main {
    padding-top: 0;
  }
}
.el-submenu__title {
  i {
    color: #ffffff;
  }
}
</style>
