<!-- 搜索帮助（物料信息） -->
<template>
  <basic-dialog :visible.sync="innerVisible"
                :showClose="showClose"
                :closeOnPressEscape="closeOnPressEscape"
                :closeOnClickModal="closeOnClickModal"
                title="物料信息"
                width="1080px">
    <div class="scm-materiel opi-common-select-dialog">
      <scm-dialog-sub-header title="物料信息查询管理" class="opi-common-select-dialog__header">
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
          <scm-divider type="vertical" v-if="multiple"></scm-divider>
          <scm-dialog-sub-header-button icon="submit"
                                        :disabled="submitDisabled"
                                        @click="onSubmit"
                                        v-if="multiple">
            提交
          </scm-dialog-sub-header-button>
        </template>
      </scm-dialog-sub-header>
      <scm-container class="scm-opi">
        <scm-aside width="220px; overflow-y: scroll;"
                  v-loading="fetchOpiTreeLoading"
                  element-loading-text="加载中..."
                  class="opi-menu">
          <scm-auto-menu :data="opitree"
                         @select="handleSelect"></scm-auto-menu>
      </scm-aside>
      <!-- <div class="scm-materiel-select"> -->
      <scm-main class="scm-opi-main">
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition"
                inline>
        <scm-form-item label="物料编码"
                       prop="vimatnrQuery">
          <scm-input v-model="condition.vimatnrQuery"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="物料描述"
                       prop="vimaktx">
          <scm-input v-model="condition.vimaktx"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="产品名称"
                       prop="viprodName">
          <scm-input v-model="condition.viprodName"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="产品编码"
                       prop="vizmatklQuota">
          <scm-input v-model="condition.vizmatklQuota"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="采购类型"
                         prop="vipoType">
            <scm-select v-model="condition.vipoType"
                        class="erp-map-name">
              <scm-option v-for="item of poType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
              </scm-option>
            </scm-select>
        </scm-form-item>
        <!-- 是：1  否：0 -->
        <scm-form-item label="仅搜索BOM"
                      v-if="isShowBomFlag"
                       prop="vizmatklQuota">
            <scm-select v-model="condition.bomFlag"
                        placeholder="请选择"
                        :disabled="bomFlgDisabled"
                        clearable>
              <scm-option label="否"
                          value="0"></scm-option>
              <scm-option label="是"
                          value="1"></scm-option>
            </scm-select>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="Materiel.viList"
                 v-loading="fetchMaterielLoading"
                 highlight-current-row
                 @current-change="onCurrentRowChange"
                 @selection-change="handleSelectionChange"
                 ref="multipleTable"
                 max-height="292"
                 row-key="zmtpre">
        <scm-table-column type="selection"
                          reserve-selection
                          v-if="multiple"></scm-table-column>
        <scm-table-column type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="物料编码"
                          prop="materialCode"
                          width="110"></scm-table-column>
        <scm-table-column label="物料描述"
                          prop="shortName"
                          width="150"></scm-table-column>
        <scm-table-column label="产品编码"
                          prop="subProductNum"
                          width="120"></scm-table-column>
        <scm-table-column label="产品名称"
                          prop="subProductDesc"
                          width="110"></scm-table-column>
        <scm-table-column label="计量单位"
                          prop="materialUnit"></scm-table-column>
        <scm-table-column label="采购类型"
                          prop="poTypeLabel"
                          width="110"></scm-table-column>
      </scm-table>
      <scm-pagination v-show="Materiel.viTotal"
                      :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="Materiel.viTotal"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>
        </scm-main>
      </scm-container>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';
import ScmAutoMenu from '../../menu/scm-auto-menu';

const FETCH_MATERIEL_ACTION = 'mdm/fetchMateriel';
const FETCH_OPITREE_ACTION = 'mdm/fetchOpiTree';

