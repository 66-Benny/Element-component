<template>
  <div>
      <scm-cascader ref="cascader"
                    :props="propsDynamic"
                    :options="requestOptions"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :clearable="clearable"
                    :show-all-levels="showAllLevels"
                    @change="change"
                    @blur="blur"
                    @focus="focus"
                    v-model="inner"></scm-cascader>
  </div>
</template>

<script>
// import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';

const FETCH_PRODUCT_TREE_ACTION = 'mdm/fetchProductLevelTree';
const FETCH_ALL_PRODUCT_TREE_ACTION = 'mdm/fetchAllProductLevelTree';
export default {
  name: 'ScmProductLevelTreeSelect',
  // ! FIXME 用于筛选器判断取得当前组件所显示Label名字
  componentName: 'ScmCascader',
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    level: {
      // 需要查询的产品类 1: 大类; 2: 中类; 3: 小类
      type: Number,
    },
    placeholder: {
      // 输入框占位文本
      type: String,
      default: '',
    },
    disabled: {
      // 是否禁用
      type: Boolean,
      default: false,
    },
    clearable: {
      // 是否支持清空选项
      type: Boolean,
      default: false,
    },
    showAllLevels: {
      // 输入框中是否显示选中值的完整路径
      type: Boolean,
      default: true,
    },
    value: {
      type: [Array, String],
      default() {
        return [];
      },
    },
  },
  watch: {
    value: {
      handler(newVal) {
        if (typeof (newVal) === 'string' && this.level && newVal !== '') {
          this.propsDynamic.lazy = false;
          if (!this.isClickChange && newVal && newVal.length > 0) {
            this.fetchListTree({
              productNum: newVal,
              key: this.level,
              addrCode: this.addrCode,
            }).then(() => {
              this.requestOptions = this.fetchAllProductTreeList.viList;
              this.inner = this.fetchAllProductTreeList.viProductNumList;
              this.$emit('input', this.fetchAllProductTreeList.viProductNumList[this.level - 1]);
              this.propsDynamic.lazy = true;
            });
          } else {
            this.propsDynamic.lazy = true;
          }
        } else if (newVal === null || newVal === undefined || newVal === '') {
          this.inner = [];
        } else {
          this.inner = newVal;
        }
      },
      immediate: true,
    },
  },
  data() {
    const self = this;
    return {
      propsDynamic: {
        lazy: true,
        value: 'productNum',
        label: 'productName',
        children: 'list',
        lazyLoad(node, resolve) {
          const v = node;
          // v.children = [];
          if (!v.children || v.children.length <= 0) {
            self.fetchProductTree({
              key: self.level,
              productNum: node.path,
            }).then(() => {
              resolve(self.fetchProductTreeList.viList);
            });
          } else {
            resolve();
          }
        },
      },
      requestOptions: [],
      isClickChange: false,
      inner: [],
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchProductTreeList: state => state.mdm.productLevelTree,
      fetchAllProductTreeList: state => state.mdm.allProductLevelTree,
    }),
    presentText() {
      return this.$refs.cascader.presentText;
    },
  },
  mounted() {
  },
  methods: {
    fetchListTree(params) {
      return this.$store.dispatch(FETCH_ALL_PRODUCT_TREE_ACTION, {
        addrCode: this.addrCode,
        ...params,
      });
    },
    // 级联选择器节点点击事件
    change(values, labels, selectedNodes) {
      // selectList:选择到的数组
      // options:选项数据源
      this.isClickChange = true;
      setTimeout(() => {
        this.isClickChange = false;
      });
      if (this.showAllLevels) {
        this.$emit('input', values);
        this.$emit('change', { values, labels, selectedNodes });
      } else {
        this.$emit('input', values[this.level - 1]);
        this.$emit('change', {
          values,
          labels,
          value: values[this.level - 1],
          label: labels[this.level - 1],
          selectedNodes: selectedNodes[this.level - 1],
        });
      }
    },
    blur(event) {
      this.$emit('blur', event);
    },
    focus(event) {
      this.$emit('focus', event);
    },
    // 获取产品树接口
    fetchProductTree(params = {}) {
      return this.$store.dispatch(FETCH_PRODUCT_TREE_ACTION, {
        addrCode: this.addrCode,
        ...params,
      });
    },
  },
};
</script>

<style lang="scss">
  .el-cascader {
    width: 100%;
  }
  .el-cascader-menu__item{
    padding-right: 30px;
  }
</style>


<style lang="scss" scoped>
</style>
