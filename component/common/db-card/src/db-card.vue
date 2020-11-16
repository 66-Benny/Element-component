<template>
    <div class="scm-db-card">
      <scm-card  class="mg-15 card-table">
      <scm-dialog-sub-header title="待办任务">
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
                ref="conditionForm"
                label-position="top"
                class="search-condition">
        <scm-form-item label="单号"
                       prop="vibizId">
          <scm-input v-model="condition.vibizId"
                     class="db-dim-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="起草人"
                       prop="vioriginalCreateUserId">
          <scm-input v-model="condition.vioriginalCreateUserId"
                     class="db-dim-name"
                     @click.native="onShowEmployeeOne">
            <scm-button slot="append"
                        icon="search"
                        class="append-button"></scm-button>
          </scm-input>
        </scm-form-item>
        <scm-form-item label="业务类型"
                       prop="vibizType">
          <scm-select v-model="condition.vibizType"
                      class="db-dim-name">
            <scm-option v-if="typeBus.viList"
                        v-for="item of typeBus.viList"
                        :key="item.dictEntryCode"
                        :label="item.dictEntryName"
                        :value="item.dictEntryCode">
            </scm-option>
          </scm-select>
        </scm-form-item>
        <scm-form-item label="发起待办日期"
                       prop="vicreateTime"
                       class="db-dim-name">
          <scm-date-picker type="date"
                           v-model="condition.vicreateTime"
                           placeholder="选择日期"
                           ></scm-date-picker>
        </scm-form-item>
        <scm-form-item label="上一处理人"
                       prop="visendUserId">
          <scm-input v-model="condition.visendUserId"
                     class="db-dim-name"
                    @click.native="onShowEmployee">
            <scm-button slot="append"
                        icon="search"
                        class="append-button"></scm-button>
          </scm-input>
        </scm-form-item>
        <scm-form-item label="任务名称"
                       prop="vitaskTitle">
          <scm-input v-model="condition.vitaskTitle"
                     class="db-dim-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="数据来源"
                       prop="vidataFrom">
          <scm-select v-model="condition.vidataFrom"
                      class="db-dim-name">
            <scm-option v-for="item of dataFrom"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </scm-option>
          </scm-select>
        </scm-form-item>
        <scm-form-item label="来源"
                       prop="visource">
          <scm-select v-model="condition.visource"
                      class="db-dim-name">
            <scm-option v-for="item of source"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </scm-option>
          </scm-select>
        </scm-form-item>
        <!-- 年度单选 -->


      </scm-form>
      </scm-card>
      <scm-divider dashed
                   class="divider"></scm-divider>
    <scm-card class="mg-15 card-table">
      <div slot="header"
           class="clearfix">
        <span class="title-color">查询结果</span>
      </div>
      <div class="float-l icon-btn-group"
            v-show="dbData.viList.length">
            <scm-button icon="submit"
                        size="mini"
                        @click="onCancel">
            取消待办
          </scm-button>
        <div class="inline-block">
          <scm-divider type="vertical"></scm-divider>
          <scm-button  icon="apply"
                       size="mini"
                       @click="onHandle">
            处理待办
          </scm-button>
        </div>
      </div>
      <scm-table :data="dbData.viList"
                 v-if="!isShowDbList"
                 v-loading="fetchDbLoading"
                 highlight-current-row
                 ref="multipleTable"
                 @current-change="onCurrentRowChange"
                 @selection-change="onHandleSelectionChange"
                 max-height="300">
        <scm-table-column type="index"
                          width="55"
                          :index='getTableIndex'>
        </scm-table-column>
        <scm-table-column type="selection"
                          width="55">
        </scm-table-column>
        <scm-table-column width="150"
                          prop="bizId"
                          label="单号">
        </scm-table-column>
        <scm-table-column width="150"
                          prop="bizType"
                          label="业务类型">
        </scm-table-column>
        <scm-table-column width="150"
                          prop="taskTitle"
                          label="任务名称">
        </scm-table-column>
        <scm-table-column width="150"
                          prop="originalCreateUserName"
                          label="起草人">
        </scm-table-column>
        <scm-table-column width="150"
                          prop="sendUserName"
                          label="上一处理人">
        </scm-table-column>
        <scm-table-column width="150"
                          prop="createTime"
                          label="待办发起日期">
        </scm-table-column>
        <scm-table-column width="230"
                          prop="urgency"
                          label="紧急程度">
        </scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[15, 20, 50]"
                      :page-size="pageSize"
                      :total="dbData.viTotal"
                      v-show="dbData.viList.length"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>
    </scm-card>
            <scm-employee-select  :visible.sync="isShowEmployee"
                            @select="onGetEmployeeData"></scm-employee-select>
            <scm-dbList-card  :visible.sync="isShowDbList"
                              @select="onGetdbListcard"
                              :getdbData="toDblist"
                              ></scm-dbList-card>
    </div>