export default {
  name: 'ScmMaterielSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
    ScmAutoMenu,
  },
  props: {
    ebeln: {
      // 框架合同编号
      type: String,
    },
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    viproductType: {
      // 1 == 目录产品 2 == 细化产品
      type: String,
      default: '2',
    },
    zfbprod: { // 非标产品标识(1:一采非标;2:二采非标;3:标准产品; 空值：全部产品)
      type: String,
      default: '3',
    },
    viTopoType: { // 采购类型(1:一级集采;2:二级集采;3:非集采;空值：全部类型)
      type: String,
      default: '',
    },
    flag: { // 动态显示下拉框 '1'包括一级集采 '2'不包括一级集采 是否参考总部合同创建
      type: String,
    },
    inputBomFlg: {
      // 仅搜索BOM "0":否; "1":是
      type: String,
      default: '0',
    },
    bomFlgDisabled: {
      // 是否禁用仅搜索BOM
      type: Boolean,
      default: false,
    },
    status: {
      // 物料状态（A-有效; B-预冻结; C-冻结; D-失效）
      type: String,
      default: '',
    },
    isShowBomFlag: {
      // 是否显示“仅搜索BOM”
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      multipleSelection: [],
      condition: {
        vimatnrQuery: '',
        vimaktx: '',
        viprodName: '',
        vizmatklQuota: '',
        vipoType: '',
        bomFlag: this.inputBomFlg,
        // viprodName: '',
        // vipurType: '',
      },
      poType: '',
      poType1: [
        { value: '', label: '全部' },
        { value: '1', label: '一级集采' },
        { value: '2', label: '二级集采' },
        { value: '3', label: '非集采' },
      ],
      poType2: [
        { value: '', label: '全部' },
        // { value: '1', label: '一级集采' },
        { value: '2', label: '二级集采' },
        { value: '3', label: '非集采' },
      ],
      currentPage: 1,
      pageSize: 10,
      cloneCondition: {},
      esopiData: '',
      opitree: [],
      fetchOpiTreeLoading: false,
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchMaterielLoading: state => state.loading.actions[FETCH_MATERIEL_ACTION],
      Materiel: state => state.mdm.Materiel,
    }),
    clearDisabled() {
      let isEmpty = false;
      if (this.bomFlgDisabled) {
        isEmpty = _.isEmpty(this.condition.vimatnrQuery ||
          this.condition.vimaktx ||
          this.condition.vizmatklQuota ||
          this.condition.vipoType ||
          this.condition.viprodName);
      } else {
        isEmpty = _.isEmpty(this.condition.vimatnrQuery ||
          this.condition.vimaktx ||
          this.condition.vizmatklQuota ||
          this.condition.vipoType ||
          this.condition.viprodName) && this.condition.bomFlag === '0';
      }
      return isEmpty;
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
      // return _.isEmpty(this.multipleSelection);
    },
  },
  mounted() {
    // this.fetchMateriel();
    this.fetchOpiTree();
    if (this.flag === '2') {
      this.poType = this.poType2;
    } else {
      this.poType = this.poType1;
    }
  },
  watch: {
    innerVisible(newVal) {
      if (newVal && this.openRefresh) {
        this.currentPage = 1;
        Object.assign(this.cloneCondition, this.condition);
        this.fetchMateriel(this.condition);
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
        }
      } else if (!newVal) {
        this.onClear();
      }
    },
    multiple() {
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchMateriel(this.condition);
    },
    handleSelect(key) {
      this.$refs.conditionForm.resetFields();
      this.condition.vizmatklQuota = key;
      this.Searchinit();
    },
    onSearch() {
      this.Searchinit();
      this.$refs.multipleTable.clearSelection();
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
      this.$refs.multipleTable.clearSelection();
    },
    onPrevious() {
      this.$emit('select', this.esopiData);
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
      if (!this.bomFlgDisabled) {
        this.condition.bomFlag = '0';
      }
    },
    onFormSubmit() {
      this.fetchMateriel(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchMateriel(this.cloneCondition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchMateriel(this.cloneCondition);
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
    fetchOpiTree() {
      // 产品树的获取
      const {
        viproductType, addrCode, zfbprod, viTopoType, flag,
      } = this;
      this.fetchOpiTreeLoading = true;
      this.$store.dispatch(FETCH_OPITREE_ACTION, {
        viproductType,
        addrCode,
        zfbprod,
        viTopoType,
        flag,
      }).then((res) => {
        this.opitree = res;
      }).finally(() => {
        this.fetchOpiTreeLoading = false;
      });
    },
    fetchMateriel(params = {}) {
      const {
        currentPage,
        pageSize,
        addrCode,
        status,
        flag,
      } = this;
      const data = params;
      if (!this.isShowBomFlag) {
        delete data.bomFlag;
      }
      this.$store.dispatch(FETCH_MATERIEL_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        addrCode,
        status,
        flag,
        ...data,
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
.opi-common-select-dialog {
  .opi-menu {
    & > .el-menu {
      padding-left: 10px;
      padding-right: 10px;
      padding: 0;
      position: absolute;
      & > .el-submenu {
        background-color: #fff;
        color: #4a4a4a;

        & > .el-submenu__title {
          border-bottom: 1px dashed #cccccc;
          margin-left: -20px;
          color: #4a4a4a;
          padding: 0 !important;
          margin: 0;
          div {
            padding: 0 10px;
          }
          .el-submenu__icon-arrow {
            color: #9b9b9b;
            right: 10px;
            display: inherit;
            font-size: 14px;
            font-weight: 700;
          }
          &:hover {
            color: #fff;
          }
        }
        &:hover {
          & > .el-submenu__title {
            .el-submenu__icon-arrow {
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.scm-materiel {
  margin-bottom: -20px;
    .el-main{
      overflow:hidden;
    }
  .opi-common-select-dialog__header {
    margin-bottom: 0;
  }
  .scm-opi {
    background-color: #f6f6f6;
    margin-left: -10px;
    margin-right: -10px;
    padding-bottom: 10px;
    height: 500px;
    position: relative;
    .opi-menu {
      padding-right: 10px;
      height: 490px;
      background-color: #fff;
      overflow-y: auto;
      overflow-x: hidden;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 220px;
      .el-menu {
        width: 100%;
        border-right-width: 0;
      }
    }
    .scm-opi-main {
      background-color: #fff;
      padding: 10px;
      width: 1px;
      padding-left: 230px;
      .search-condition {
        .el-form-item {
          width: 250px;
          display: inline-block;
          margin-bottom: 10px;

        //   & + .el-form-item {
        //   }
        }

        .el-input,
        .el-select {
          width: 250px;
        }
      }
      .el-divider {
        margin-top: 0px;
        margin-bottom: 15px;
      }
      .search-result-table {
        width: 830px;
      }
      .el-pagination {
        margin-top: 5px;
      }
    }
  }
}
</style>
