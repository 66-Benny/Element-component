<!-- 搜索帮助（下发单位） -->

<template>
  <basic-dialog :visible.sync="innerVisible"
                title="查询发起单位/收货单位"
                width="1000px">
    <div class="scm-operating-unit-select">
      <scm-dialog-sub-header title="查询发起单位/收货单位">
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
          <scm-dialog-sub-header-button   icon="previous"
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
                       prop="viName">
          <scm-input v-model="condition.viName"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="operatingUnit.viList"
                 v-loading="fetchoperatingUnitLoading"
                 highlight-current-row
                 @current-change="onCurrentRowChange"
                 ref="multipleTable"
                 max-height="337">
        <scm-table-column type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="OU组织编码"
                          prop="erpMapId"
                          width="100"></scm-table-column>
        <scm-table-column label="OU组织名称"
                          prop="erpMapName"></scm-table-column>
        <scm-table-column label="工厂代码"
                          prop="code"
                          width="110"></scm-table-column>
        <scm-table-column label="工厂名称"
                          prop="name"
                          width="150"></scm-table-column>
        <scm-table-column label="省份编码"
                          prop="addrCode"
                          width="210"></scm-table-column>
        <scm-table-column label="法人名称"
                          prop="addrName"
                          width="100"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="operatingUnit.viTotal"
                      v-show="operatingUnit.viTotal"
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

const FETCH_OPERATINGUNIT_ACTION = 'mdm/fetchOperatingUnit';

export default {
  name: 'ScmOperating-unitSelect',
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
    viCode: {
      // required: true,
      type: String,
    },
  },
  data() {
    return {
      condition: {
        viName: '',
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      esOperatingunitData: '',
      cloneCondition: {},
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchoperatingUnitLoading: state =>
        state.loading.actions[FETCH_OPERATINGUNIT_ACTION],
      operatingUnit: state => state.mdm.operatingUnit,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viName);
    },
  },
  mounted() {
    this.fetchOperatingUnit();
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchOperatingUnit(this.condition);
    },
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
    onSearch() {
      this.Searchinit();
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onPrevious() {
      this.$emit('select', this.esOperatingunitData);
    },
    onFormSubmit() {
      this.Searchinit();
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchOperatingUnit(this.cloneCondition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchOperatingUnit(this.cloneCondition);
    },
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    fetchOperatingUnit(params = {}) {
      const {
        currentPage, pageSize, addrCode,
      } = this;
      this.$store.dispatch(FETCH_OPERATINGUNIT_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
        addrCode,
      });
    },
  },
};
</script>
<style lang="scss">
.scm-operating-unit-select {
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
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .el-table {
    margin-bottom: 10px;
  }
}
</style>
