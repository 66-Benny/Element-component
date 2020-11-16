<!-- 搜索帮助（合同类型）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="合同类型"
                width="1000px">
    <div class="scm-toc-select">
      <scm-dialog-sub-header title="合同类型操作管理">
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
          <scm-divider type="vertical"></scm-divider>
          <scm-dialog-sub-header-button icon="submit"
                                        :disabled="submitDisabled"
                                        @click="onSubmit">
            提交
          </scm-dialog-sub-header-button>
        </template>
      </scm-dialog-sub-header>
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition-toc">
        <scm-form-item label="合同三级分类名称"
                       prop="contractAllName">
          <scm-input v-model="condition.contractName"
                     class="toc-dim-name"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <!-- 全选隐藏与显示 -->
      <scm-table ref="multipleTable"
                 :data="toc.viList"
                 v-loading="fetchTocLoading"
                 highlight-current-row
                 @selection-change="handleSelectionChange"
                 @current-change="onCurrentRowChange"
                 max-height="340"
                 style="padding:0px 15px;margin-bottom:0px">
        <scm-table-column label="合同一级分类ID"
                          prop="contractOneId"
                          width="155"></scm-table-column>
        <scm-table-column label="合同一级分类名称"
                          prop="contractOneName"
                          width="155"></scm-table-column>
        <scm-table-column label="合同二级分类ID"
                          prop="contractTwoId"
                          width="155"></scm-table-column>
        <scm-table-column label="合同二级分类名称"
                          prop="contractTwoName"
                          width="155"></scm-table-column>
        <scm-table-column label="合同三级分类ID"
                          prop="contractThreeId"
                          width="155"></scm-table-column>
        <scm-table-column label="合同三级分类名称"
                          prop="contractThreeName"
                          width="155"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="toc.viTotal"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange"
                      style="padding:0px 15px;text-align: left;">
      </scm-pagination>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_OU_ACTION = 'mdm/fetchToc';

export default {
  name: 'ScmTocSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      condition: {
        contractName: '',
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchTocLoading: state => state.loading.actions[FETCH_OU_ACTION],
      toc: state => state.mdm.toc,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.contractName);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.fetchToc();
  },
  methods: {
    onSearch() {
      this.fetchToc(this.condition);
    },
    onClear() {
      // this.$refs.multipleTable.clearSelection();清除全选
      this.$refs.conditionForm.resetFields();
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
    },
    onFormSubmit() {
      this.fetchToc(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchToc();
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.fetchToc();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    fetchToc(params = {}) {
      const { currentPage, pageSize } = this;
      this.$store.dispatch(FETCH_OU_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
      });
    },
  },
};
</script>
<style lang="scss">
.scm-toc-select {
  background: white;
  .search-condition-toc {
    display: flex;
    flex-wrap: wrap;
    .el-form-item--small.el-form-item {
      margin-right: 36px;
      text-align: left !important;

      .toc-dim-name {
        width: 216px;
        color: #4a4a4a;
      }
    }
  }
  .el-pagination {
    height: 30px;
  }
  .divider {
    margin-top: 0px;
    margin-bottom: 10px;
  }
  .el-table {
    margin-bottom: 10px;
  }
}
</style>
