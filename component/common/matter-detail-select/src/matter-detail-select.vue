<!-- 搜索帮助（组合件明细查看） -->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="组合件明细查看"
                width="1000px">
    <div class="scm-matter-detail-select">
      <scm-dialog-sub-header title="组合件明细查看">
      </scm-dialog-sub-header>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="matterDetail.viList"
                 v-loading="fetchMaterielLoading"
                 highlight-current-row
                 ref="multipleTable"
                 max-height="330">
        <scm-table-column type="index"
                          width="100"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="物料编码"
                          prop="materialNum"
                          width="110"></scm-table-column>
        <scm-table-column label="物料描述"
                          prop="materialDesc"
                           width="480"></scm-table-column>
        <scm-table-column label="数量"
                          prop="quantity"
                          width="150"></scm-table-column>
        <scm-table-column label="单位"
                          prop="unitMeasure"
                          width="140"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      v-show="matterDetail.viTotal"
                      :total="matterDetail.viTotal"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>
    </div>

  </basic-dialog>
</template>
<script>
// import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_MATERIELDETAIL_ACTION = 'mdm/fetchMatterDetail';

export default {
  name: 'ScmMaterielDetailSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    materialCode: {
      required: true,
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchMaterielLoading: state =>
        state.loading.actions[FETCH_MATERIELDETAIL_ACTION],
      matterDetail: state => state.mdm.MatterDetail,
    }),
  },
  // mounted() {
  //   if (this.materialCode) {
  //     this.fetchMatterDetail();
  //   }
  // },
  watch: {
    materialCode() {
      this.fetchMatterDetail();
    },
  },
  methods: {
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchMatterDetail();
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchMatterDetail();
    },
    fetchMatterDetail() {
      const {
        currentPage, pageSize, materialCode,
      } = this;
      this.$store.dispatch(FETCH_MATERIELDETAIL_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        materialCode,
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
.scm-matter-detail-select {
  width: 100%;

  .search-condition {
    .el-form-item {
      float: left;
      margin-right: 10px;
      margin-left:5px;
      .erp-map-name {
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
