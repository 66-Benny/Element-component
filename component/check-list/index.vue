<template>
  <div class="checkListContainer">
    <scm-popover :placement="placement"
      :width="width"
      trigger="click"
      popper-class="checkListPopper"
      v-model="visible">
      <div class="innerContent">
        <div class="topArea">
          <scm-row :gutter="20">
            <scm-col :span="2">
              <scm-checkbox v-model="checkedAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"></scm-checkbox>
            </scm-col>
            <scm-col :span="22">
              <scm-input v-model="searchTxt"
                placeholder="请输入搜索关键字"></scm-input>
            </scm-col>
          </scm-row>
        </div>

        <div class="middleArea"
          :style="middleAreaStyleCom">
          <scm-checkbox-group v-model="selectList">
            <scm-checkbox :label="item.key"
              v-for="(item,index) in listBySearchTxt"
              :key="index">{{item.title}}</scm-checkbox>
          </scm-checkbox-group>
        </div>

        <div class="bottomArea">
          <scm-button @click="onConfirm"
            type="primary"
            size="mini"
            class="left">确认</scm-button>
          <scm-button @click="onCancel"
            class="right"
            size="mini">取消</scm-button>
        </div>
      </div>

      <scm-button slot="reference"
        size="mini"
        type="primary">{{buttonText}}</scm-button>
    </scm-popover>
  </div>
</template>

<script>
// props
// placement 出现位置 默认right
// buttonText 按钮文字内容
// width 宽度 默认300
// height 高度 默认 400
// list check数据
// list.value check的value值
// list.label check的label值
// v-model="Array[{value:1},{value:2}]" 绑定value值

// event
// cancel 取消事件
// confirm 确认事件

// methods
// clear 清空选择

import { endsWith } from 'lodash';

export default {
  name: 'check-list',
  props: {
    placement: {
      type: String,
      default: 'right',
    },
    buttonText: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '300',
    },
    height: {
      type: String,
      default: '250',
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    // visible: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  data() {
    return {
      isIndeterminate: false,
      checkedAll: false, // 是否勾选所有
      searchTxt: '', // 搜索的关键字
      selectList: [],
      visible: false,
    };
  },
  created() {},
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(sourceList) {
        this.selectList = [...new Set([...sourceList.map(item => item.key), ...this.selectList])];
      },
    },
  },
  computed: {
    listBySearchTxt() {
      this.reSetCheckAll();
      return this.list.filter(item => item.title.includes(this.searchTxt));
    },
    middleAreaStyleCom() {
      if (endsWith(this.height, 'px') || endsWith(this.height, '%')) {
        return `height:${this.height};`;
      }
      return `height:${this.height}px;`;
    },
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
    clear() {
      this.selectList = [];
      this.searchTxt = '';
    },
    // 点击确认
    onConfirm() {
      const list = this.list.filter(item =>
        this.selectList.includes(item.key));
      this.$emit('confirm', list);
      this.$emit('update:key', list);
      this.visible = false;
    },
    onCancel() {
      this.$emit('cancel');
      this.visible = false;
    },
    // 重置checkall状态
    reSetCheckAll() {
      if (this.list.length === this.selectList.length) {
        this.isIndeterminate = false;
        this.checkedAll = true;
      } else if (this.selectList.length === 0) {
        this.isIndeterminate = false;
        this.checkedAll = false;
      } else {
        this.isIndeterminate = true;
      }
    },
    // 手动变更checkall状态
    handleCheckAllChange(isCheckAll) {
      this.isIndeterminate = false;
      if (isCheckAll) {
        if (this.searchTxt) {
          this.selectList = [
            ...new Set(this.selectList.concat(this.listBySearchTxt.map(item => item.key))),
          ];
        } else {
          this.selectList = this.list.map(item => item.key);
        }
      } else if (!isCheckAll && this.searchTxt) {
        this.listBySearchTxt.forEach((item) => {
          const index = this.selectList.findIndex(ci => ci === item.key);
          if (index !== -1) {
            this.selectList.splice(index, 1);
          }
        });
      } else {
        this.selectList = [];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.checkListContainer {
  display: inline-block;
}
</style>
<style lang="scss">
.checkListPopper {
  padding: 5px;
  .innerContent {
    .topArea {
      padding: 5px;
      background-color: #94b9cd;
      .el-checkbox {
        vertical-align: middle;
      }
    }
    .middleArea {
      overflow: auto;
      .el-checkbox-group {
        .el-checkbox {
          display: block;
          padding: 4px 5px 4px 5px;
        }
        .el-checkbox + .el-checkbox {
          margin-left: 0px;
        }
        & .el-checkbox:nth-child(even) {
          background-color: #f5fcff;
        }
      }
    }
    .bottomArea {
      padding: 5px;
      .right {
        float: right;
      }
    }
  }
}
</style>
