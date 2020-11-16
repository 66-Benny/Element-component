<!-- 搜索帮助（计量单位信息）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="单位信息"
                width="1000px">
    <div class="scm-unit-select">
      <scm-dialog-sub-header title="单位信息查询管理">
        <template slot="action">
          <scm-dialog-sub-header-button icon="search"
                                        @click="onSearch">
            搜索
          </scm-dialog-sub-header-button>
          <scm-divider type="vertical" ></scm-divider>
          <scm-dialog-sub-header-button icon="clear"
                                        :disabled="clearDisabled"
                                        @click="onClear">
            清空
          </scm-dialog-sub-header-button>
          <scm-divider type="vertical"
                       v-if="nullValue"></scm-divider>
          <scm-dialog-sub-header-button   icon="previous"
                                          v-if="nullValue"
                                          @click="onPrevious">
              返回空值
          </scm-dialog-sub-header-button>
        </template>
      </scm-dialog-sub-header>
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition-unit"
                inline>
        <scm-form-item label="单位编号"
                       prop="viunitNum">
          <scm-input v-model="condition.viunitNum"
                     class="unit-dim-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="单位名称"
                       prop="viunitName">
          <scm-input v-model="condition.viunitName"
                     class="unit-dim-name"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <!-- 全选隐藏与显示 -->
      <scm-table ref="multipleTable"
                 :data="unit.viList"
                 v-loading="fetchDataLoading"
                 highlight-current-row
                 @selection-change="handleSelectionChange"
                 @current-change="onCurrentRowChange"
                 max-height="340">
        <scm-table-column type="index"
                          width="128"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="单位编号"
                          prop="code"></scm-table-column>
        <scm-table-column label="单位名称"
                          prop="value"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="unit.viTotal"
                      v-show="unit.viTotal"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_OU_ACTION = 'mdm/fetchUnit';

export default {
  name: 'ScmUnitSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      condition: {
        viunitNum: '',
        viunitName: '',
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
      esUnitdata: '',
      fetchDataLoading: false,
      initCondition: {}, // 点击清空按钮需要重置的参数
      cloneCondition: {}, // 最终的请求参数
      unit: {
        viList: [],
        viTotal: 0,
      },

    };
  },
  props: {
  },
  computed: {
    clearDisabled() {
      return _.isEmpty(this.condition.viunitNum || this.condition.viunitName);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.onSearch(true);
  },
  methods: {
    onSearch(initSearch) {
      // initSearch: 是否需要修改点击清空按钮需要重置的参数
      if (initSearch) {
        this.initCondition = _.cloneDeep(this.condition);
      }
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchUnit();
    },
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
    onClear() {
      // this.$refs.multipleTable.clearSelection();清除全选
      this.$refs.conditionForm.resetFields();
    },
    onPrevious() {
      this.$emit('select', this.esUnitdata);
    },
    onFormSubmit() {
      this.fetchUnit();
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchUnit();
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchUnit();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    fetchUnit() {
      const { currentPage, pageSize } = this;
      this.fetchDataLoading = true;
      this.$store.dispatch(FETCH_OU_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...this.cloneCondition,
      }).then((res) => {
        this.unit = res;
      }).finally(() => {
        this.fetchDataLoading = false;
      });
    },
  },
};
</script>
<style lang="scss">
  .scm-unit-select {
      .el-dialog__sub-header-title {
        font-size: 14px;
        color: #4a4a4a;
      }
    .search-condition-unit {
      .el-form-item {
        width: 220px;
        margin-bottom: 0px;
        margin-right: 20px;
        .unit-dim-name{
          width: 100%;
        }
      }
    }
    .divider {
      margin-top: 10px;
      margin-bottom: 10px;
      border: 1px dashed #e8e8e8;
    }
    .el-table {
      margin-bottom: 10px;
    }
  }

</style>
