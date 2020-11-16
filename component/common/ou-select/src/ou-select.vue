<!-- 搜索帮助（OU信息） -->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="OU信息"
                width="1000px">
    <div class="scm-ou-select">
      <scm-dialog-sub-header title="OU信息操作管理">
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
        <scm-form-item label="OU组织名称"
                       prop="viErpMapName">
          <scm-input v-model="condition.viErpMapName"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="ou.viList"
                 ref="multipleTable"
                 v-loading="fetchOuLoading"
                 highlight-current-row
                 @current-change="onCurrentRowChange"
                 max-height="337">
        <scm-table-column type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="OU组织编码"
                          prop="erpMapId"
                          width="100"></scm-table-column>
        <scm-table-column label="OU组织名称"
                          prop="erpMapName"
                          width="162"></scm-table-column>
        <scm-table-column label="工厂代码"
                          prop="code"></scm-table-column>
        <scm-table-column label="工厂名称"
                          prop="name"
                          width="261"></scm-table-column>
        <scm-table-column label="省份编码"
                          prop="addrCode"></scm-table-column>
        <scm-table-column label="法人名称"
                          prop="addrName"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="ou.viTotal"
                      v-show="ou.viTotal"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange"
                      style="text-align:left">
      </scm-pagination>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_OU_ACTION = 'mdm/fetchOu';

export default {
  name: 'ScmOuSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    plantType: { // 业务主体(0:上市, 1:铁通, 2:TD, 空：全部)
      type: String,
      default: '',
    },
    code: { // 工厂编码
      type: String,
      // default: '1201',
    },
    deptId: { // 部门id
      type: String,
      // default: '1201',
    },
  },
  data() {
    return {
      condition: {
        viErpMapName: '',
      },
      currentPage: 1,
      pageSize: 10,
      cloneCondition: {},
      esData: '',
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchOuLoading: state => state.loading.actions[FETCH_OU_ACTION],
      ou: state => state.mdm.ou,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viErpMapName);
    },
  },
  watch: {
    plantType() {
      this.Searchinit();
    },
    code() {
      this.fetchOu();
    },
  },
  mounted() {
    this.fetchOu();
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchOu(this.condition);
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
      this.Searchinit();
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchOu(this.cloneCondition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchOu(this.cloneCondition);
    },
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    fetchOu(params = {}) {
      const {
        currentPage, pageSize, addrCode, plantType, code, deptId,
      } = this;
      this.$store.dispatch(FETCH_OU_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        plantType,
        ...params,
        addrCode,
        code,
        deptId,
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
.scm-ou-select {
  width: 100%;

  .search-condition {
    .el-form-item {
        width: 220px;
        margin-right: 20px;
        margin-bottom: 0px;
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
