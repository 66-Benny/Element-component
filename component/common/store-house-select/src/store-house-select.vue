<template>
  <basic-dialog :visible.sync="innerVisible"
                title="仓库选择"
                class="dialog-wrap"
                width="1080px">
    <scm-dialog-sub-header title="仓库信息查询条件"
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
        <scm-form-item label="省份编码"
                       prop="addrCode">
          <scm-input v-model="condition.addrCode"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="OU组织编码"
                       prop="erpMapId">
          <scm-input v-model="condition.erpMapId"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="OU组织名称"
                       prop="erpMapName">
          <scm-input v-model="condition.erpMapName"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="工厂编码"
                       prop="werks">
          <scm-input v-model="condition.werks"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="工厂名称"
                       prop="name">
          <scm-input v-model="condition.name"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="仓库编码"
                       prop="lgort">
          <scm-input v-model="condition.lgort"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="仓库名称"
                       prop="lgobe">
          <scm-input v-model="condition.lgobe"
                     class="erp-map-name"></scm-input>
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
                          width="54"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="省份编码"
                          prop="addrCode"
                          width="80"></scm-table-column>
        <scm-table-column label="OU组织编码"
                          prop="erpMapId"
                          width="100"></scm-table-column>
        <scm-table-column label="OU组织名称"
                          prop="erpMapName"
                          width="210"></scm-table-column>
        <scm-table-column label="工厂编码"
                          prop="werks"
                          width="80"></scm-table-column>
        <scm-table-column label="工厂名称"
                          prop="name"
                          width="210"></scm-table-column>
        <scm-table-column label="仓库编码"
                          prop="lgort"
                          width="80"></scm-table-column>
        <scm-table-column label="仓库名称"
                          prop="lgobe"></scm-table-column>
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

const FETCH_DATA_ACTION = 'mdm/fetchStorehouse';

export default {
  name: 'ScmBankSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    plantType: { // 业务主体(0:上市；1:铁通；2:TD)
      type: String,
    },
    erpMapId: { // OU组织编码
      type: String,
      default: '',
    },
    userCode: { // 用户id，过滤权限用
      type: String,
      default: '',
    },
    permissionFilter: { // 是否过滤权限，1：过滤，其他不过滤
      type: String,
      default: '',
    },
    preLgortLikeList: { // 仓库编码前段模糊匹配
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      condition: { // 搜索显示栏参数
        addrCode: this.$store.getters['systemConfig/user'].addrCode,
        erpMapId: this.erpMapId,
        erpMapName: '',
        werks: '',
        name: '',
        lgort: '',
        lgobe: '',
      },
      initCondition: {
        addrCode: '',
        erpMapId: '',
        erpMapName: '',
        werks: '',
        name: '',
        lgort: '',
        lgobe: '',
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
  mounted() {
    this.onSearch(true);
  },
  methods: {
    fetchData() {
      const {
        pageSize,
        currentPage,
        plantType,
        permissionFilter,
        userCode,
        preLgortLikeList,
      } = this;
      this.fetchDataLoading = true;
      this.$store.dispatch(FETCH_DATA_ACTION, {
        pageNum: currentPage,
        pageSize,
        userCode,
        permissionFilter,
        ...this.cloneCondition,
        plantType,
        preLgortLikeList,
      }).then((res) => {
        this.tableData = res;
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
        // this.initCondition = _.cloneDeep(this.condition);
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
