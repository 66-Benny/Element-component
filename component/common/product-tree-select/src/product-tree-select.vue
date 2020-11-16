<template>
  <div>
      <scm-cascader ref="cascader"
                    :props="propsDynamic"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :clearable="clearable"
                    :showAllLevels="showAllLevels"
                    v-model="inner"
                    @change="change"
                    @blur="blur"
                    @focus="focus">
      </scm-cascader>
  </div>
</template>

<script>
import { StoreGlobalAPI } from 'scm-sdk';

const FETCH_PRODUCT_TREE_ACTION = 'mdm/fetchProductTree';
export default {
  name: 'ScmProductTreeSelect',
  componentName: 'ScmCascader',
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    productType: {
      // 产品类型
      type: String,
      default: '2',
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
    checkStrictly: {
      // 是否严格的遵守父子节点不互相关联
      type: Boolean,
      default: false,
    },
    level: {
      // 需要查询的层级号
      type: Number,
    },
    isHideGreaterLevel: {
      // 是否隐藏大于level参数的数据
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.inner = newVal;
      },
      immediate: true,
    },
  },
  data() {
    const self = this;
    return {
      propsDynamic: {
        lazy: true,
        checkStrictly: this.checkStrictly,
        value: 'productNum',
        label: 'productName',
        children: 'list',
        lazyLoad(node, resolve) {
          const v = node;
          if (!v.children || v.children.length <= 0) {
            self.fetchProductTree({
              productNum: node.path,
            }).then(() => {
              if (self.level) {
                self.fetchProductTreeList.viList.map((item) => {
                  const I = item;
                  if (v.level > self.level - 1) {
                    I.disabled = true;
                  }
                  if (self.isHideGreaterLevel && v.level + 1 >= self.level) {
                    I.leaf = true;
                  }
                  return I;
                });
              }
              resolve(self.fetchProductTreeList.viList);
            });
          } else {
            resolve();
          }
        },
      },
      inner: [],
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchProductTreeList: state => state.mdm.productTree,
    }),
    presentText() {
      return this.$refs.cascader.presentText;
    },
  },
  mounted() {},
  methods: {
    change(value, label, selectedNodes) {
      this.$emit('input', value);
      this.$emit('change', { value, label, selectedNodes });
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
        productType: this.productType,
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
