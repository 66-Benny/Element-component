<template>
  <basic-dialog :visible.sync="innerVisible"
                title="工建项目任务信息管理"
                class="dialog-wrap"
                width="1080px">
    <scm-dialog-sub-header title="工建项目任务信息管理"
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
        <scm-form-item label="OU组织编码"
                       prop="orgId">
          <scm-input v-model="condition.orgId"></scm-input>
        </scm-form-item>
        <scm-form-item label="OU组织名称"
                       prop="orgName">
          <scm-input v-model="condition.orgName"></scm-input>
        </scm-form-item>
        <scm-form-item label="项目经理"
                       prop="projectManager">
          <scm-input v-model="condition.projectManager"></scm-input>
        </scm-form-item>
        <scm-form-item label="任务经理"
                       prop="taskManager">
          <scm-input v-model="condition.taskManager"></scm-input>
        </scm-form-item>
        <scm-form-item label="项目编号"
                       prop="segment1">
          <scm-input v-model="condition.segment1"></scm-input>
        </scm-form-item>
        <scm-form-item label="项目名称"
                       prop="projectName">
          <scm-input v-model="condition.projectName"></scm-input>
        </scm-form-item>
        <scm-form-item label="任务编号"
                       prop="taskNumber">
          <scm-input v-model="condition.taskNumber"></scm-input>
        </scm-form-item>
        <scm-form-item label="任务名称"
                       prop="taskName">
          <scm-input v-model="condition.taskName"></scm-input>
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
        <scm-table-column label="OU组织编码"
                          prop="orgId"
                          width="90"></scm-table-column>
        <scm-table-column label="OU组织名称"
                          prop="orgName"></scm-table-column>
        <scm-table-column label="项目经理"
                          prop="projectManager"
                          width="69"></scm-table-column>
        <scm-table-column label="任务经理"
                          prop="taskManager"
                          width="69"></scm-table-column>
        <scm-table-column label="项目编号"
                          prop="segment1"
                          width="69"></scm-table-column>
        <scm-table-column label="项目名称"
                          prop="projectName"></scm-table-column>
        <scm-table-column label="任务编号"
                          prop="taskNumber"
                          width="69"></scm-table-column>
        <scm-table-column label="任务名称"
                          prop="taskName"></scm-table-column>
        <scm-table-column label="任务起始日期"
                          prop="startDate"
                          width="93"></scm-table-column>
        <scm-table-column label="任务完成日期"
                          prop="completionDate"
                          width="93"></scm-table-column>
        <scm-table-column label="可计费"
                          prop="chargeableFlag"
                          width="57"></scm-table-column>
        <scm-table-column label="可资本化"
                          prop="billableFlag"
                          width="69"></scm-table-column>
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

const FETCH_DATA_ACTION = 'mdm/fetchProjectTasks';

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
    orgId: { // OU组织编码
      type: String,
      default: '',
    },
    inputSegment1: { // 项目编号
      type: String,
      default: '',
    },
    chargeableFlag: { // 可计费
      type: String,
      default: '',
    },
    billableFlag: { // 可资本化
      type: String,
      default: '',
    },
  },
  data() {
    return {
      condition: { // 搜索显示栏参数
        orgId: this.orgId,
        orgName: '',
        segment1: this.inputSegment1,
        projectName: '',
        projectManager: '',
        taskNumber: '',
        taskName: '',
        taskManager: '',
      },
      initCondition: {}, // 点击清空按钮需要重置的参数
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
        chargeableFlag,
        billableFlag,
      } = this;
      this.fetchDataLoading = true;
      this.$store.dispatch(FETCH_DATA_ACTION, {
        pageNum: currentPage,
        pageSize,
        addrCode,
        chargeableFlag,
        billableFlag,
        ...this.cloneCondition,
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
