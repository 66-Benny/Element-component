<template>
  <basic-dialog :visible.sync="innerVisible"
                title="选择开具银行"
                width="1080px">
    <scm-dialog-sub-header title="开具银行信息查询管理"
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
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                inline
                class="search-condition">
        <scm-form-item label="银行名称"
                       prop="bankName">
          <scm-input v-model="condition.bankName"></scm-input>
        </scm-form-item>
        <scm-form-item label="银行代码"
                       prop="bankId">
          <scm-input v-model="condition.bankId"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed></scm-divider>
      <scm-table ref="multipleTable"
                 :data="bank.viList"
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
        <scm-table-column label="银行代码"
                          prop="bankId"
                          width="150"></scm-table-column>
        <scm-table-column label="银行名称"
                          prop="bankName"></scm-table-column>
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

const FETCH_DATA_ACTION = 'mdm/fetchBank';

export default {
  name: 'ScmBankSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
  },
  data() {
    return {
      condition: {
        bankName: '',
        bankId: '',
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchDataLoading: state => state.loading.actions[FETCH_DATA_ACTION],
      bank: state => state.mdm.bank,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.bankName || this.condition.bankId);
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
      } = this;
      this.$store.dispatch(FETCH_DATA_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
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
