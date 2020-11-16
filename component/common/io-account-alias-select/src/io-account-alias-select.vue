<template>
  <basic-dialog :visible.sync="innerVisible"
                title="库存组织账户别名信息"
                class="dialog-wrap"
                width="1080px">
    <scm-dialog-sub-header title="库存组织账户别名管理"
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
        <scm-form-item label="账户别名"
                       prop="mdDescription">
          <scm-input v-model="condition.mdDescription"></scm-input>
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
        <scm-table-column label="账户别名编码"
                          width="93"
                          prop="mdCode"></scm-table-column>
        <scm-table-column label="账户别名"
                          prop="mdDescription"></scm-table-column>
        <scm-table-column label="OU编码"
                          width="65"
                          prop="ouId"></scm-table-column>
        <scm-table-column label="OU名称"
                          prop="ouName"></scm-table-column>
        <scm-table-column label="库存组织ID"
                          width="83"
                          prop="organizationId"></scm-table-column>
        <scm-table-column label="库存组织编号"
                          width="93"
                          prop="organizationCode"></scm-table-column>
        <scm-table-column label="库存组织名称"
                          width="93"
                          prop="organizationName"></scm-table-column>
        <scm-table-column label="库存组织类型"
                          width="93"
                          prop="invTypeDescription"></scm-table-column>
        <scm-table-column label="公司编码"
                          width="69"
                          prop="companyCode"></scm-table-column>
        <scm-table-column label="费用账户"
                          width="69"
                          prop="costAccount"></scm-table-column>
        <scm-table-column label="起始日期"
                          width="88"
                          prop="effectiveDate"></scm-table-column>
        <scm-table-column label="到期日期"
                          width="88"
                          prop="expiryDate"></scm-table-column>
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

const FETCH_DATA_ACTION = 'mdm/fetchIoAccountAlias';

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
    ouId: { // ouId
      type: String,
    },
    // organizationId: { // 库存组织ID
    //   type: String,
    // },
    organizationCode: { // 库存组织代码
      type: String,
    },
  },
  data() {
    return {
      condition: { // 搜索显示栏参数
        mdDescription: '',
      },
      initCondition: {
        mdDescription: '',
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
      flagList: [
        {
          value: '1',
          label: '大区 — 省份',
        },
        {
          value: '2',
          label: '大区 — 省份 — 地市',
        },
      ],
      showCol: false,
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
    this.onSearch();
  },
  methods: {
    fetchData() {
      const {
        pageSize,
        currentPage,
        addrCode,
        ouId,
        // organizationId,
        organizationCode,
      } = this;
      this.fetchDataLoading = true;
      this.$store.dispatch(FETCH_DATA_ACTION, {
        pageNum: currentPage,
        pageSize,
        addrCode,
        ouId,
        // organizationId,
        organizationCode,
        ...this.cloneCondition,
      }).then((res) => {
        this.tableData = res.res;
        if (res.payload.selectKey === '1') {
          this.showCol = false;
        } else {
          this.showCol = true;
        }
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
