<template>
  <basic-dialog :visible.sync="innerVisible"
                title="查询小类信息"
                class="dialog-wrap"
                width="1080px">
    <scm-dialog-sub-header title="查询小类信息"
                           class="bank-common-select-dialog__header">
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
    <div class="bank-select bank-common-select-dialog">
      <scm-form :model="condition"
                @submit.native="onSearch"
                ref="conditionForm"
                label-position="top"
                inline
                class="search-condition">
        <scm-form-item label="小类编码"
                       prop="productCatalogCode3">
          <scm-input v-model="condition.productCatalogCode3"
                      :disabled="productCatalogCode3Disabled"></scm-input>
        </scm-form-item>
        <scm-form-item label="小类名称"
                       prop="productCatalogName3">
          <scm-input v-model="condition.productCatalogName3"
                      :disabled="productCatalogName3Disabled"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed></scm-divider>
      <scm-table ref="multipleTable"
                 :data="tableData.viList"
                 v-loading="fetchDataLoading"
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
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="小类编码"
                          prop="productCatalogCode3"></scm-table-column>
        <scm-table-column label="小类名称"
                          prop="productCatalogName3"></scm-table-column>
      </scm-table>
      <scm-pagination v-show="tableData.viTotal"
                      :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="tableData.viTotal?tableData.viTotal:0"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>

    </div>

  </basic-dialog>
</template>

<script>
import _ from 'lodash';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_DATA_ACTION = 'mdm/fetchSubclass';

export default {
  name: 'ScmBankSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    poYear: {
      // 有效年份
      type: String,
      default: '',
    },
    inputProductCatalogCode3: {
      // 小类编码
      type: String,
      default: '',
    },
    productCatalogCode3Disabled: {
      // 是否禁用小类编码
      type: Boolean,
      default: false,
    },
    inputProductCatalogName3: {
      // 小类名称
      type: String,
      default: '',
    },
    productCatalogName3Disabled: {
      // 是否禁用小类名称
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      condition: { // 搜索显示栏参数
        productCatalogCode3: this.inputProductCatalogCode3,
        productCatalogName3: this.inputProductCatalogName3,
      },
      initCondition: {
        productCatalogCode3: '',
        productCatalogName3: '',
      }, // 点击清空按钮需要重置的参数
      cloneCondition: {}, // 最终的请求参数
      fetchDataLoading: false,
      tableData: {
        viList: [],
        viTotal: 0,
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
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
  },
  // wathc: {
  //   inputTaskCode(newVal) {
  //     this.condition.taskCode = newVal;
  //     this.onSearch(true);
  //   },
  // },
  mounted() {
    this.onSearch(true);
  },
  methods: {
    fetchData() {
      const {
        pageSize,
        currentPage,
        addrCode,
        poYear,
      } = this;
      this.fetchDataLoading = true;
      this.$store.dispatch(FETCH_DATA_ACTION, {
        pageNum: currentPage,
        pageSize,
        addrCode,
        poYear,
        ...this.cloneCondition,
      }).then((res) => {
        this.tableData = res.res;
      }).finally(() => {
        this.fetchDataLoading = false;
      });
    },
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
    onSearch(initSearch) {
      // initSearch: 是否需要修改点击清空按钮需要重置的参数
      if (initSearch) {
        this.initCondition = _.cloneDeep(this.condition);
        if (!this.productCatalogCode3Disabled) {
          this.initCondition.productCatalogCode3 = '';
        }
        if (!this.productCatalogName3Disabled) {
          this.initCondition.productCatalogName3 = '';
        }
      }
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchData();
    },
    onClear() {
      Object.assign(this.condition, this.initCondition);
    },
    onPrevious() {
      this.$emit('select', '');
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
      this.$refs.multipleTable.clearSelection();
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
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchData();
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    groupChange() {
      this.condition.cityCode = '';
    },
  },
};
</script>

<style lang="scss">
.bank-select {
  .el-divider {
    margin-top: 0px;
    margin-bottom: 15px;
  }
  .el-form-item {
    width: 216px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .el-table {
    margin-bottom: 10px;
  }
}
</style>


<style lang="scss" scoped>
.dialog-wrap {
  /deep/ .el-dialog__body {
    max-height: inherit;
  }
}
</style>
