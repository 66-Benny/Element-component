<template>
  <basic-dialog :visible.sync="innerVisible"
                title="个人待办详情页面"
                width="80%">
    <scm-dialog-sub-header title="个人待办详情页面">
        <template slot="action">
          <scm-divider type="vertical"></scm-divider>
          <scm-dialog-sub-header-button icon="submit"
                                        @click="onSubmit">
            取消待办
          </scm-dialog-sub-header-button>
        </template>
      </scm-dialog-sub-header>
      <scm-divider dashed
                   class="divider"></scm-divider>
    <div class="scm-db-card">
      <table  v-if="getdbDataList"
              :data="getdbDataList"
               cellspacing="0"
               width="100%"
               class="mg-b-20">
          <tr>
            <th class="static-table-th"
                colspan="4">待办</th>
          </tr>
          <tr>
            <td class="static-table-td-title">业务编号</td>
            <td class="static-table-td-content">{{getdbDataList.bizId}}</td>
            <td class="static-table-td-title">业务类型</td>
            <td class="static-table-td-content2">{{getdbDataList.bizType}}</td>
          </tr>
          <tr>
            <td class="static-table-td-title">待办请求人</td>
            <td class="static-table-td-content">{{getdbDataList.sendUserId}}</td>
            <td class="static-table-td-title">待办接收人</td>
            <td class="static-table-td-content2">{{getdbDataList.receiveUserId}}</td>
          </tr>
          <tr>
            <td class="static-table-td-title">待办接收时间</td>
            <td class="static-table-td-content">{{getdbDataList.createTime}}</td>
            <td class="static-table-td-title">预期时间</td>
            <td class="static-table-td-content2">{{getdbDataList.expectEndTime}}</td>
          </tr>
          <tr>
            <td class="static-table-td-title">任务标题</td>
            <td class="static-table-td-content">{{getdbDataList.taskTitle}}</td>
            <td class="static-table-td-title">任务内容</td>
            <td class="static-table-td-content2">{{getdbDataList.taskContent}}</td>
          </tr>
          <tr>
            <td class="static-table-td-title">任务处理跳转URL</td>
            <td class="static-table-td-content">{{getdbDataList.taskViewUrl}}</td>
            <td class="static-table-td-title">紧急程度</td>
            <td class="static-table-td-content2">{{getdbDataList.urgency}}</td>
          </tr>
          <tr>
            <td class="static-table-td-title">是否同步OA</td>
            <td class="static-table-td-content"></td>
            <td class="static-table-td-title">任务原始创建人ID</td>
            <td class="static-table-td-content2">{{getdbDataList.originalCreateUserId}}</td>
          </tr>
          <tr>
            <td class="static-table-td-title">状态</td>
            <td class="static-table-td-content2"
                colspan="3">{{getdbDataList.status}}</td>
          </tr>
        </table>
    </div>
  </basic-dialog>
</template>
<script>
// import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_COMPLETEDB_ACTION = 'mdm/fetchCompleteDb';


export default {
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    getdbData: {
      required: true,
    },
  },
  data() {
    return {
      isShowEmployee: false,
      currentPage: 1,
      pageSize: 15,
      urgency: '',
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchDbLoading: state => state.loading.actions[FETCH_COMPLETEDB_ACTION],
      Tittle: state => state.mdm.CompleteDb.Tittle,
    }),
    getdbDataList() {
      return this.getdbData;
    },
  },
  mounted() {
    // console.log(this.getdbData);
  },
  methods: {
    onSubmit() {
      this.$confirm('确定取消待办？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // type: 'warning',
      })
        .then(() => this.$store.dispatch(FETCH_COMPLETEDB_ACTION, this.getdbDataList)).then(() => {
          this.$emit('select', true);
        });
      // .catch(() => {
      // this.$message({
      //   type: 'info',
      //   message: '已取消删除',
      // });
      // });
    },
  },
};
</script>
<style lang="scss">
.scm-db-card {
  width: 100%;
  height: 600px;
  .dalist-condition {
    .el-form-item {
      padding-left:100px;
      margin-bottom: 10px;
    }
    .dblist-dim-name {
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
}
</style>

