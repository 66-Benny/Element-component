<!-- 搜索帮助（OU信息） -->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="公司信息"
                width="1000px">
    <div class="scm-company-select">
      <scm-dialog-sub-header title="公司信息操作管理">
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
        </template>
      </scm-dialog-sub-header>
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition">
        <scm-form-item label="省码"
                       prop="viAddrCode">
          <scm-input v-model="condition.viAddrCode"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="公司编码"
                       prop="viBukrs">
          <scm-input v-model="condition.viBukrs"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="公司名称"
                       prop="viDes">
          <scm-input v-model="condition.viDes"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="company.viList"
                 v-loading="fetchCompanyLoading"
                 highlight-current-row
                 @current-change="onCurrentRowChange"
                 ref="multipleTable"
                 max-height="337">
        <scm-table-column type="index"
                          width="100"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="公司编码"
                          prop="bukrs"
                          width="150"></scm-table-column>
        <scm-table-column label="公司名称"
                          prop="des"
                          width="200"></scm-table-column>
        <scm-table-column label="省码"
                          prop="addrCode"
                          width="270"></scm-table-column>
        <scm-table-column label="环境名称"
                          prop="environmentName"
                          width="260"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      v-show="company.viTotal"
                      :total="company.viTotal"
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

const FETCH_COMPANY_ACTION = 'mdm/fetchCompany';

export default {
  name: 'ScmOuSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      condition: {
        viAddrCode: '',
        viBukrs: '',
        viDes: '',
      },
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchCompanyLoading: state =>
        state.loading.actions[FETCH_COMPANY_ACTION],
      company: state => state.mdm.company,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viAddrCode ||
          this.condition.viBukrs ||
          this.condition.viDes);
    },
  },
  mounted() {
    this.fetchCompany();
  },
  methods: {
    onSearch() {
      this.fetchCompany(this.condition);
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onFormSubmit() {
      this.fetchCompany(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchCompany();
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchCompany();
    },
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    fetchCompany(params = {}) {
      const { currentPage, pageSize } = this;
      this.$store.dispatch(FETCH_COMPANY_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
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
.scm-company-select {
  width: 100%;

  .search-condition {
    overflow: hidden;
    text-align: left;
    .el-form-item {
      float: left;
      margin-bottom: 10px;
      margin-right: 35px;
      .erp-map-name {
        width: 216px;
        height: 30px;
      }
    }
  }

  .divider {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .el-table {
    margin-bottom: 10px;
  }
}
</style>
