<!-- 搜索帮助（部门信息） -->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="部门信息"
                width="1000px">
    <div class="scm-department-select">
      <scm-dialog-sub-header title="部门信息">
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
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition"
                inline>
        <!-- <scm-form-item label="省码"
                       prop="viAddrCode">
          <scm-input v-model="condition.viAddrCode"
                     class="erp-map-name"></scm-input>
        </scm-form-item> -->
        <!-- <scm-form-item label="公司编码"
                       prop="viCompanyCode">
          <scm-input v-model="condition.viCompanyCode"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="公司名称"
                       prop="viCompanyName">
          <scm-input v-model="condition.viCompanyName"
                     class="erp-map-name"></scm-input>
        </scm-form-item> -->
        <scm-form-item label="部门Id"
                       prop="viDeptId">
          <scm-input v-model="condition.viDeptId"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="部门名称"
                       prop="viDeptName">
          <scm-input v-model="condition.viDeptName"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <!-- <scm-form-item label="所属省份"
                       prop="viaddrName">
          <scm-input v-model="condition.viaddrName"
                     class="erp-map-name"></scm-input>
        </scm-form-item> -->
        <!-- <scm-form-item label="所属地市"
                       prop="viLocation">
          <scm-input v-model="condition.viLocation"
                     class="erp-map-name"></scm-input>
        </scm-form-item> -->
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="department.viList"
                 v-loading="fetchDepartmentLoading"
                 highlight-current-row
                 @current-change="onCurrentRowChange"
                 @selection-change="handleSelectionChange"
                 ref="multipleTable"
                 max-height="270"
                 row-key="deptId">
        <scm-table-column type="selection"
                          v-if="multiple"
                          reserve-selection
                          width="40"></scm-table-column>
        <scm-table-column type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="省码"
                          prop="addrCode"
                          width="60"></scm-table-column>
        <scm-table-column label="省份名称"
                          prop="addrName"
                          width="90"></scm-table-column>
        <scm-table-column label="部门Id"
                          prop="deptId"
                          width="180"></scm-table-column>
        <scm-table-column label="部门名称"
                          prop="deptName"></scm-table-column>
        <scm-table-column label="部门简称"
                          prop="shortName"
                          width="150"></scm-table-column>
        <scm-table-column label="状态"
                          prop="lockMark"
                          width="80"></scm-table-column>
        <!-- <scm-table-column label="所属地市"
                          prop="location"
                          width="140"></scm-table-column> -->
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="department.viTotal"
                      v-show="department.viTotal"
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

const FETCH_DEPARTMENT_ACTION = 'mdm/fetchDepartment';

export default {
  name: 'ScmOuSelect',
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
    lock: { // 是否有权 ''-全部，1-有权，0-无权
      type: String,
      default: '',
    },
    preDeptIdLike: { // 部门Id前段（根据该值进行对xxx%的模糊匹配）
      type: String,
      default: '',
    },
  },
  data() {
    return {
      condition: {
        // viAddrCode: '',
        viaddrName: '',
        // viCompanyCode: '',
        // viCompanyName: '',
        viDeptId: '',
        viDeptName: '',
        viLocation: '',
      },
      currentPage: 1,
      pageSize: 10,
      esData: '',
      cloneCondition: {},
      multipleSelection: [],
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchDepartmentLoading: state =>
        state.loading.actions[FETCH_DEPARTMENT_ACTION],
      department: state => state.mdm.Department,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viaddrName ||
          this.condition.viDeptId ||
          this.condition.viDeptName ||
          this.condition.viLocation);
    },
    submitDisabled() {
      return _.isEmpty(this.multipleSelection);
    },
  },
  mounted() {
    this.fetchDepartment();
  },
  watch: {
    multiple() {
      this.$refs.multipleTable.clearSelection();
    },
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchDepartment(this.condition);
      this.$refs.multipleTable.clearSelection();
    },
    onSearch() {
      this.Searchinit();
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onPrevious() {
      this.$emit('select', this.esData);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 多选提交
    onSubmit() {
      this.$emit('select', this.multipleSelection);
      this.$refs.multipleTable.clearSelection();
    },
    onFormSubmit() {
      this.fetchDepartment(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchDepartment(this.cloneCondition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchDepartment(this.cloneCondition);
    },
    onCurrentRowChange(val) {
      if (val && !this.multiple) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    fetchDepartment(params = {}) {
      const {
        currentPage,
        pageSize,
        addrCode,
        lock,
        preDeptIdLike,
      } = this;
      this.$store.dispatch(FETCH_DEPARTMENT_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        addrCode,
        lock,
        preDeptIdLike,
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
.scm-department-select {
  width: 100%;
  .search-condition {
    .el-form-item {
      width: 260px;
      margin: 0px 24px 0px 0px;
    }
  }
  .divider {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .el-table {
    margin-bottom: 10px;
  }
}
</style>
