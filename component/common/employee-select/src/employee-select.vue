<!-- 搜索帮助（员工信息）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="员工信息"
                width="1000px">
    <div class="scm-employee-select">
      <scm-dialog-sub-header title="员工信息选择管理">
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
        </template>
      </scm-dialog-sub-header>
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition"
                inline>
          <scm-form-item label="员工姓名"
                         prop="viEmployeeName">
            <scm-input v-model="condition.viEmployeeName"
                       class="employee-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="部门名称"
                         prop="viRoleName">
            <scm-input v-model="condition.viRoleName"
                       class="employee-name"></scm-input>
          </scm-form-item>
          <!-- <scm-form-item label="所属省份"
                         prop="viIProvinces">
            <scm-select v-model="condition.viIProvinces"
                        disabled
                        class="employee-name">
              <scm-option v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></scm-option>
            </scm-select>
          </scm-form-item> -->
          <scm-form-item label="角色"
                         prop="viPosition">
            <scm-input v-model="condition.viPosition"
                       class="employee-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="系统账号"
                         prop="viUserName">
            <scm-input v-model="condition.viUserName"
                       class="employee-name"></scm-input>
          </scm-form-item>
          <!-- <scm-form-item label="市码"
                         prop="viUserName">
            <scm-input v-model="condition.viUserName"
                       class="employee-name"></scm-input>
          </scm-form-item> -->
          <scm-form-item label="员工类型"
                         prop="viEmployeeType">
            <scm-select v-model="condition.viEmployeeType"
                        placeholder="请选择"
                        :disabled="disabledEmployeeType"
                        class="employee-name">
              <scm-option v-for="item1 in options1"
                          :key="item1.value"
                          :label="item1.label"
                          :value="item1.value"></scm-option>
            </scm-select>
          </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="employee.viList"
                 v-loading="fetchEmployeeLoading"
                 highlight-current-row
                 @selection-change="handleSelectionChange"
                 @current-change="onCurrentRowChange"
                 ref="multipleTable"
                 max-height="270">
        <scm-table-column type="index"
                          width="70"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="姓名"
                          prop="employeeBasicNameCn"
                          width="120"></scm-table-column>
        <scm-table-column label="系统账号"
                          prop="userId"
                          width="130"></scm-table-column>
        <scm-table-column label="手机号"
                          prop="employeeBasicMobilePhone"
                          width="215"></scm-table-column>
        <scm-table-column label="邮箱"
                          prop="employeeHomeEmail"
                          width="180"></scm-table-column>
        <scm-table-column label="员工类型"
                          prop="employeeBasicType"></scm-table-column>
        <scm-table-column label="部门名称"
                          prop="orgAddrName"
                          width="130"></scm-table-column>
        <!-- <scm-table-column label="所属省份"
                          prop="provinces"
                          width="82"></scm-table-column>
        <scm-table-column label="所属城市"
                          prop="city"
                          width="82"></scm-table-column> -->
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      v-show="employee.viTotal"
                      :total="employee.viTotal"
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

const FETCH_EMPLOYEE_ACTION = 'mdm/fetchEmployee';

export default {
  name: 'ScmEmployeeSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    addrCodes: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    inputEmployeeType: { // 员工类型; 0:内部员工,1:供应商一级账号,2:供应商二级账号,3:内部专家,4:外部专家,5:代理机构,6:检测机构
      type: String,
      default: '',
    },
    inputEmployeeName: { // 员工姓名
      type: String,
      default: '',
    },
    inputUserName: { // 系统账号
      type: String,
      default: '',
    },
    inputEmployeeTypeOptions: { // 员工类型选项
      type: Array,
      default() {
        return [];
      },
    },
    disabledEmployeeType: { // 是否禁用员工类型
      type: Boolean,
      default: false,
    },
    userStatus: { // 用户状态，1:有权;2(无效,无权)
      type: String,
    },
  },
  watch: {
    inputEmployeeType(val) {
      this.condition.viEmployeeType = val;
    },
  },
  data() {
    return {
      condition: {
        viEmployeeName: this.inputEmployeeName,
        viRoleName: '',
        viPosition: '',
        viUserName: this.inputUserName,
        viEmployeeType: this.inputEmployeeType,
        viStr: '',
      },
      options: [
        {
          value: '选项1',
          label: '辽宁',
        },
      ],
      options1: [
        {
          value: '0',
          label: '内部员工',
        },
        {
          value: '1',
          label: '供应商一级账号',
        },
        {
          value: '2',
          label: '供应商二级账号',
        },
        {
          value: '3',
          label: '内部专家',
        },
        {
          value: '4',
          label: '外部专家',
        },
        {
          value: '5',
          label: '代理机构',
        },
        {
          value: '6',
          label: '检测机构',
        },
      ],
      currentPage: 1,
      pageSize: 10,
      esEmployee: '',
      cloneCondition: {},
      esData: '',
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchEmployeeLoading: state =>
        state.loading.actions[FETCH_EMPLOYEE_ACTION],
      employee: state => state.mdm.employee,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viEmployeeName ||
          this.condition.viRoleName ||
          this.condition.viPosition ||
          this.condition.viUserName ||
          this.condition.viEmployeeType);
    },
    submitDisabled() {
      return _.isEmpty(this.esEmployee);
    },
  },
  mounted() {
    this.options1 = this.inputEmployeeTypeOptions;
    this.Searchinit();
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchEmployee(this.condition);
    },
    // 按输入的搜索条件进行查询
    onSearch() {
      this.Searchinit();
    },
    // 将页面恢复到初始状态
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    // 提交搜索条件
    onPrevious() {
      this.$emit('select', this.esData);
    },
    // 提交搜索条件
    onFormSubmit() {
      this.fetchEmployee(this.condition);
    },
    // 选择一其中条数据
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchEmployee(this.cloneCondition);
    },
    // 选择窗口显示数据的数量
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchEmployee(this.cloneCondition);
    },
    // 表格的当前行发生变化的时候会触发该事件
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    // 选择要提交的数据
    handleSelectionChange(val) {
      this.esEmployee = val;
    },
    // 将数据发送给后台
    fetchEmployee(params = {}) {
      const {
        currentPage,
        pageSize,
        addrCodes,
        userStatus,
      } = this;
      this.$store.dispatch(FETCH_EMPLOYEE_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        addrCodes,
        userStatus,
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

.scm-employee-select {
  .search-condition {
      .el-form-item {
        width: 216px;
        margin-right:25px;
        margin-bottom: 0px;
        .employee-name{
          width: 100%;
        }
      }

  }
  .divider {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .el-pagination {
    margin: 0px !important;
  }
  .el-table {
    margin-bottom: 10px;
    }
  }

</style>
