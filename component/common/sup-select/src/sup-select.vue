<!-- 搜索帮助（供应商信息）-->

<template>
  <basic-dialog :visible.sync="innerVisible"
                title="供应商信息"
                width="1000px">
    <div class="scm-sup-select">
      <scm-dialog-sub-header title="供应商信息操作管理">
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
          <scm-divider type="vertical"
                       v-if="nullValue"></scm-divider>
          <scm-dialog-sub-header-button icon="previous"
                                        v-if="nullValue"
                                        @click="onPrevious">
            返回空值
          </scm-dialog-sub-header-button>
          <!-- <scm-divider type="vertical"></scm-divider>
          <scm-dialog-sub-header-button icon="submit"
                                        :disabled="submitDisabled"
                                        @click="onSubmit">
            提交
          </scm-dialog-sub-header-button> -->
        </template>
      </scm-dialog-sub-header>
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition-sup"
                inline>
        <scm-form-item label="供应商编码"
                       prop="viSupNum">
          <scm-input v-model="condition.viSupNum"
                     class="sup-dim-name">
            <!-- <scm-button slot="append"
                        icon="el-icon-search"
                        class="append-button">
            </scm-button> -->
          </scm-input>
        </scm-form-item>
        <scm-form-item label="供应商名称"
                       prop="viSupName">
          <scm-input v-model="condition.viSupName"
                     class="sup-dim-name">
          </scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <!-- 全选隐藏与显示 -->
      <scm-table ref="multipleTable"
                 :data="sup.viList"
                 v-loading="fetchSupLoading"
                 highlight-current-row
                 max-height="350"
                 @selection-change="handleSelectionChange"
                 @current-change="onCurrentRowChange">
        <!-- <scm-table-column type="selection" ></scm-table-column> -->
        <scm-table-column type="index"
                          width="80"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="供应商编码"
                          prop="lifnr"
                          width="300"></scm-table-column>
        <scm-table-column label="供应商名称"
                          prop="name"
                          width="300"></scm-table-column>
        <scm-table-column label="供应商地址"
                          prop="address"
                          width="300"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="sup.viTotal"
                      v-show="sup.viTotal"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_SUP_ACTION = 'mdm/fetchSup';

export default {
  name: 'ScmSupSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      condition: {
        viSupNum: '',
        viSupName: '',
      },
      currentPage: 1,
      pageSize: 10,
      esSup: '',
      cloneCondition: {},
      esData: '',
    };
  },
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    purchaseType: {
      // 是否是采购类型(Y:采购类型N:非采购类型)
      type: String,
    },
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchSupLoading: state => state.loading.actions[FETCH_SUP_ACTION],
      sup: state => state.mdm.sup,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viSupNum || this.condition.viSupName);
    },
    submitDisabled() {
      return _.isEmpty(this.esSup);
    },
  },
  mounted() {
    this.fetchSup();
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchSup(this.condition);
    },
    onSearch() {
      this.Searchinit();
    },
    onSubmit() {
      this.$emit('select', this.esSup);
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onPrevious() {
      this.$emit('select', this.esData);
    },
    onFormSubmit() {
      this.fetchSup(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchSup(this.cloneCondition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchSup(this.cloneCondition);
    },
    handleSelectionChange(val) {
      this.esSup = val;
    },
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    fetchSup(params = {}) {
      const {
        currentPage, pageSize, addrCode, purchaseType,
      } = this;
      this.$store.dispatch(FETCH_SUP_ACTION, {
        addrCode,
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
        purchaseType,
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
.scm-sup-select {
  background: white;
  .search-condition-sup {
    .el-form-item {
      width: 220px;
      margin-right: 25px;
      margin-bottom: 5px;
    }
  }
  .el-pagination {
    height: 30px;
    margin: 0px !important;
  }
  .divider {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .el-table {
    margin-bottom: 10px;
  }
}
</style>
