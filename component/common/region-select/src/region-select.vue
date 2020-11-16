<template>
  <basic-dialog :visible.sync="innerVisible"
                title="大区信息"
                class="dialog-wrap"
                width="1080px">
    <scm-dialog-sub-header title="大区信息管理"
                           class="bank-common-select-dialog__header">
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
        <scm-divider type="vertical"
                     v-if="multiple"></scm-divider>
        <scm-dialog-sub-header-button icon="submit"
                                      :disabled="submitDisabled"
                                      @click="onSubmit"
                                      v-if="multiple">
          提交
        </scm-dialog-sub-header-button>
      </template>
    </scm-dialog-sub-header>
    <div class="bank-select bank-common-select-dialog">
      <scm-form :model="condition"
                @submit.native="onSearch"
                ref="conditionForm"
                label-position="top"
                inline
                class="search-condition">
        <scm-form-item label="查询范围"
                         prop="vipoType">
            <scm-select v-model="condition.selectKey"
                        :disabled="selectKeyDisabled"
                        @change="groupChange"
                        class="erp-map-name">
              <scm-option v-for="item of flagList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
              </scm-option>
            </scm-select>
        </scm-form-item>
        <scm-form-item label="大区编码"
                       prop="dqCode">
          <scm-input v-model="condition.dqCode" :disabled="dqCodeDisabled"></scm-input>
        </scm-form-item>
        <scm-form-item label="省份编码"
                       prop="addrCode">
          <scm-input v-model="condition.addrCode" :disabled="addrCodeDisabled"></scm-input>
        </scm-form-item>
        <scm-form-item label="地市编码"
                       v-if="condition.selectKey === '2'"
                       :disabled="cityCodeDisabled"
                       prop="cityCode">
          <scm-input v-model="condition.cityCode"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed></scm-divider>
      <scm-table ref="multipleTable"
                 :data="tableData.viList"
                 v-loading="fetchDataLoading"
                 highlight-current-row
                 @selection-change="handleSelectionChange"
                 @current-change="onCurrentRowChange"
                 max-height="360"
                 class="search-result-table"
                 row-key="productNum">
        <scm-table-column type="selection"
                          v-if="multiple"
                          reserve-selection
                          width="40"></scm-table-column>
        <scm-table-column type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="大区编码"
                          prop="dqCode"></scm-table-column>
        <scm-table-column label="大区名称"
                          prop="dqName"></scm-table-column>
        <scm-table-column label="省份编码"
                          prop="addrCode"></scm-table-column>
        <scm-table-column label="省份名称"
                          prop="addrName"></scm-table-column>
        <scm-table-column label="地市编码"
                          v-if="showCol"
                          prop="cityCode"></scm-table-column>
        <scm-table-column label="地市名称"
                          v-if="showCol"
                          prop="cityName"></scm-table-column>
      </scm-table>
      <scm-pagination v-show="tableData.viTotal"
                      :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="tableData.viTotal?tableData.viTotal:0"
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

const FETCH_DATA_ACTION = 'mdm/fetchRegion';

export default {
  name: 'ScmBankSelect',
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
    inputSelectKey: {
      // 查询范围 "1":大区 — 省份; "2":大区 — 省份 — 地市
      type: String,
      default: '1',
    },
    inputDqCode: {
      // 大区编码
      type: String,
      default: '',
    },
    inputAddrCode: {
      // 省份编码
      type: String,
      default: '',
    },
    inputCityCode: {
      // 地市编码
      type: String,
      default: '',
    },
    selectKeyDisabled: {
      // 是否禁用查询范围
      type: Boolean,
      default: false,
    },
    dqCodeDisabled: {
      // 是否禁用大区编码
      type: Boolean,
      default: false,
    },
    addrCodeDisabled: {
      // 是否禁用省份编码
      type: Boolean,
      default: false,
    },
    cityCodeDisabled: {
      // 是否禁用地市编码
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      condition: { // 搜索显示栏参数
        selectKey: this.inputSelectKey,
        dqCode: this.inputDqCode,
        addrCode: this.inputAddrCode,
        cityCode: this.inputSelectKey === '2' ? this.inputCityCode : '',
      },
      initCondition: {}, // 点击清空按钮需要重置的参数
      cloneCondition: {}, // 最终的请求参数
      fetchDataLoading: false,
      tableData: {
        viList: [],
        viTotal: 0,
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
      flagList: [
        {
          value: '1',
          label: '大区 — 省份',
        },
        {
          value: '2',
          label: '大区 — 省份 — 地市',
        },
      ],
      showCol: false,
    };
  },
  computed: {
    clearDisabled() {
      return _.isEqual(this.condition, this.initCondition);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  // wathc: {
  //   inputTaskCode(newVal) {
  //     this.condition.taskCode = newVal;
  //     this.onSearch(true);
  //   },
  // },
  mounted() {
    this.onSearch(true);
  },
  methods: {
    fetchData() {
      const {
        pageSize,
        currentPage,
        addrCode,
      } = this;
      this.fetchDataLoading = true;
      this.$store.dispatch(FETCH_DATA_ACTION, {
        pageNum: currentPage,
        pageSize,
        addrCode,
        ...this.cloneCondition,
      }).then((res) => {
        this.tableData = res.res;
        if (res.payload.selectKey === '1') {
          this.showCol = false;
        } else {
          this.showCol = true;
        }
      }).finally(() => {
        this.fetchDataLoading = false;
      });
    },
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
    onSearch(initSearch) {
      // initSearch: 是否需要修改点击清空按钮需要重置的参数
      if (initSearch) {
        this.initCondition = _.cloneDeep(this.condition);
        if (!this.selectKeyDisabled) {
          this.initCondition.selectKey = '1';
        }
        if (!this.dqCodeDisabled) {
          this.initCondition.dqCode = '';
        }
        if (!this.addrCodeDisabled) {
          this.initCondition.addrCode = '';
        }
        if (!this.cityCodeDisabled) {
          this.initCondition.cityCode = '';
        }
      }
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchData();
    },
    onClear() {
      Object.assign(this.condition, this.initCondition);
    },
    onPrevious() {
      this.$emit('select', '');
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
      this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onCurrentRowChange(val) {
      if (val && !this.multiple) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchData();
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    groupChange() {
      this.condition.cityCode = '';
    },
  },
};
</script>

<style lang="scss">
.bank-select {
  .el-divider {
    margin-top: 0px;
    margin-bottom: 15px;
  }
  .el-form-item {
    width: 216px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .el-table {
    margin-bottom: 10px;
  }
}
</style>


<style lang="scss" scoped>
.dialog-wrap {
  /deep/ .el-dialog__body {
    max-height: inherit;
  }
}
</style>
