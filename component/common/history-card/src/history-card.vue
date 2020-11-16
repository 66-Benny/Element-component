<template>
  <div>
    <scm-card class="mg-t-15"
              separator-class="el-icon-arrow-right">
      <div slot="header"
           class="clearfix">
        <span>流程追踪</span>
      </div>
      <scm-table :data="historyData"
                 v-loading="historyLoading"
                 highlight-current-row>
        <scm-table-column type="index"
                          width="60"></scm-table-column>
        <scm-table-column label="环节名称"
                          prop="viTaskName"
                          min-width="150"></scm-table-column>
        <scm-table-column label="处理人"
                          width="80"
                          prop="viApproveUserName"></scm-table-column>
        <scm-table-column label="开始时间"
                          prop="viCreateTime"
                          width="150"></scm-table-column>
        <scm-table-column label="处理时间"
                          width="150"
                          prop="viApproveTime"></scm-table-column>
        <scm-table-column label="处理结果"
                          prop="viResult"></scm-table-column>
        <scm-table-column label="处理意见"
                          prop="viApproveOpinion"></scm-table-column>
      </scm-table>
    </scm-card>
  </div>
</template>
<script>
export default {
  name: 'HistoryCard',
  data() {
    return {};
  },
  props: {
    historyLoading: {
      type: Boolean,
      default: false,
    },
    historyData: {
      required: true,
      type: Array,
    },
  },
};
</script>

<style lang="scss" scoped>
.el-popover {
  background-color: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  padding: 3px;
  text-align: center;
}
</style>
