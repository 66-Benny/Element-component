<!-- 搜索帮助（产品信息）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="产品信息"
                width="1080px">
    <div class="opi-select opi-common-select-dialog">
      <scm-dialog-sub-header title="产品信息操作管理" class="opi-common-select-dialog__header">
        <template slot="action">
          <scm-dialog-sub-header-button icon="search"
                                        @click="onSearch">
            搜索
          </scm-dialog-sub-header-button>
          <scm-divider type="vertical"></scm-divider>
          <scm-dialog-sub-header-button icon="clear"
                                        :disabled="clearDisabled"
                                        @click="onClear">
            清空
          </scm-dialog-sub-header-button>
          <scm-divider type="vertical"
                       v-if="nullValue"></scm-divider>
          <scm-dialog-sub-header-button icon="previous"
                                        v-if="nullValue"
                                        @click="onPrevious">
            返回空值
          </scm-dialog-sub-header-button>
          <scm-divider type="vertical"
                       v-if="multiple"></scm-divider>
          <scm-dialog-sub-header-button icon="submit"
                                        :disabled="submitDisabled"
                                        @click="onSubmit"
                                        v-if="multiple">
            提交
          </scm-dialog-sub-header-button>
        </template>
      </scm-dialog-sub-header>
      <scm-container class="scm-opi">
        <scm-aside width="220px" class="opi-menu" v-if="!isHideProductTree"
          v-loading="fetchOpiTreeLoading"
          element-loading-text="加载中...">
          <scm-auto-menu :data="opitree"
                         @select="handleSelect"></scm-auto-menu>
        </scm-aside>
        <scm-main class="scm-opi-main">
          <scm-form :model="condition"
                    @submit.native="onFormSubmit"
                    ref="conditionForm"
                    label-position="top"
                    class="search-condition"
                    :class="{'search-condition-large': isHideProductTree}">
            <scm-form-item label="小类编码"
                          prop="productCatalogCode3">
              <scm-input v-model="condition.productCatalogCode3"
                        :disabled="disabledProductCatalogCode3"
                        class="opi-dim-name"></scm-input>
            </scm-form-item>
            <scm-form-item label="产品编码"
                          prop="viproductNum">
              <scm-input v-model="condition.viproductNum"
                        class="opi-dim-name"></scm-input>
            </scm-form-item>
            <scm-form-item label="产品名称"
                          prop="viProName">
              <scm-input v-model="condition.viProName"
                        class="opi-dim-name"
                        ></scm-input>
            </scm-form-item>
            <scm-form-item label="采购类型"
                          prop="viProType"
                          v-show="!viTopoType">
              <scm-select v-model="condition.viProType"
                          :disabled="disabledProType"
                          class="opi-dim-name">
                <scm-option v-for="item of poType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                </scm-option>
              </scm-select>
            </scm-form-item>
            <scm-form-item label="是否能力清单"
                          prop="ablistFlg"
                          v-show="showAblistFlg">
              <scm-select v-model="condition.ablistFlg"
                          :disabled="disabledAblistFlg"
                          class="opi-dim-name">
                <scm-option v-for="item of ablistFlgList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                </scm-option>
              </scm-select>
            </scm-form-item>
            <scm-form-item label="是否存在可用框架"
                          prop="isIncludedContract"
                          v-show="showIsIncludedContract">
              <scm-select v-model="condition.isIncludedContract"
                          :disabled="disabledIsIncludedContract"
                          class="opi-dim-name">
                <scm-option label="全部" value="-1"></scm-option>
                <scm-option label="是" value="1"></scm-option>
                <scm-option label="否" value="0"></scm-option>
              </scm-select>
            </scm-form-item>
            <scm-form-item label="采购部门"
                          prop="purchasingDept"
                          v-show="showPurchasingDept">
              <scm-select v-model="condition.purchasingDept"
                          :disabled="disabledPurchasingDept"
                          class="opi-dim-name">
                <scm-option label="全部" value=""></scm-option>
                <scm-option label="采购一部" value="采购一部"></scm-option>
                <scm-option label="采购二部" value="采购二部"></scm-option>
                <scm-option label="采购三部" value="采购三部"></scm-option>
                <scm-option label="采购四部" value="采购四部"></scm-option>
              </scm-select>
            </scm-form-item>
            <scm-form-item label="产品范围"
                          prop="viproductType"
                          v-show="showViproductType">
              <scm-select v-model="condition.viproductType"
                          :disabled="disabledViproductType"
                          class="opi-dim-name">
                <scm-option label="目录产品" value="1"></scm-option>
                <scm-option label="细化产品" value="2"></scm-option>
              </scm-select>
            </scm-form-item>
          </scm-form>
          <scm-divider dashed
                      class="divider"></scm-divider>
          <!-- 全选隐藏与显示 -->
          <div class="table-wrap">
            <scm-table ref="multipleTable"
                      :data="opi.viList"
                      v-loading="fetchOpiLoading"
                      highlight-current-row
                      @selection-change="handleSelectionChange"
                      @current-change="onCurrentRowChange"
                      max-height="360"
                      class="search-result-table"
                      row-key="productNum">
              <scm-table-column type="selection"
                                v-if="multiple"
                                reserve-selection
                                width="40"></scm-table-column>
              <scm-table-column type="index"
                                width="54"
                                :index='getTableIndex'></scm-table-column>
              <scm-table-column label="产品编码"
                                prop="productNum"
                                width="94"></scm-table-column>
              <scm-table-column label="产品名称"
                                prop="productName"></scm-table-column>
              <scm-table-column label="小类名称"
                                prop="productCatalogName3"
                                width="130"></scm-table-column>
              <scm-table-column label="单位"
                                prop="unitOfMeasure"
                                width="53"></scm-table-column>
              <!-- <scm-table-column label="产品描述"
                                prop="productDes"
                                width="180"></scm-table-column> -->
              <scm-table-column label="采购类型"
                                prop="poTypeLabel"
                                width="121"></scm-table-column>
              <scm-table-column label="是否存在可用框架"
                                prop="isIncludedContract"
                                :formatter="formatterIsIncludedContract"
                                v-if="showIsIncludedContract"></scm-table-column>
              <scm-table-column label="采购部门"
                                prop="purchasingDept"
                                :formatter="formatterPurchasingDept"
                                v-if="showPurchasingDept"></scm-table-column>
            </scm-table>
            <scm-pagination v-show="opi.viTotal"
                            :page-sizes="[10, 20, 50]"
                            :page-size="pageSize"
                            :total="opi.viTotal?opi.viTotal:0"
                            :current-page="currentPage"
                            @size-change="onSizeChange"
                            @current-change="onCurrentPageChange">
            </scm-pagination>
          </div>
        </scm-main>
      </scm-container>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';
