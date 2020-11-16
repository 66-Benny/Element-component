<!-- 搜索帮助（产品信息）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="省采购项目产品信息"
                width="1000px">
    <scm-dialog-sub-header title="省采购项目产品信息管理">
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
        <!-- <scm-divider type="vertical"></scm-divider>
        <scm-dialog-sub-header-button icon="submit"
                                      :disabled="submitDisabled"
                                      @click="onSubmit">
          提交
        </scm-dialog-sub-header-button> -->
      </template>
    </scm-dialog-sub-header>
    <div class="scm-opi">
      <div class="scm-opi-select">
        <scm-form :model="condition"
                  @submit.native="onFormSubmit"
                  ref="conditionForm"
                  label-position="top"
                  class="search-condition-opi">
          <scm-form-item label="产品全ID"
                         prop="viprodFullId">
            <scm-input v-model="condition.viprodFullId"
                       class="opi-dim-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="产品名称"
                         prop="viprodName">
            <scm-input v-model="condition.viprodName"
                       class="opi-dim-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="项目编码"
                         prop="viprjId">
            <scm-input v-model="condition.viprjId"
                       class="opi-dim-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="供应商编码"
                         prop="visupplierNumber">
            <scm-input v-model="condition.visupplierNumber"
                       class="opi-dim-name"></scm-input>
          </scm-form-item>
        </scm-form>
        <scm-divider dashed
                     class="divider"></scm-divider>
        <!-- 全选隐藏与显示 -->
        <scm-table ref="multipleTable"
                   :data="OpiSup.viList"
                   v-loading="fetchOpiSupLoading"
                   highlight-current-row
                   @selection-change="handleSelectionChange"
                   @current-change="onCurrentRowChange"
                   max-height="340">

          <scm-table-column type="index"
                            width="54"
                            :index='getTableIndex'></scm-table-column>
          <scm-table-column label="产品编码"
                            prop="prodId"
                            width="94"></scm-table-column>
          <scm-table-column label="产品全ID"
                            prop="prodFullId"
                            width="100"></scm-table-column>
          <scm-table-column label="产品名称"
                            prop="prodName"></scm-table-column>
          <scm-table-column label="项目名称"
                            prop="prjName"
                            width="306"></scm-table-column>
          <scm-table-column label="项目编码"
                            prop="prjId"
                            width="150"></scm-table-column>
          <scm-table-column label="供应商编码"
                            prop="lifnr"
                            width="100"></scm-table-column>
        </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="OpiSup.viTotal"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>
      </div>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_OPISUP_ACTION = 'mdm/fetchOpiSupSup';

export default {
  name: 'ScmOpiSelect',
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
  },
  data() {
    return {
      condition: {
        viprodFullId: '',
        viprodName: '',
        viprjId: '',
        visupplierNumber: '',
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
      activeIndex: '1',
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchOpiSupLoading: state => state.loading.actions[FETCH_OPISUP_ACTION],
      OpiSup: state => state.mdm.OpiSup,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viprodFullId ||
          this.condition.viprodName ||
          this.condition.viprjId ||
          this.condition.visupplierNumber);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.fetchOpiSup();
  },
  methods: {
    // handleSelect(key, keyPath) {
    //   console.log(keyPath);
    // },
    onSearch() {
      this.currentPage = 1;
      this.fetchOpiSup(this.condition);
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
    },
    onFormSubmit() {
      this.fetchOpiSup(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchOpiSup(this.condition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchOpiSup(this.condition);
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
    fetchOpiSup(params = {}) {
      const { currentPage, pageSize, addrCode } = this;
      this.$store.dispatch(FETCH_OPISUP_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        addrCode,
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
.scm-opi-select {
  width: 100%;
  .search-condition-opi{
      .el-form-item--small.el-form-item {
        float: left;
        margin-right: 15px;
        .opi-dim-name {
          width: 216px;
          color: #4a4a4a;
        }
      }
      .erp-map-name {
        width: 220px;
      }
  }

  .divider {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .el-pagination {
      height: 30px;
      margin: 0px !important;
    }
  .el-table {
    margin-bottom: 10px;
  }
}
</style>
