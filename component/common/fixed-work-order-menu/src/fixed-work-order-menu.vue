<template>
    <div class="fixed-menu" >
          <scm-dropdown @command="onDropdownMenuClick"
                        @visible-change="visibleChange"
                        placement="top"
                        class="dropdown-contain">
            <span class="dropdown-head" :class="isActive?'isActive':''">
             <img class="normal" src="./icon1.png" v-show="isActive">
             <img class="normal" src="./icon.png" v-show="!isActive">
            </span>
            <scm-dropdown-menu slot="dropdown">
              <scm-dropdown-item v-for="(item ) in dataList"  :command="item.id" :key="item.id">
                {{item.dictEntryName}}
              </scm-dropdown-item>
            </scm-dropdown-menu>
          </scm-dropdown>
  </div>
</template>
<script>
// import _ from 'lodash';
import { constants } from 'scm-sdk';
// import { Loading, Message } from 'scm-ui';

// let loadingInstance;
import { getWorkOrderInfo } from '@/model/common/opnsrpt/util.js';

export default {
  name: 'fixedWorkOrderMenu',
  props: {
    dataList: {
      type: Array,
    },
  },
  computed: {
  },
  watch: {
  },
  beforeCreate() {
  },
  created() {

  },
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    onDropdownMenuClick(workOrderType) {
      const { currentPageModule } = getWorkOrderInfo();
      const sysModule = currentPageModule.reduce((res, item) => {
        res.push(item.value);
        return res;
      }, []);

      const dict = this.dataList.find(item => item.id === workOrderType);

      this.$emit('open', {
        global: true,
        tab: {
          name: dict.dictEntryName,
        },
        category: constants.SYSTEM_CATEGORY.G4,
        path: '/web-opnsrpt/workorder/opsorder-create',
        query: {
          fromName: 'business',
          product: 'SCM',
          sysModule: sysModule.join(),
          workOrderType: dict.dictEntryCode,
        },
      });
      // tab页内部跳转
      // this.$router.push({
      //   global: true,
      //   tab: {
      //     name: dict.dictEntryName,
      //   },
      //   path: '/web-opnsrpt/workorder/opsorder-create',
      //   query: {
      //     fromName: 'business',
      //     product: 'SCM',
      //     sysModule: sysModule.join(),
      //     workOrderType: dict.dictEntryCode,
      //   },
      // });
    },
    visibleChange(val) {
      // console.log('val: ', val);
      this.isActive = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.fixed-menu{
  position: absolute;
    bottom: 15%;
    left: 0;
}
.el-dropdown-menu--small .el-dropdown-menu__item {
    background-color:#4E8DF6;
    color: #fff;
    height: 20px;
    line-height: 20px;
    padding: 10px;
}
.dropdown-contain{
    border: none;
}
/deep/ {
    .popper__arrow::after {
    border-top-color: #4E8DF6!important;
}
}
.el-dropdown-menu--small .el-dropdown-menu__item:hover {
    background-color:#0D58FD;
        border:none;
}
.dropdown-head{
    display: inline-block;
    width: 16px;height:16px;
    border-radius:2px;
    padding:5px 10px;
    border:none;
    outline: none;
    cursor: pointer;
    .normal{
        width: 16px;
        height:16px;
        border:none;
    }
}
   .dropdown-head:hover{
     border-radius:3px;
     background:#e0f5ff

    }
    .isActive{
        background: #0D58FD;
    }
    .isActive:hover{
      background: #0D58FD;
    }
</style>
