<template>
  <div>
    <scm-card class="mg-t-15"
              v-if="isShowProcessHistories"
              separator-class="el-icon-arrow-right">
      <div slot="header"
           class="clearfix">
        <span>流程追踪</span>
        <span class="titleBtn" v-if="oddNubmer">
          <scm-button type="text"
                      @click="sendBpmUrgeeMail"
                      :disabled="sendBpmUrgeeMailDisabled">邮件催办</scm-button>
          <scm-button type="text"
                      @click="sendBpmUrgeMessage"
                      :disabled="sendBpmUrgeMessageDisabled">短信催办</scm-button>
        </span>
      </div>
      <scm-table :data="examine"
                 v-loading="fetchExamineLoading"
                 highlight-current-row>
        <scm-table-column type="index"
                          width="64"
                          ></scm-table-column>
        <scm-table-column label="流程名称"
                          prop="modelName"
                          v-if="showModelName"></scm-table-column>
        <scm-table-column label="环节名称"
                          prop="taskName"></scm-table-column>
        <scm-table-column label="处理人"
                          width="140"
                          prop="approveUserName"></scm-table-column>
        <scm-table-column label="开始时间"
                          prop="createTime"
                          width="140"></scm-table-column>
        <scm-table-column label="处理时间"
                          width="140"
                          prop="approveTime"></scm-table-column>
        <scm-table-column label="处理结果"
                          width="70"
                          prop="result"></scm-table-column>
        <scm-table-column label="处理意见"
                          tooltip-class="examineHostory_hover"
                          prop="approveOpinion"></scm-table-column>
      </scm-table>
    </scm-card>
  </div>
</template>
<script>
import _ from 'lodash';
import { StoreGlobalAPI, constants } from 'scm-sdk';

const { STORE_KEY } = constants;
const FETCH_FETCHGETBPMHISTORY_ACTION = 'bpm/fetchGetBpmHistory';
const MDM_SEND_URGE_MAIL_ACTION = 'mdm/sendUrgeMail';
const MDM_SEND_URGE_MESSAGE_ACTION = 'mdm/sendUrgeMessage';
export default {
  name: 'ScmBpmHistoryCard',
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchExamineLoading: state =>
        state.loading.actions[FETCH_FETCHGETBPMHISTORY_ACTION],
      examine: state => state.bpm.bpmHistory.viList,
    }),
    ...StoreGlobalAPI.mapGetters({
      oddNubmer: `${STORE_KEY.GET_CURRENT_ODD_NUMBER}`,
    }),
    showModelName() {
      let show = false;
      if (_.isEmpty(this.examine)) {
        return show;
      }
      for (let i = 0; i < this.examine.length; i += 1) {
        const iItem = this.examine[i];
        if (iItem.modelName && iItem.modelName !== '') {
          show = true;
          break;
        }
      }
      return show;
    },
  },
  data() {
    return {
      isShowProcessHistories: false,
      sendBpmUrgeeMailDisabled: false,
      sendBpmUrgeMessageDisabled: false,
      condition: {
        viBizId: '',
        viBizType: '',
      },
    };
  },
  props: {
    procInstId: { // 不传入请求2，3期数据
      type: String,
    },
    taskTitle: { // 待办标题
      type: String,
    },
    isSubmitNextNode: {
      type: Boolean,
      default: false,
    },
    bizId: { // 业务id
      type: String,
    },
    bizType: { // 业务类型
      type: String,
    },
  },
  mounted() {
    if (this.procInstId) {
      this.isShowProcessHistories = true;
      this.fetchGetBpmHistories();
    } else if (this.bizId && this.bizType) {
      this.isShowProcessHistories = true;
      this.condition.viBizId = this.bizId;
      this.condition.viBizType = this.bizType;
      this.fetchGetHistory(this.condition);
    }
  },
  watch: {
    procInstId(val) {
      if (val) {
        this.procInstId = val;
        this.isShowProcessHistories = true;
        this.fetchGetBpmHistories();
      }
    },
    isSubmitNextNode() {
      if (this.isSubmitNextNode) {
        this.fetchGetBpmHistories();
      }
    },
  },
  methods: {
    sendBpmUrgeeMail() {
      this.sendBpmUrgeeMailDisabled = true;
      this.sendApi('mail').then(() => {
        this.$message({
          message: '邮件催办成功',
          type: 'success',
        });
      }).finally(() => {
        this.sendBpmUrgeeMailDisabled = false;
      });
    },
    sendBpmUrgeMessage() {
      this.sendBpmUrgeMessageDisabled = true;
      this.sendApi('message').then(() => {
        this.$message({
          message: '短信催办成功',
          type: 'success',
        });
      }).finally(() => {
        this.sendBpmUrgeMessageDisabled = false;
      });
    },
    sendApi(type) {
      let action = '';
      if (type === 'mail') {
        action = MDM_SEND_URGE_MAIL_ACTION;
      } else if (type === 'message') {
        action = MDM_SEND_URGE_MESSAGE_ACTION;
      }
      const params = {
        bizId: this.bizId,
        procInstId: this.procInstId,
        taskTitle: this.taskTitle,
      };
      return this.$store.dispatch(action, params);
    },
    fetchGetBpmHistories() {
      const {
        procInstId,
      } = this;
      this.$store.dispatch(FETCH_FETCHGETBPMHISTORY_ACTION, {
        procInstId,
      });
    },
    fetchGetHistory(params = {}) {
      this.$store.dispatch(FETCH_FETCHGETBPMHISTORY_ACTION, { ...params });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-popover {
  background-color: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  padding: 3px;
}
.el-button--mini.is-round{
  width:auto;
}
.titleBtn{
  float: right;
}
.examineHostory_hover {
  max-width: 400px !important;
  line-height: 16px !important;
  padding: 9px 9px !important;
  letter-spacing: 0.5px !important;
}
</style>
