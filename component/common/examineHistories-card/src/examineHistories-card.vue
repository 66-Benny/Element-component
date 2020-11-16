<template>
  <div class="scm-examine-history-card">
    <scm-card class="mg-t-15"
              v-if="isShowProcessHistories"
              separator-class="el-icon-arrow-right">
      <div slot="header"
           class="clearfix">
        <span>流程追踪</span>
      </div>
      <scm-table :data="examine.viList"
                 v-loading="fetchExamineLoading"
                 highlight-current-row>
        <scm-table-column type="index"
                          width="64"
                          ></scm-table-column>
        <scm-table-column label="环节名称"
                          prop="taskName"
                          width="277"></scm-table-column>
        <scm-table-column label="处理人"
                          width="142"
                          prop="approveUserName"></scm-table-column>
        <scm-table-column label="开始时间"
                          prop="createTime"
                          width="193"></scm-table-column>
        <scm-table-column label="处理时间"
                          width="210"
                          prop="approveTime"></scm-table-column>
        <scm-table-column label="处理结果"
                          width="109"
                          prop="result"></scm-table-column>
        <scm-table-column label="处理意见"
                          prop="approveOpinion"
                          tooltip-class="examineHostory_hover"></scm-table-column>
      </scm-table>
    </scm-card>
  </div>
</template>
<script>
import { StoreGlobalAPI } from 'scm-sdk';
import _ from 'lodash';

const FETCH_GETPROCESSHISTORIES_ACTION = 'mdm/fetchGetProcessHistories';
export default {
  name: 'ScmExamineHistorySelect',
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchExamineLoading: state =>
        state.loading.actions[FETCH_GETPROCESSHISTORIES_ACTION],
      examine: state => state.mdm.examine,
    }),
  },
  data() {
    return {
      isShowProcessHistories: false,
    };
  },
  props: {
    procInstId: {
      required: true,
      type: String,
    },
    isSubmitNextNode: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (!_.isEmpty(this.procInstId)) {
      this.isShowProcessHistories = true;
      this.fetchGetProcessHistories();
    }
  },
  watch: {
    procInstId(val) {
      if (!_.isEmpty(this.procInstId)) {
        this.procInstId = val;
        this.isShowProcessHistories = true;
        this.fetchGetProcessHistories();
      }
    },
    isSubmitNextNode() {
      if (this.isSubmitNextNode) {
        this.fetchGetProcessHistories();
      }
    },
  },
  methods: {
    fetchGetProcessHistories() {
      const { procInstId } = this;
      this.$store.dispatch(FETCH_GETPROCESSHISTORIES_ACTION, {
        procInstId,
      });
    },
  },
};
</script>

<style lang="scss">
.el-popover {
  background-color: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  padding: 3px;
}
.examineHostory_hover {
  max-width: 400px !important;
  line-height: 16px !important;
  padding: 9px 9px !important;
  letter-spacing: 0.5px !important;
}
</style>
