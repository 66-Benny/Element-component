<template>
  <div>
      <scm-cascader ref="cascader"
                    :props="propsDynamic"
                    :options="requestOptions"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :clearable="clearable"
                    :filterable="filterable"
                    :show-all-levels="showAllLevels"
                    @change="change"
                    @blur="blur"
                    @focus="focus"
                    v-model="inner"></scm-cascader>
  </div>
</template>

<script>
import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';

const FETCH_PROVINCE_ACTION = 'mdm/fetchProvince'; // api-sys/api/sys/addr/pagination
const FETCH_CITY_ACTION = 'mdm/fetchCity'; // api-sys/api/sys/addr/user-info/citiesOfProvince
export default {
  name: 'ScmCitySelect',
  // ! FIXME 用于筛选器判断取得当前组件所显示Label名字
  componentName: 'ScmCascader',
  props: {
    level: {
      // 需要查询到省或者市 1: 省; 2: 市;
      type: Number,
      default: 2,
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
    // multiple: {
    //   // 是否严格的遵守父子节点不互相关联
    //   type: Boolean,
    //   default: false,
    // },
    excludeAddrCodeList: {
      // 排除省码（多个用,分割）
      type: String,
      default: '',
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    customList: {
      // 需要插入到备选列表中的数据(插入到首位)
      type: Array,
      default() {
        return [];
      },
    },
    theCityToBeShown: {
      // 要显示的省下的城市
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      // v-model
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    value: {
      handler(newVal) {
        // 绑定值发生改变是重新请求数据
        this.inner = newVal;
      },
      immediate: true,
    },
  },
  data() {
    return {
      propsDynamic: {
        value: 'addrCode',
        label: 'addrName',
        checkStrictly: this.checkStrictly,
      },
      requestOptions: [],
      inner: [],
      levelMapping: ['PROVINCE', 'CITY'],
      isClickChange: false,
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchProvinceList: state => state.mdm.province.viList,
      fetchCityList: state => state.mdm.city.viList,
    }),
    presentText() {
      return this.$refs.cascader.presentText;
    },
  },
  mounted() {
    this.getProvinceAndCity();
  },
  methods: {
    getProvinceAndCity() {
      this.fetchProvince({ excludeAddrCodeList: this.excludeAddrCodeList }).then(() => {
        let filterList = [];
        filterList = _.cloneDeep(this.fetchProvinceList);
        // 整理出自定义显示的数据
        if (this.customList.length > 0) {
          filterList.map((item) => {
            _.remove(this.customList, n => n.addrCode === item.addrCode);
            return item;
          });
        }
        // 整理出只需要显示的省下的城市
        if (this.theCityToBeShown.length > 0) {
          const selectProvince = [];
          this.theCityToBeShown.map((i) => {
            const iItem = i;
            filterList.map((j) => {
              const jItem = j;
              if (iItem === jItem.addrCode) {
                selectProvince.push(jItem);
              }
              return jItem;
            });
            return iItem;
          });
          filterList = _.cloneDeep(selectProvince);
        }
        // 将整理出的省和自定义的省进行合并
        filterList = _.cloneDeep([...this.customList, ...filterList]);
        // 递归给每一个节点添加叶子节点标记
        this.judgeLeaf(filterList, 1);
        this.requestOptions = filterList;
        // 如果要显示的列表只有一个省，且该省下至少有一个市，且需要显示到市
        // 先保存inner的值，给inner赋值，在取消赋值，为了只有一个省的时候自动打开他的子节点。
        if (this.requestOptions.length === 1
          && this.requestOptions[0].children
          && this.requestOptions[0].children.length > 0
          && this.level === 2) {
          const cloneInner = _.cloneDeep(this.inner);
          this.inner = [
            this.requestOptions[0].addrCode,
            this.requestOptions[0].children[0].addrCode,
          ];
          this.$nextTick(() => {
            this.inner = cloneInner;
          });
        }
      });
    },
    judgeLeaf(list, num) {
      // 建立层级关系
      let nextNum = num;
      nextNum += 1;
      list.map((i) => {
        const iItem = i;
        // 如果该层有子节点并且不是最后一级子节点，则继续递归添加叶子结点标记
        // 否则标记为叶子节点
        if (iItem.children && iItem.children.length > 0 && num < this.level) { // 1 < 2
          iItem.leaf = false;
          this.judgeLeaf(iItem.children, nextNum);
        } else {
          iItem.leaf = true;
          delete iItem.children;
          // 如果已标记了为叶子结点，并且不是最后一级叶子结点，则禁止点击
          if (num < this.level && !this.checkStrictly) {
            iItem.disabled = true;
          }
        }
        return iItem;
      });
    },
    // 获取省列表
    fetchProvince(params) {
      return this.$store.dispatch(FETCH_PROVINCE_ACTION, {
        ...params,
      });
    },
    // 获取市列表
    fetchCity(params = {}) {
      return this.$store.dispatch(FETCH_CITY_ACTION, {
        ...params,
        pageNum: 1,
        pageSize: 200,
      });
    },
    change(value, label, selectedNodes) {
      this.isClickChange = true;
      setTimeout(() => {
        this.isClickChange = false;
      });
      this.$emit('input', value);
      this.$emit('change', { value, label, selectedNodes });
    },
    blur(event) {
      this.$emit('blur', event);
    },
    focus(event) {
      this.$emit('focus', event);
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
