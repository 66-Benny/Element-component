<template>
  <basic-dialog :visible.sync="innerVisible"
                title="上市和TD共享合同组件信息"
                width="1200px">
    <div class="contract-select contract-dialog-pg">
      <scm-dialog-sub-header title="合同组合明细查看">
      </scm-dialog-sub-header>
      <scm-table :data="contractSharedAmountList.viList"
                  v-loading="loading"
                  highlight-current-row
                  max-height="500">
        <scm-table-column prop="zhjid"
                          label="合同组件编码">
        </scm-table-column>
        <scm-table-column prop="zcoid"
                          label="合同编号">
        </scm-table-column>
        <scm-table-column prop="zcomc"
                          label="合同名称">
        </scm-table-column>
        <scm-table-column prop="lifnr"
                          label="供应商编码">
        </scm-table-column>
        <scm-table-column prop="lifnrName"
                          label="供应商名称">
        </scm-table-column>
        <scm-table-column prop="shareKtwrt"
                          label="上市和TD共享合同金额（含税）">
        </scm-table-column>
        <scm-table-column prop="totalZyzxje"
                          label="上市和TD共享已执行金额（含税）">
        </scm-table-column>
        <scm-table-column prop="ktwrt"
                          label="合同总金额（含税）">
        </scm-table-column>
        <scm-table-column prop="zyzxze"
                          label="已执行金额（含税）">
        </scm-table-column>
      </scm-table>
    </div>
  </basic-dialog>
</template>
<script>
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const PR_CONTRACTSHAREAMOUNT_SERVICE = 'contract/postContractSharedAmount';
const PR_SHAREAMOUNT_SERVICE = 'contract/postSharedAmount';

export default {
  name: 'contractSharedAmount',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    voucherNum: {
      type: String,
      default: '',
    },
    zcoid: {
      type: String,
      default: '',
    },
    // 是否来自合同模块
    fromContract: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      contractSharedAmountList: state => state.contract.contractSharedAmountList,
      loading() {
        if (this.fromContract === '1') {
          return this.$store.state.loading.actions[PR_CONTRACTSHAREAMOUNT_SERVICE];
        }
        return this.$store.state.loading.actions[PR_SHAREAMOUNT_SERVICE];
      },
    }),
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    search() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.$store.dispatch(this.fromContract === '1' ? PR_CONTRACTSHAREAMOUNT_SERVICE : PR_SHAREAMOUNT_SERVICE, {
        voucherNum: this.voucherNum,
        zcoid: this.zcoid,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.contract-dialog-pg {
  /deep/ {
    .el-card__body {
      padding: 0px !important;
    }
    .el-table {
      margin-bottom: 10px !important;
    }
  }
}
</style>
