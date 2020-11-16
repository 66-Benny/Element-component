<template>
  <basic-dialog :visible.sync="innerVisible"
                title="审批预览"
                width="1000px">
    <div class="scm-table-select">
      <table cellspacing="0" width="100%" class="el-static-table">
        <colgroup>
          <col width="50%">
        </colgroup>
        <thead>
          <tr>
            <th colspan="4">
              审批信息
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="item-label">
              流程
            </td>
            <td colspan="3">
              {{condition.viModelName}}
            </td>
          </tr>
          <tr>
            <td class="item-label">
              下一路径
            </td>
            <td colspan="3">
              {{condition.viTaskName}}
            </td>
          </tr>
          <tr>
            <td class="item-label">
              下一处理人
            </td>
            <td colspan="3">
              {{condition.viNextPer}}
            </td>
          </tr>
          <tr>
            <td class="item-label">
              审批意见
            </td>
            <td colspan="3">
              {{condition.viApproveOpinion}}
            </td>
          </tr>
        </tbody>
      </table>
    <scm-footer class="bpm-table-select-footer">
            <scm-button @click="onCancel">取消</scm-button>
            <scm-button type="primary"
                        @click="onSubmit">提交</scm-button>
    </scm-footer>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
// import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

export default {
  name: 'ScmTableSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    examineNews: {
      type: Object,
      required: true,
    },
    callback: Function,
  },
  data() {
    return {
      condition: {
        viModelName: '',
        viTaskName: '',
        viNextPer: '',
        viApproveOpinion: '',
      },
    };
  },
  mounted() {
  },
  watch: {
    examineNews: {
      handler(newPro) {
        console.log(newPro);
        const member = _.cloneDeep(newPro);
        this.$set(this.condition, 'viModelName', member.modelName);
        this.$set(this.condition, 'viTaskName', member.taskName);
        this.$set(this.condition, 'viNextPer', member.nextPer);
        this.$set(this.condition, 'viApproveOpinion', member.approveOpinion);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onCancel() {
      this.$emit('select');
    },
    onSubmit() {
      this.$emit('select', this.callback());
    },
  },
};
</script>
<style lang="scss">
.scm-table-select{
  .bpm-table-select-footer{
    text-align: center;
    line-height: 60px;
  }
}
</style>
