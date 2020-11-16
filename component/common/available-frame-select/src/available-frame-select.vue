<template>
  <basic-dialog :visible.sync="innerVisible"
                title="框架/合同项目信息"
                width="1080px">
    <scm-dialog-sub-header title="框架/合同项目信息"
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
          {{submitBtnName}}
        </scm-dialog-sub-header-button>
      </template>
    </scm-dialog-sub-header>
    <div class="bank-select bank-common-select-dialog">
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                inline
                class="search-condition">
        <scm-form-item label="产品编码"
                       prop="prodFullId">
          <scm-input v-model="condition.prodFullId"></scm-input>
        </scm-form-item>
        <scm-form-item label="项目经理"
                       prop="prjMgr">
          <scm-input v-model="condition.prjMgr"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed></scm-divider>
      <scm-table ref="multipleTable"
                 :data="bank.viList"
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
                          width="54"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="产品编码"
                          prop="prodId"
                          width="90"></scm-table-column>
        <scm-table-column label="产品名称"
                          prop="prodName"></scm-table-column>
        <scm-table-column label="框架/合同号"
                          prop="zcoid"
                          width="150"></scm-table-column>
        <scm-table-column label="框架/合同描述"
                          prop="zcomc"
                          width="200"></scm-table-column>
        <scm-table-column label="采购项目"
                          prop="zcgxm"
                          width="130"></scm-table-column>
        <scm-table-column label="项目经理"
                          prop="prjMgr"
                          width="80"></scm-table-column>
        <scm-table-column label="供应商名称"
                          prop="lifnrName"
                          width="120"></scm-table-column>
      </scm-table>
      <scm-pagination v-show="bank.viTotal"
                      :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="bank.viTotal?bank.viTotal:0"
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

const FETCH_DATA_ACTION = 'mdm/fetchAvailableFrame';

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
    submitBtnName: {
      // 提交按钮名称
      type: String,
      default: '提交',
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    inputProdFullId: {
      // 产品编码
      type: String,
      default: '',
    },
    inputPrjMgr: {
      // 项目经理
      type: String,
      default: '',
    },
  },
  data() {
    return {
      condition: {
        prodFullId: this.inputProdFullId,
        prjMgr: this.inputPrjMgr,
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchDataLoading: state => state.loading.actions[FETCH_DATA_ACTION],
      bank: state => state.mdm.availableFrame,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.prodFullId || this.condition.prjMgr);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.fetchData(this.condition);
  },
  methods: {
    fetchData(params = {}) {
      const {
        pageSize,
        currentPage,
      } = this;
      this.$store.dispatch(FETCH_DATA_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        addrCode: this.addrCode,
        ...params,
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
</style>
