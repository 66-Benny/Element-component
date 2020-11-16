<!-- 搜索帮助（仓库） -->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="子库选择"
                width="60%">
    <div class="scm-sublibrary-select">
      <scm-dialog-sub-header title="子库信息查询管理">
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
        <scm-divider type="vertical" v-if="nullValue"></scm-divider>
        <scm-dialog-sub-header-button icon="previous"
                                      v-if="nullValue"
                                      @click="onPrevious">
          返回空值
        </scm-dialog-sub-header-button>
        </template>
      </scm-dialog-sub-header>
      <scm-form :model="condition"
                @submit.native.prevent="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition"
                inline>
        <scm-form-item label="子库编码"
                       prop="viSearchCode">
          <scm-input v-model="condition.viSearchCode"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="子库名称"
                       prop="viSearchName">
          <scm-input v-model="condition.viSearchName"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="sublibrary.viList"
                 v-loading="false"
                 ref="multipleTable"
                 highlight-current-row
                 @current-change="onCurrentRowChange"
                 max-height="337">
        <scm-table-column type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="子库编码"
                          prop="secondaryInventoryName"></scm-table-column>
        <scm-table-column label="子库名称"
                          prop="description"></scm-table-column>
        <scm-table-column label="货位控制"
                          prop="locatorTypeDesc"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="sublibrary.viTotal"
                      v-show="sublibrary.viTotal"
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

const FETCH_SUBLIBRARY_ACTION = 'mdm/fetchSublibrary';

export default {
  name: 'ScmSublibrarySelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    warehouseCode: { // 仓库编码
      type: String,
      default: '',
    },
    permissionFilter: { // 是否过滤权限，1：过滤，其他不过滤
      type: String,
      default: '',
    },
    ioCode: { // IO编码
      type: String,
    },
    ouCode: { // OU编码
      type: String,
    },
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    userId: { // 用户ID(邮箱)
      type: String,
    },
  },
  data() {
    return {
      condition: {
        viSearchName: '',
        viSearchCode:''
      },
      currentPage: 1,
      pageSize: 10,
      esData: '',
      cloneCondition: {},
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchSublibraryLoading: state =>
        state.loading.actions[FETCH_SUBLIBRARY_ACTION],
      sublibrary: state => state.mdm.Sublibrary,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viSearchName)&&_.isEmpty(this.condition.viSearchCode);
    },
  },
  mounted() {
    this.fetchSublibrary();
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchSublibrary(this.condition);
      this.$refs.multipleTable.clearSelection();
    },
    onSearch() {
      this.Searchinit();
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onPrevious() {
      this.$emit('select', this.esData);
    },
    onFormSubmit() {
      this.fetchSublibrary(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchSublibrary(this.cloneCondition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchSublibrary(this.cloneCondition);
    },
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    fetchSublibrary(params = {}) {
      const {
        currentPage,
        pageSize,
        ioCode,
        ouCode,
        addrCode,
        userId,
        warehouseCode,
        permissionFilter,
      } = this;
      this.$store.dispatch(FETCH_SUBLIBRARY_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ioCode,
        ouCode,
        addrCode,
        userId,
        warehouseCode,
        permissionFilter,
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
.scm-sublibrary-select {
  width: 100%;

  .search-condition {
    .el-form-item {
      margin-bottom: 0;

      .erp-map-name {
        width: 220px;
      }
    }
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
