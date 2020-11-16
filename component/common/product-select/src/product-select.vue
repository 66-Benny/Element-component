<!-- 搜索帮助（工建项目信息）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="工建项目信息"
                width="1000px">
    <div class="scm-product-select">
      <scm-divider solid
                   class="divider"></scm-divider>
      <scm-table :data="product.viList"
                 v-loading="fetchProductLoading"
                 highlight-current-row
                 @current-change="onCurrentRowChange"
                 :span-method="objectSpanMethod"
                 max-height="470">
        <scm-table-column type="index"
                          width="45"
                          :index="indexMethod"></scm-table-column>
        <scm-table-column label="省公司"
                          prop="company"
                          width="60"></scm-table-column>
        <scm-table-column label="工建项目编号"
                          prop="projectCode"
                          width="98"></scm-table-column>
        <scm-table-column label="工建项目名称"
                          prop="projectName"
                          width="99"></scm-table-column>
        <scm-table-column label="立项批复依据"
                          prop="gist"
                          width="98"></scm-table-column>
        <scm-table-column label="批发含税金额(元)"
                          prop="tax_inclusive"
                          width="120"></scm-table-column>
        <scm-table-column label="批发不含税金额(元)"
                          prop="excluding_tax"
                          width="134"></scm-table-column>
        <scm-table-column label="工建需求申请单号"
                          prop="applicationNumber"
                          width="117"></scm-table-column>
        <scm-table-column label="工建需求名称"
                          prop="applicationName"
                          width="199"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="product.viTotal"
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

const FETCH_PRODUCT_ACTION = 'mdm/fetchProduct';

export default {
  name: 'ScmProductSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchProductLoading: state =>
        state.loading.actions[FETCH_PRODUCT_ACTION],
      product: state => state.mdm.product,
    }),
  },
  mounted() {
    this.fetchProduct();
  },
  methods: {
    // 选择一其中条数据
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchProduct();
    },
    // 选择窗口显示数据的数量
    onSizeChange(val) {
      this.pageSize = val;
      this.fetchProduct();
    },
    // 表格的当前行发生变化的时候会触发该事件
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
      }
    },
    // 将数据发送给后台
    fetchProduct(params = {}) {
      const { currentPage, pageSize } = this;
      this.$store.dispatch(FETCH_PRODUCT_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
      });
    },
    indexMethod(index) {
      switch (index) {
        case 0:
          return index + 1;
        case 3:
          return index - 1;
        case 5:
          return index - 2;
        case 7:
          return index - 3;
        case 9:
          return index - 4;
        case 13:
          return index - 7;
        default:
          return null;
      }
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex < 7) {
        if (rowIndex === 0) {
          return {
            rowspan: 3,
            colspan: 1,
          };
        } else if (rowIndex > 2 && rowIndex < 9 && rowIndex % 2 === 1) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else if (rowIndex >= 9 && rowIndex % 4 === 1) {
          return {
            rowspan: 4,
            colspan: 1,
          };
        }
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
      return {
        colspan: 1,
        rowspan: 1,
      };
    },
  },
};
</script>
<style lang="scss">
.el-dialog {
  padding-bottom: 30px;
  .scm-product-select {
    width: 970px;
    margin: auto;

    .search-condition {
      .el-form-item {
        margin-bottom: 0;

        .erp-map-name {
          width: 220px;
        }
      }
    }

    .divider {
      width: 1000px;
      margin: 0px 0px 17px -15px;
      background-color: #eeeeee;
    }

    .el-table {
      margin-bottom: 10px;
      .el-table__row--striped td {
        background: #ffffff;
      }
      .el-table_4_column_40,
      .el-table_4_column_41 {
        border-bottom: 1px solid #e9eff2;
        border-left: 1px solid #e9eff2;
      }
      th.el-table_4_column_40,
      th.el-table_4_column_41 {
        border-bottom: 0px;
        border-left: 0px;
      }
    }
  }
}
</style>
