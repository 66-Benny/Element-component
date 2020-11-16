<template>
    <div class="scm-toRead-card">
      <scm-card  class="mg-15 card-table">
      <scm-dialog-sub-header title="待阅">
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
        <scm-form-item label="标题"
                       prop="viTitle">
          <scm-input v-model="condition.viTitle"
                     class="db-dim-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="待阅发送人"
                       prop="viSendUserName">
          <scm-input v-model="condition.viSendUserName"
                     class="db-dim-name"
                     @click.native="onShowEmployee">
            <scm-button slot="append"
                        icon="search"
                        class="append-button"></scm-button>
          </scm-input>
        </scm-form-item>

        <scm-form-item label="发起待阅日期"
                       prop="viReceiveTime"
                       class="db-dim-name">
          <scm-date-picker type="date"
                           v-model="condition.viReceiveTime"
                           placeholder="选择日期"
                           ></scm-date-picker>
        </scm-form-item>
        <scm-form-item label="状态"
                       prop="viStatus">
          <scm-select v-model="condition.viStatus"
                      class="db-dim-name">
            <scm-option v-for="item of statusData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </scm-option>
          </scm-select>
        </scm-form-item>
      </scm-form>
      </scm-card>
      <scm-divider dashed
                   class="divider"></scm-divider>
    <scm-card class="mg-15 card-table">
      <div slot="header"
           class="clearfix">
        <span class="title-color">查询结果</span>
      </div>
      <scm-table data=""
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

                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>
    </scm-card>
            <scm-employee-select  :visible.sync="isShowEmployee"
                            @select="onGetEmployeeData"></scm-employee-select>
            <!-- <scm-dbList-card  :visible.sync="isShowDbList"
                              @select="onGetdbListcard"
                              :getdbData="toDblist"
                              ></scm-dbList-card> -->
    </div>
</template>
<script>
import _ from 'lodash';
// import { StoreGlobalAPI } from 'scm-sdk';
import ScmEmployeeSelect from '@/component/common/employee-select';
// import ScmDbListCard from '@/component/common/dbList-card';

// const FETCH_DB_ACTION = 'mdm/fetchDb';
// const FETCH_BIZTYPE_ACTION = 'mdm/fetchBizType';
// const FETCH_COMPLETEDBLIST_ACTION = 'mdm/fetchCompleteDbList';

export default {
  components: {
    ScmEmployeeSelect,
    // ScmDbListCard,
  },
  data() {
    return {
      condition: {
        viTitle: '',
        viSendUserName: '',
        viReceiveTime: '',
        viStatus: '1',
      },
      statusData: [
        {
          label: '待阅',
          value: '1',
        },
        {
          label: '已阅',
          value: '2',
        },
      ],
      isShowEmployee: false,
      currentPage: 1,
      pageSize: 15,
    };
  },
  computed: {

    clearDisabled() {
      return _.isEmpty(this.condition.viTitle ||
          this.condition.viSendUserName ||
          this.condition.viReceiveTime ||
          this.condition.viStatus);
    },
  },
  mounted() {

  },
  methods: {
    onShowEmployee() {
      this.isShowEmployee = true;
    },
    onGetEmployeeData(val) {
      this.isShowEmployee = false;
      this.condition.viSendUserName = val.employeeBasicNameCn;
    },
    // 获取table序号
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
  },
};
</script>
<style lang="scss">
.scm-toRead-card {
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

