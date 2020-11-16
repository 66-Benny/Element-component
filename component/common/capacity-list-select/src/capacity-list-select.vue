<template>
  <basic-dialog :visible.sync="innerVisible"
                title="能力清单信息"
                width="1080px">
    <scm-dialog-sub-header title="能力清单信息查询管理"
                           class="bank-common-select-dialog__header">
    </scm-dialog-sub-header>
    <div class="bank-select bank-common-select-dialog">
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                inline
                class="search-condition">
        <scm-form-item label="产品编码"
                       prop="productId">
          <scm-input v-model="condition.productId" disabled></scm-input>
        </scm-form-item>
        <scm-form-item label="产品名称"
                       prop="productName">
          <scm-input v-model="condition.productName" disabled></scm-input>
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
        <scm-table-column type="index"
                          width="54"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="产品发布名称"
                          prop="publishName"></scm-table-column>
        <scm-table-column label="产品销售供应商编码"
                          prop="lifnrId"></scm-table-column>
        <scm-table-column label="产品销售供应商名称"
                          prop="lifnrName"></scm-table-column>
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

const FETCH_DATA_ACTION = 'masterdata/fetchCapacityList';

export default {
  name: 'ScmBankSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    prodFullId: {
      required: true,
      type: String,
    },
  },
  watch: {
    prodFullId: {
      handler(val) {
        this.condition.productId = val;
        this.fetchData({ prodFullId: val });
      },
      immediate: true,
    },
  },
  data() {
    return {
      condition: {
        productId: '',
        productName: '',
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchDataLoading: state => state.loading.actions[FETCH_DATA_ACTION],
      bank: state => state.masterdata.capacityList,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.productId || this.condition.productName);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
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
      })
        .then(() => {
          this.condition.productName = this.bank.viList[0].ablistName;
        });
    },
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
    onSearch() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      }
      this.fetchData({ prodFullId: this.prodFullId });
      this.$refs.multipleTable.clearSelection();
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onPrevious() {
      // this.$emit('select', '');
    },
    onSubmit() {
      // this.$emit('select', this.multipleSelection);
      this.$refs.multipleTable.clearSelection();
    },
    onFormSubmit() {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      }
      this.fetchData({ prodFullId: this.prodFullId });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onCurrentRowChange(val) {
      if (val && !this.multiple) {
        // this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchData({ prodFullId: this.prodFullId });
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchData({ prodFullId: this.prodFullId });
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
