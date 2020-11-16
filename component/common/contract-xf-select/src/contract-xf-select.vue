<!-- 搜索帮助（框架合同搜索帮助） -->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="下发框架合同信息"
                width="1000px">
    <div class="scm-contract-select">
      <scm-dialog-sub-header title="下发框架合同信息">
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
          <scm-divider type="vertical" v-if="nullValue"></scm-divider>
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
      <scm-form :model="condition"
                @submit.native.prevent="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition"
                inline>
        <scm-form-item label="合同系统合同号"
                        prop="viZcoid">
          <scm-input class="functional-input-with-suffix"
                      v-model="condition.viZcoid">
          </scm-input>
        </scm-form-item>
        <scm-form-item label="合同名称"
                        prop="viZcomc">
          <scm-input class="functional-input-with-suffix"
                      v-model="condition.viZcomc">
          </scm-input>
        </scm-form-item>
        <scm-form-item label="供应商编码"
                        prop="viLifnr">
          <scm-input class="functional-input-with-suffix"
                      v-model="condition.viLifnr">
          </scm-input>
        </scm-form-item>
        <scm-form-item label="供应商名称"
                        prop="viLifnrName">
          <scm-input class="functional-input-with-suffix"
                      v-model="condition.viLifnrName">
          </scm-input>
        </scm-form-item>
        <scm-form-item label="采购项目"
                        prop="viZcgxm">
          <scm-input class="functional-input-with-suffix"
                      v-model="condition.viZcgxm">
          </scm-input>
        </scm-form-item>
        <scm-form-item label="采购凭证号"
                        prop="ebeln">
          <scm-input class="functional-input-with-suffix"
                      v-model="condition.ebeln">
          </scm-input>
        </scm-form-item>
        <scm-form-item label="创建人"
                        prop="viZfounder">
          <scm-input v-model="condition.viZfounderName"
                    readonly
                    @click="onHandleFounderFocus"
                    class="functional-input-with-suffix"
                    suffix-icon="search">
          </scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="contract.viList"
                 ref="multipleTable"
                 v-loading="fetchContractLoading"
                 highlight-current-row
                 @selection-change="handleSelectionChange"
                 @current-change="onCurrentRowChange"
                 max-height="307"
                 class="search-result-table"
                 row-key="contractCode">
        <scm-table-column type="selection"
                          v-if="multiple"
                          reserve-selection
                          width="40"></scm-table-column>
        <scm-table-column type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="下发省码" width="70"
                          prop="addrCode"></scm-table-column>
        <scm-table-column label="采购凭证号"
                          width="100"
                          prop="ebeln"></scm-table-column>
        <scm-table-column label="供应商编码" width="95"
                          prop="lifnr"></scm-table-column>
        <scm-table-column label="供应商名称" width="95"
                          prop="lifnrName"></scm-table-column>
        <scm-table-column label="采购项目" width="70"
                          prop="zcgxm"></scm-table-column>
        <scm-table-column label="合同系统合同号"
                          prop="zcoid"></scm-table-column>
        <scm-table-column prop="zcomc"
                          label="合同名称"></scm-table-column>
        <scm-table-column prop="zfounderName" width="60"
                          label="创建人"></scm-table-column>
        <scm-table-column prop="kdatb" width="95"
                          label="有效起始日期"></scm-table-column>
        <scm-table-column prop="kdate" width="95"
                          label="有效截至日期"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="contract.viTotal"
                      v-show="contract.viTotal"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange"
                      style="text-align:left">
      </scm-pagination>
    <!-- 人员搜索帮助 -->
    <scm-employee-select
      :visible.sync="employeeVisible"
      @select="onViZfounderFiledSelect"
      :inputEmployeeType="inputEmployeeType"
      v-if="employeeVisible"
      append-to-body
      :addrCodes="addrCode">
    </scm-employee-select>
    <!-- 人员搜索帮助 -->
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import ScmEmployeeSelect from '@/component/common/employee-select';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_CONTRACT_ACTION = 'mdm/fetchContract';

export default {
  name: 'ScmContractSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
    ScmEmployeeSelect,
  },
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    inputEmployeeType: { // 员工类型; 0:内部员工,1:供应商一级账号,2:供应商二级账号,3:内部专家,4:外部专家,5:代理机构,6:检测机构
      type: String,
      default: '',
    },
  },
  data() {
    return {
      condition: {
        viZcoid: '',
        viZcomc: '',
        viLifnr: '',
        viLifnrName: '',
        viZcgxm: '',
        ebeln: '',
        viZfounderName: '',
      },
      currentPage: 1,
      pageSize: 10,
      cloneCondition: {},
      esData: '',
      employeeVisible: false,
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchContractLoading: state => state.loading.actions[FETCH_CONTRACT_ACTION],
      contract: state => state.mdm.contract,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viZcoid
        || this.condition.viZcomc
        || this.condition.viLifnr
        || this.condition.viLifnrName
        || this.condition.viZcgxm
        || this.condition.ebeln
        || this.condition.viZfounderName);
    },
  },
  mounted() {
    this.fetchContract();
  },
  watch: {
    multiple() {
      this.$refs.multipleTable.clearSelection();
    },
  },
  methods: {
    onHandleFounderFocus() {
      this.employeeVisible = true;
    },
    onViZfounderFiledSelect(selected) {
      this.condition.viZfounderName = selected.employeeBasicNameCn;
      this.condition.viZfounder = selected.userId;
      this.employeeVisible = false;
    },
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchContract(this.condition);
    },
    onSearch() {
      this.Searchinit();
    },
    onClear() {
      this.condition.viZfounderName = '';
      this.$refs.conditionForm.resetFields();
    },
    onPrevious() {
      this.$emit('select', this.esData);
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
      this.$refs.multipleTable.clearSelection();
    },
    onFormSubmit() {
      this.Searchinit();
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchContract(this.cloneCondition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchContract(this.cloneCondition);
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
    fetchContract(params = {}) {
      const {
        currentPage, pageSize, addrCode,
      } = this;
      this.$store.dispatch(FETCH_CONTRACT_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        addrCode,
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
.scm-contract-select {
  width: 100%;

  .search-condition {
    .el-form-item {
        width: 220px;
        margin-right: 20px;
        margin-bottom: 0px;
    }
  }

  .divider {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .el-table {
    margin-bottom: 10px;
  }
}
</style>
