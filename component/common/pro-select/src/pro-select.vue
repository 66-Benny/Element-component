<!-- 搜索帮助（工建项目）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="工建需求申请信息查看"
                width="1000px">
    <div class="scm-pro-select">
      <!-- <scm-dialog-sub-header title="工建项目查看">
      </scm-dialog-sub-header> -->

      <scm-divider dashed
                   class="project-divider"></scm-divider>
      <scm-table :data="Pro.viList"
                 ref="multipleTable"
                 v-loading="fetchProLoading"
                 highlight-current-row
                 max-height="360">
        <scm-table-column label="行号"
                          width="60"
                          type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="省公司"
                          prop="provinceName"
                          width="70"></scm-table-column>
        <scm-table-column label="工建项目编号"
                          prop="projectNum"
                          width="105"></scm-table-column>
        <scm-table-column label="工建项目名称"
                          prop="projectName"
                          width="105"></scm-table-column>
        <scm-table-column label="立项批复依据"
                          prop="projectApprovalNum"
                          width="130"></scm-table-column>
        <scm-table-column label="批复含税金额(元)"
                          prop="amountApproval"
                          width="130"></scm-table-column>
        <scm-table-column label="批复不含税金额(元)"
                          prop="amountApprovalNoTax"
                          width="140"></scm-table-column>
        <scm-table-column label="工建需求申请单号"
                          prop="reqApplyNum"></scm-table-column>
        <scm-table-column label="工建需求名称"
                          prop="reqApplyName"
                          width="105"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="Pro.viTotal"
                      v-show="Pro.viTotal"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>
    </div>
  </basic-dialog>
</template>
<script>
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_PRO_ACTION = 'mdm/fetchPro';

export default {
  name: 'ScmProSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      condition: {
        viprovinceCode: '',
        vienvironmentName: '',
        vireqApplyNum: '',
        vireqApplyName: '',
        viprojectName: '',
      },
      currentPage: 1,
      pageSize: 10,
      esPro: '',
    };
  },
  props: {
    provinceCode: {
      required: true,
      type: String,
      default: 'TJ',
    },
    sourceFlag: { // 是否有源申请
      required: true,
      type: String,
      default: 'N',
    },
    viprojectNum: { // 工建项目编号
      type: String,
      default: '',
    },
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchProLoading: state =>
        state.loading.actions[FETCH_PRO_ACTION],
      Pro: state => state.mdm.Pro,
    }),
  },
  watch: {
    viprojectNum: {
      handler(newName) {
        this.viprojectNum = newName;
        this.fetchPro();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.fetchPro();
  },
  methods: {
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchPro();
    },
    // 选择窗口显示数据的数量
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchPro();
    },
    // 表格的当前行发生变化的时候会触发该事件
    // onCurrentRowChange(val) {
    //   if (val) {
    //     this.$emit('select', val);
    //     this.$refs.multipleTable.setCurrentRow();
    //   }
    // },
    // 将数据发送给后台
    fetchPro(params = {}) {
      const {
        currentPage, pageSize, sourceFlag, provinceCode, viprojectNum,
      } = this;
      this.$store.dispatch(FETCH_PRO_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        sourceFlag,
        provinceCode,
        viprojectNum,
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
.scm-pro-select {
  width: 100%;

  .search-condition {
    .el-form-item {
      margin-bottom: 10px;
      margin-right: 20px;
      float: left;
      .pro-name {
        width: 220px;
      }
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