</template>
<script>
import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import ScmEmployeeSelect from '@/component/common/employee-select';
import ScmDbListCard from '@/component/common/dbList-card';
// import moment from 'moment';

const FETCH_DB_ACTION = 'mdm/fetchDb';
const FETCH_BIZTYPE_ACTION = 'mdm/fetchBizType';
const FETCH_COMPLETEDBLIST_ACTION = 'mdm/fetchCompleteDbList';

export default {
  components: {
    ScmEmployeeSelect,
    ScmDbListCard,
  },
  data() {
    return {
      condition: {
        vibizId: '',
        vioriginalCreateUserId: '',
        vicreateTime: '',
        visendUserId: '',
        vitaskTitle: '',
        vibizType: '',
        vidataFrom: '',
        visource: '',
      },
      dataFrom: [
        {
          value: 'WF',
          label: '工作流待办',
        },
        {
          value: 'SF',
          label: '非工作流待办',
        },
      ],
      source: [
        {
          value: '1',
          label: '旧待办',
        },
        {
          value: '2',
          label: '新待办',
        },
      ],
      isShowEmployee: false,
      isShowDbList: false,
      currentPage: 1,
      pageSize: 15,
      urgency: '',
      toDblist: '',
      toDoData: [],
      isEmployeePerson: '',
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchDbLoading: state => state.loading.actions[FETCH_DB_ACTION],
      dbData: state => state.mdm.dbData,
      typeBus: state => state.mdm.BizTypeData.viList,
      viTittle: state => state.mdm.CompleteDbList.viTittle,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.vibizId ||
          this.condition.vioriginalCreateUserId ||
          this.condition.vicreateTime ||
          this.condition.visendUserId ||
          this.condition.vitaskTitle ||
          this.condition.vibizType);
    },
  },
  mounted() {
    this.fetchDb();
    this.fetchBizType();
  },
  methods: {
    onShowEmployee() {
      this.isShowEmployee = true;
      this.isEmployeePerson = '1';
    },
    onShowEmployeeOne() {
      this.isShowEmployee = true;
      this.isEmployeePerson = '2';
    },
    //  上一处理人显示页面
    onGetEmployeeData(val) {
      this.isShowEmployee = false;
      if (this.isEmployeePerson === '1') {
        this.condition.visendUserId = val.employeeBasicNameCn;
      } else {
        this.condition.vioriginalCreateUserId = val.employeeBasicNameCn;
      }
    },
    onGetdbListcard(val) {
      this.isShowDbList = false;
      if (val) {
        this.fetchDb();
        this.toDblist = [];
      }
    },
    onSearch() {
      this.fetchDb(this.condition);
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchDb();
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.fetchDb();
    },
    // 全选触发事件
    onHandleSelectionChange(val) {
      console.log(val);
      this.toDoData = val;
    },
    onCurrentRowChange(val) {
      this.isShowDbList = true;
      if (val) {
        this.toDblist = val;
      }
    },
    // 页面取消待办事件
    onCancel() {
      if (this.toDoData.length) {
        this.$store.dispatch(FETCH_COMPLETEDBLIST_ACTION, this.toDoData);
      } else {
        this.$message({
          type: 'info',
          message: '请至少选择一条数据',
        });
      }
      if (this.viTittle === '操作成功') {
        this.fetchDb(this.condition);
      }
    },
    // 处理待办事件
    onHandle() {
      // console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    },
    fetchDb(params = {}) {
      const { currentPage, pageSize } = this;
      this.$store.dispatch(FETCH_DB_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
      });
    },
    fetchBizType() {
      this.$store.dispatch(FETCH_BIZTYPE_ACTION);
    },
    // 获取table序号
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
  },
};
</script>
<style lang="scss">
.scm-db-card {
  width: 100%;
  .el-card__body{
    padding: 0px 20px;
  }
  .search-condition {
    .el-form-item {
      float: left;
      margin-right: 25px;
    }
    .db-dim-name {
      width: 220px;
    }
  }

  .divider {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .el-table {
    margin-bottom: 10px;
  }
  .icon-btn-group {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .inline-block {
    display: inline-block;
  }
}
</style>