import ScmAutoMenu from '../../menu/scm-auto-menu';
// import { constants } from 'fs';

const FETCH_OPITREE_ACTION = 'mdm/fetchOpiTree'; // get/product-cata-tree/new
const FETCH_OPILIST_ACTION = 'mdm/fetchOpiList'; // find/product/list/pagination

export default {
  name: 'ScmOpiSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
    ScmAutoMenu,
  },
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    viproductType: {
      // 1 == 目录产品 2 == 细化产品
      required: true,
      type: String,
      default: '2',
    },
    zfbprod: {
      // 非标产品标识(1:一采非标;2:二采非标;3:标准产品; 空值：全部产品)
      type: String,
      default: '',
    },
    viTopoType: {
      // 采购类型(1:一级集采;2:二级集采;3:非集采;空值：全部类型)
      type: String,
      default: '',
    },
    flag: { // 动态显示下拉框 '1'包括一级集采 '2'不包括一级集采 是否参考总部合同创建
      type: String,
    },
    productNumList: { // 产品编码list 列子：'310101001,311001003'
      type: String,
    },
    productCatalogCode3: { // 小类编码 列子：'310101001,311001003'
      type: String,
      default: '',
    },
    isHideProductTree: {
      // 是否隐藏产品树
      type: Boolean,
      default: false,
    },
    poDetailType: { // 采购细化类型: 1:[1,2,3]; 2:[1,3,4,5]
      type: String,
      default: '1',
    },
    disabledProductCatalogCode3: {
      // 是否禁止点击小类编码
      type: Boolean,
      default: false,
    },
    disabledProType: {
      // 是否禁止点击采购类型
      type: Boolean,
      default: false,
    },
    inputAblistFlg: { // 是否能力清单
      type: String,
      default: '',
    },
    showAblistFlg: {
      // 是否显示是否能力清单
      type: Boolean,
      default: false,
    },
    disabledAblistFlg: {
      // 是否禁止是否能力清单
      type: Boolean,
      default: false,
    },
    closeClearSelection: {
      // 是否点击提交时清空多选
      type: Boolean,
      default: true,
    },
    inputProType: { // 采购类型
      type: String,
      default: '',
    },
    poYear: { // 采购年份
      type: String,
    },
    flgDel: { // 无效标识筛选
      type: String,
      default: '',
    },
    showIsIncludedContract: {
      // 是否显示是否存在可用框架合同
      type: Boolean,
      default: false,
    },
    inputIsIncludedContract: {
      // 是否存在可用框架合同 0：否；1：是, -1:全部
      type: String,
      default: '',
    },
    disabledIsIncludedContract: {
      // 是否禁止是否存在可用框架合同
      type: Boolean,
      default: false,
    },
    showPurchasingDept: {
      // 是否显示采购部门
      type: Boolean,
      default: false,
    },
    inputPurchasingDept: {
      // 采购部门 '':全部，1：采购一部；2：采购二部；3：采购三部；4：采购4部
      type: String,
      default: '',
    },
    disabledPurchasingDept: {
      // 是否禁止采购部门
      type: Boolean,
      default: false,
    },
    showViproductType: {
      // 是否显示产品范围
      type: Boolean,
      default: false,
    },
    disabledViproductType: {
      // 是否禁止产品范围
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      condition: {
        viProName: '',
        viProType: this.inputProType,
        viproductNum: '',
        productCatalogCode3: this.productCatalogCode3,
        ablistFlg: this.inputAblistFlg,
        isIncludedContract: this.inputIsIncludedContract,
        purchasingDept: this.inputPurchasingDept,
        viproductType: this.viproductType,
        // viproductCatalogCode3: '',
      },
      initCondition: {
        viProName: '',
        viProType: '',
        viproductNum: '',
        productCatalogCode3: '',
        ablistFlg: '',
        isIncludedContract: '',
        purchasingDept: '',
        viproductType: '2',
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
      poTypeList: [
        { value: '', label: '全部' },
        { value: '1', label: '一级集采' },
        { value: '2', label: '二级集采' },
        { value: '3', label: '非集采' },
        { value: '4', label: '二采核心' },
        { value: '5', label: '二采扩展' },
      ],
      poType2: [
        { value: '', label: '全部' },
        { value: '2', label: '二级集采' },
        { value: '3', label: '非集采' },
      ],
      ablistFlgList: [
        { value: '', label: '全部' },
        { value: '0', label: '否' },
        { value: '1', label: '是' },
      ],
      viTopoType1: [{ value: '1', label: '一级集采' }],
      viTopoType2: [{ value: '2', label: '二级集采' }],
      activeIndex: '1',
      isTypeNum: true,
      esopiData: '',
      isCheck: true,
      cloneCondition: {},
      poType: [],
      opitree: [],
      fetchOpiTreeLoading: false,
      opi: {
        viTotal: 0,
        viList: [],
      },
      fetchOpiLoading: false,
    };
  },
  computed: {
    clearDisabled() {
      return _.isEqual(this.condition, this.initCondition);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
    setTableMaxHeight() {
      let maxHeight = '275';
      // 当树隐藏，并且，两个条件不是同时出现的时候高度=360
      if (this.isHideProductTree && !(!this.viTopoType && this.showAblistFlg)) {
        maxHeight = '360';
      // 当树显示，并且，只要有一个条件显示时高度=360
      } else if (this.viTopoType && !this.showAblistFlg) {
        maxHeight = '360';
      }
      return maxHeight;
    },
  },
  mounted() {
    if (!this.isHideProductTree) {
      this.fetchOpiTree();
    }
    if (this.viTopoType === '1') {
      this.poType = this.viTopoType1;
      this.condition.viProType = '1';
    } else if (this.viTopoType === '2') {
      this.poType = this.viTopoType2;
      this.condition.viProType = '2';
    }
    const v = this.poTypeList;
    if (this.poDetailType === '1') {
      if (this.flag === '2') {
        this.poType = [v[0], v[2], v[3]];
      } else {
        this.poType = [v[0], v[1], v[2], v[3]];
      }
    } else if (this.poDetailType === '2') {
      if (this.flag === '2') {
        this.poType = [v[0], v[4], v[5], v[3]];
      } else {
        this.poType = [v[0], v[1], v[4], v[5], v[3]];
      }
    }
    // this.initCondition = _.cloneDeep(this.condition);
    if (this.disabledProductCatalogCode3) {
      this.initCondition.productCatalogCode3 = this.productCatalogCode3;
    }
    if (this.disabledProType) {
      this.initCondition.viProType = this.inputProType;
    }
  },
  watch: {
    innerVisible(newVal) {
      if (newVal && this.openRefresh) {
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        Object.assign(this.cloneCondition, this.condition);
        this.fetchOpiList(this.cloneCondition);
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
        }
      }
    },
    multiple() {
      this.$refs.multipleTable.clearSelection();
    },
    inputAblistFlg(val) {
      this.condition.ablistFlg = val;
    },
    productCatalogCode3(val) {
      this.condition.productCatalogCode3 = val;
    },
    // productNumList() {
    //   this.fetchOpiTree();
    // },
  },
  methods: {
    formatterIsIncludedContract(row, column, cellValue) {
      if (cellValue === '0') {
        return '否';
      } else if (cellValue === '1') {
        return '是';
      }
      return '';
    },
    formatterPurchasingDept(row, column, cellValue) {
      if (cellValue === '1') {
        return '采购一部';
      } else if (cellValue === '2') {
        return '采购二部';
      } else if (cellValue === '3') {
        return '采购三部';
      } else if (cellValue === '4') {
        return '采购四部';
      }
      return '';
    },
    handleSelect(key, kepath, val) {
      this.$refs.conditionForm.resetFields();
      this.condition.productCatalogCode3 = '';
      this.condition.viProName = val.$attrs.value.slice(val.$attrs.value.indexOf('_') + 1);
      this.condition.viproductNum = key;
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      }
      Object.assign(this.cloneCondition, this.condition);
      this.fetchOpiList(this.cloneCondition);
    },
    onSearch() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      }
      Object.assign(this.cloneCondition, this.condition);
      this.fetchOpiList(this.cloneCondition);
      this.$refs.multipleTable.clearSelection();
    },
    onClear() {
      Object.assign(this.condition, this.initCondition);
      if (this.disabledProductCatalogCode3) {
        this.condition.productCatalogCode3 = this.productCatalogCode3;
      }
      if (this.disabledProType) {
        this.condition.viProType = this.inputProType;
      }
    },
    onPrevious() {
      this.$emit('select', this.esopiData);
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
      if (this.closeClearSelection) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    clearSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    onFormSubmit() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      }
      Object.assign(this.cloneCondition, this.condition);
      this.fetchOpiList(this.cloneCondition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchOpiList(this.cloneCondition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchOpiList(this.cloneCondition);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onCurrentRowChange(val) {
      if (val && !this.multiple) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    fetchOpiTree() {
      // 产品树的获取
      const {
        viproductType,
        addrCode,
        zfbprod,
        viTopoType,
        flag,
      } = this;
      this.fetchOpiTreeLoading = true;
      this.$store.dispatch(FETCH_OPITREE_ACTION, {
        viproductType,
        addrCode,
        zfbprod,
        viTopoType,
        flag,
      }).then((res) => {
        this.opitree = res;
      }).finally(() => {
        this.fetchOpiTreeLoading = false;
      });
    },
    fetchOpiList(params = {}) {
      const {
        currentPage,
        pageSize,
        addrCode,
        zfbprod,
        viTopoType,
        flag,
        productNumList,
        poYear,
        flgDel,
        poDetailType,
      } = this;
      this.fetchOpiLoading = true;
      this.$store.dispatch(FETCH_OPILIST_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
        addrCode,
        zfbprod,
        viTopoType,
        flag,
        poDetailType,
        productNumList,
        flgDel,
        poYear,
      }).then((res) => {
        this.opi = res;
        this.fetchOpiLoading = false;
      }).finally(() => {
        this.fetchOpiLoading = false;
      });
    },
    // 获取table序号
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
  },
};
</script>
<style lang="scss">
.opi-common-select-dialog {
  .opi-menu {
    & > .el-menu {
      padding-left: 10px;
      padding-right: 10px;
      padding: 0;
      position: absolute;
      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        margin-bottom: 20px;
      }

      & > .el-submenu {
        background-color: #fff;
        color: #4a4a4a;

        & > .el-submenu__title {
          border-bottom: 1px dashed #cccccc;
          margin-left: -20px;
          color: #4a4a4a;
          padding: 0 !important;
          margin: 0;
          div {
            padding: 0 10px;
          }
          .el-submenu__icon-arrow {
            color: #9b9b9b;
            right: 10px;
            display: inherit;
            font-size: 14px;
            font-weight: 700;
          }
          &:hover {
            color: #fff;
          }
        }
        &:hover {
          & > .el-submenu__title {
            .el-submenu__icon-arrow {
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scope>
.el-menu--popup-right-start{
  max-height: 300px;
  overflow-y: auto;
  z-index: auto;
}
.opi-select {
  margin-bottom: -20px;
    .el-main{
      overflow:hidden;
    }
  .opi-common-select-dialog__header {
    margin-bottom: 0;
  }
  .scm-opi {
    background-color: #f6f6f6;
    margin-left: -10px;
    margin-right: -10px;
    position: relative;
    .opi-menu {
      padding-right: 10px;
      height: auto;
      background-color: #fff;
      overflow-y: auto;
      overflow-x: hidden;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      .el-menu {
        width: 100%;
        border-right-width: 0;
      }
    }
    .scm-opi-main {
      background-color: #fff;
      padding: 10px;
      width: 1px;
      padding-left: 230px;
      .search-condition {
        .el-form-item {
          width: 250px;
          display: inline-block;
          margin-bottom: 11px;
          margin-right: 25px;
        }
      }
      .search-condition.search-condition-large {
        .el-form-item {
          width: 235px;
        }
      }
      .el-divider {
        margin-top: 0px;
        margin-bottom: 15px;
      }
      .el-pagination {
        margin-top: 10px;
      }
    }
    .table-wrap {
      min-height: 379px;
    }
    // .scm-opi-select {
    //   display: inline-block;
    //   width: 800px;
    //   margin-left: 2px;
    //   vertical-align: top;

    //   .search-result-table {
    //     width: 100%;
    //   }

    //   .search-condition-opi {
    //     .el-form-item {
    //       width: 220px;
    //       .opi-dim-name {
    //         width: 100%;
    //       }
    //     }
    //   }
    //   .el-pagination {
    //     height: 30px;
    //   }
    //   .divider {
    //     margin-top: 0px;
    //     margin-bottom: 10px;
    //   }
    //   .el-table {
    //     margin-bottom: 10px;
    //   }
    // }
  }
}
</style>
