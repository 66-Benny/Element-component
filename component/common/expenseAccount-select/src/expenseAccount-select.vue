<template>
  <basic-dialog :visible.sync="innerVisible"
                title="费用科目"
                width="1080px">
    <scm-dialog-sub-header title="费用科目搜索帮助"
                           class="expenseAccount-common-select-dialog__header">
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
    <div class="expenseAccount-select expenseAccount-common-select-dialog">
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                inline
                class="search-condition">
        <scm-form-item label="费用科目值"
                       prop="flexValueDisp">
          <scm-input v-model="condition.flexValueDisp"></scm-input>
        </scm-form-item>
        <scm-form-item label="费用科目说明"
                       prop="description">
          <scm-input v-model="condition.description"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed></scm-divider>
      <scm-table ref="multipleTable"
                 :data="fetchDataList.viList"
                 v-loading="fetchDataLoading"
                 highlight-current-row
                 @selection-change="handleSelectionChange"
                 @current-change="onCurrentRowChange"
                 max-height="325"
                 class="search-result-table"
                 row-key="productNum">
        <scm-table-column type="selection"
                          v-if="multiple"
                          reserve-selection
                          width="40"></scm-table-column>
        <scm-table-column type="index"
                          width="54"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="费用科目值" width="150"
                          prop="flexValueDisp"></scm-table-column>
        <scm-table-column label="费用科目说明"
                          prop="description"
                          ></scm-table-column>
      </scm-table>
      <scm-pagination v-show="fetchDataList.viTotal"
                      :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="fetchDataList.viTotal?fetchDataList.viTotal:0"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>

    </div>

  </basic-dialog>
</template>

<script>
import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_DATA_ACTION = 'mdm/fetchExpenseAccount';

export default {
  name: 'ScmExpenseAccountSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    loginUserId: {
      // 登录者用户ID
      type: String,
    },
    summaryFlag: {
      // 父(Y:是 N:否)
      type: String,
    },
    enabledFlag: {
      // 是否启用(Y:是 N:否)
      type: String,
    },
    accountType: {
      // 账户类型(A:资产类账户 L:负债类账户 O:所有者权益类账户 R:收入类账户 E:费用类账户)
      type: String,
    },
    segmentType: {
      // 段类型(CMCC_COA_CO:公司段 CMCC_COA_CC：成本中心段 CMCC_COA_AC：科目段 CMCC_COA_SAC：子目段;
      // CMCC_COA_IC：往来段 CMCC_COA_PJ：项目段 CMCC_COA_SP1：备用段1 CMCC_COA_SP2：备用段2 )
      type: String,
    },
  },
  data() {
    return {
      condition: {
        flexValueDisp: '',
        description: '',
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchDataLoading: state => state.loading.actions[FETCH_DATA_ACTION],
      fetchDataList: state => state.mdm.expenseAccount,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.flexValueDisp || this.condition.description);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData(params = {}) {
      const {
        pageSize,
        currentPage,
        loginUserId,
        summaryFlag,
        enabledFlag,
        accountType,
        segmentType,
      } = this;
      this.$store.dispatch(FETCH_DATA_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
        loginUserId,
        summaryFlag,
        enabledFlag,
        accountType,
        segmentType,
      });
    },
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
    onSearch() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      }
      this.fetchData(this.condition);
      this.$refs.multipleTable.clearSelection();
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onPrevious() {
      this.$emit('select', '');
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
      this.$refs.multipleTable.clearSelection();
    },
    onFormSubmit() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      }
      this.fetchData(this.condition);
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
      this.fetchData(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchData(this.condition);
    },
  },
};
</script>

<style lang="scss">
.expenseAccount-select {
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
</style>
