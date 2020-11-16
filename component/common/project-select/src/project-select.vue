<!-- 搜索帮助（选择项目信息）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="选择工建项目信息"
                width="1000px">
    <div class="scm-project-select">
      <scm-dialog-sub-header title="工建项目信息查询管理">
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
         <scm-divider type="vertical" v-if="multiple"></scm-divider>
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
        <scm-form-item label="OU组织编码"
                       prop="viOUID">
          <scm-input v-model="condition.viOUID"
                     class="project-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="OU组织名称"
                       prop="viOUName">
          <scm-input v-model="condition.viOUName"
                     class="project-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="工建项目编号"
                       prop="viProjectCode">
          <scm-input v-model="condition.viProjectCode"
                     class="project-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="工建项目名称"
                       prop="viProjectName">
          <scm-input v-model="condition.viProjectName"
                     class="project-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="项目经理"
                       prop="viManager"
                       style="margin-top:15px">
          <scm-input v-model="condition.viManager"
                     class="project-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="项目开始日期"
                       prop="startDate"
                       style="margin-top:15px">
          <scm-date-picker
                  v-model="condition.startDate"
                  :disabled-date-from="condition.completionDate">
                </scm-date-picker>
        </scm-form-item>
        <scm-form-item label="项目结束日期"
                       prop="completionDate"
                       style="margin-top:15px">
          <scm-date-picker
            v-model="condition.completionDate"
            :disabled-date-to="condition.startDate">
          </scm-date-picker>
        </scm-form-item>

      </scm-form>
      <scm-divider dashed
                   class="project-divider"></scm-divider>
      <scm-table :data="project.viList"
                 ref="multipleTable"
                 v-loading="fetchProjectLoading"
                 highlight-current-row
                 @current-change="onCurrentRowChange"
                 @selection-change="handleSelectionChange"
                 max-height="237">
        <scm-table-column type="selection"
                          reserve-selection
                          v-if="multiple"></scm-table-column>
        <scm-table-column label="行号"
                          width="50"
                          type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="OU组织编码"
                          prop="orgId"
                          width="105"></scm-table-column>
        <scm-table-column label="OU组织名称"
                          prop="orgName"
                          width="160"></scm-table-column>
        <scm-table-column label="工建项目编号"
                          prop="segment1"
                          width="100"></scm-table-column>
        <scm-table-column label="工建项目名称"
                          prop="name"></scm-table-column>
        <scm-table-column label="项目经理"
                          prop="projectManager"
                          width="80"></scm-table-column>
        <scm-table-column label="是否动产"
                          prop="offsetFlagLabel"
                          width="70"></scm-table-column>
        <scm-table-column label="项目开始日期"
                          prop="startDate"
                          width="100"></scm-table-column>
        <scm-table-column label="项目结束日期"
                          prop="completionDate"
                          width="100"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="project.viTotal?project.viTotal:0"
                      v-show="project.viTotal"
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

const FETCH_PROJECT_ACTION = 'mdm/fetchProject';

export default {
  name: 'ScmProjectSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      condition: {
        viOUID: this.orgId,
        viOUName: '',
        viProjectCode: this.inputProjectCode,
        viProjectName: this.inputProjectName,
        viManager: '',
        startDate: '',
        completionDate: '',
      },
      currentPage: 1,
      pageSize: 10,
      esProjectData: '',
      multipleSelection: [],
      cloneCondition: {},
    };
  },
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    plantCode: { // 工厂编码
      type: String,
      // default: '1201',
    },
    plantType: { // 业务主体(0:上市2:TD)
      type: String,
    },
    orgId: { // OU组织编码
      type: String,
      default: '',
    },
    inputProjectName: { // 工建项目名称
      type: String,
      default: '',
    },
    inputProjectCode: { // 工建项目编码
      type: String,
      default: '',
    },
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchProjectLoading: state =>
        state.loading.actions[FETCH_PROJECT_ACTION],
      project: state => state.mdm.project,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viOUID ||
          this.condition.viOUName ||
          this.condition.viProjectCode ||
          this.condition.viProjectName ||
          this.condition.startDate ||
          this.condition.completionDate ||
          this.condition.viManager);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.onSearch();
  },
  watch: {
    multiple() {
      this.$refs.multipleTable.clearSelection();
    },
    plantCode() {
      this.fetchProject();
    },
    plantType() {
      this.Searchinit();
    },
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchProject(this.condition);
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    onSearch() {
      // if (
      //   _.isEmpty(this.condition.viOUID ||
      //       this.condition.viOUName ||
      //       this.condition.viProjectCode ||
      //       this.condition.viProjectName ||
      //       this.condition.viManager)
      // ) {
      //   this.$message({
      //     message: '查询条件不能为空',
      //     type: 'error',
      //   });
      // } else {
      //   }
      this.Searchinit();
    },
    // 将页面恢复到初始状态
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onPrevious() {
      this.$emit('select', this.esProjectData);
    },
    // 提交搜索条件
    onFormSubmit() {
      this.fetchProject(this.condition);
    },
    // 选择一其中条数据
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchProject(this.cloneCondition);
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
      this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 选择窗口显示数据的数量
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchProject(this.cloneCondition);
    },
    // 表格的当前行发生变化的时候会触发该事件
    onCurrentRowChange(val) {
      if (val && !this.multiple) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    // 将数据发送给后台
    fetchProject(params = {}) {
      const {
        currentPage, pageSize, addrCode, plantCode, plantType,
      } = this;
      this.$store.dispatch(FETCH_PROJECT_ACTION, {
        viAddrCode: addrCode,
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
        plantCode,
        plantType,
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
  .scm-project-select {
    .search-condition {
      .el-form-item {
        width: 216px;
        margin:0px 20px 0px 0px;
      }
    }

    .el-divider-horizontal {
      margin-top: 10px;
      margin-bottom: 10px;
      border: 1px dashed #e8e8e8;
    }

    .el-table {
      margin-bottom: 10px;
    }
    .el-pagination {
      .el-input__inner {
        color: #9b9b9b;
      }
      .number {
        color: #767676;
      }
    }
  }
</style>
