<!-- 搜索帮助（根据项目查询产品）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="产品信息"
                width="1000px">
    <scm-dialog-sub-header title="产品信息操作管理">
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
    <div class="scm-opi">
      <div class="scm-opi-menu">
        <scm-auto-menu
          class="opi-menu"
          :data="opitree.viList"
          @select="handleSelect"></scm-auto-menu>
      </div>
      <div class="scm-opi-select">
        <scm-form :model="condition"
                  @submit.native="onFormSubmit"
                  ref="conditionForm"
                  label-position="top"
                  class="search-condition-opi">
          <scm-form-item label="名称"
                         prop="viprodName">
            <scm-input v-model="condition.viprodName"
                       class="opi-dim-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="产品全ID"
                         prop="viprodFullId">
            <scm-input v-model="condition.viprodFullId"
                       class="opi-dim-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="项目ID"
                         prop="prjId">
            <scm-input v-model="condition.prjId"
                       class="opi-dim-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="采购类型"
                         prop="viProType">
            <scm-select v-model="condition.viProType"
                        class="opi-dim-name">
              <scm-option v-for="item of poType"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
              </scm-option>
            </scm-select>
          </scm-form-item>
        </scm-form>
        <scm-divider dashed
                     class="divider"></scm-divider>
        <!-- 全选隐藏与显示 -->
        <scm-table ref="multipleTable"
                   :data="opi.viList"
                   v-loading="fetchOpiProjectLoading"
                   highlight-current-row
                   @selection-change="handleSelectionChange"
                   @current-change="onCurrentRowChange"
                   max-height="360"
                   min-height="360"
                   style="margin-bottom:0px">
          <scm-table-column type="index"
                            width="54"
                            :index='getTableIndex'></scm-table-column>
          <scm-table-column label="项目ID"
                            prop="prjId"
                            width="94"></scm-table-column>
          <scm-table-column label="产品全ID"
                            prop="prodFullId"
                            width="100"></scm-table-column>
          <scm-table-column label="产品编码"
                            prop="prodId"
                            width="80"></scm-table-column>
          <scm-table-column label="产品名称"
                            prop="prodName"
                            width="90"></scm-table-column>
          <scm-table-column label="计量单位"
                            prop="unit"
                            width="70"></scm-table-column>
          <scm-table-column label="六位小类"
                            prop="zkey"
                            width="70"></scm-table-column>
          <scm-table-column label="小类"
                            prop="zkey3"
                            width="70"></scm-table-column>
          <scm-table-column label="小类描述"
                            prop="zkey3Text"
                            width="72"></scm-table-column>
        </scm-table>
        <scm-pagination :page-sizes="[10, 20, 50]"
                        :page-size="pageSize"
                        :total="opi.viList?opi.viList.length:0"
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
import ScmAutoMenu from '../../menu/scm-auto-menu';

const FETCH_OPI_ACTION = 'mdm/fetchOpiProject';
const FETCH_OPITREE_ACTION = 'mdm/fetchOpiTree';

export default {
  name: 'ScmOpiSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
    ScmAutoMenu,
  },
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    prjId: {
      required: true,
      type: String,
      default: '100000000009144',
    },
    viproductType: {
      required: true,
      type: String,
      default: '2',
    },
  },
  data() {
    return {
      condition: {
        viprodName: '',
        viprodFullId: '',
        viProType: '',
        prjId: '',
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
      poType: [
        { value: '', label: '全部' },
        { value: '1', label: '一级集采' },
        { value: '2', label: '二级集采' },
        { value: '3', label: '非集采' },
      ],
      activeIndex: '1',
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchOpiProjectLoading: state =>
        state.loading.actions[FETCH_OPI_ACTION],
      opi: state => state.mdm.OpiProject,
      opitree: state => state.mdm.OpiTree,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viprodName ||
          this.condition.viprodFullId ||
          this.condition.prjId ||
          this.condition.viProType);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.condition.prjId = this.prjId;
    this.fetchOpiProject();
    this.fetchOpiTree();
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(keyPath);
    },
    onSearch() {
      this.fetchOpiProject(this.condition);
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
    },
    onFormSubmit() {
      this.fetchOpiProject(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchOpiProject();
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchOpiProject();
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
    fetchOpiProject(params = {}) {
      const { prjId } = this;
      this.$store.dispatch(FETCH_OPI_ACTION, {
        prjId,
        ...params,
      });
    },
    fetchOpiTree() {
      // 产品树的获取
      const { viproductType, addrCode } = this;
      this.$store.dispatch(FETCH_OPITREE_ACTION, {
        viproductType,
        addrCode,
      });
    },
    // 获取table序号
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
  },
};
</script>
<style lang="scss" scoped>
.scm-opi {
  margin-left: -10px;
  margin-right: -10px;
  position: relative;
  .scm-opi-menu {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 220px;
    border: 0;
    overflow-y: scroll;
    /deep/ .el-menu {
      border: 0;
    }
    /deep/ .el-submenu__title {
      padding: 0 !important;
      div {
        padding-left: 20px;
      }
      i {
        display: block;
        color: #666;
        top: 57%;
      }
    }
    .opi-menu {
      width: 100%;
      /deep/ {
        .el-submenu {
          & > .el-submenu__title {
            border-bottom: 1px dashed #cccccc;
          }
        }
      }
    }
  }
  .scm-opi-select {
    display: inline-block;
    width: 700px;
    margin-left: 10px;
    vertical-align: top;
    padding-left: 230px;
    .search-result-table {
      width: 100%;
    }

    .search-condition-opi {
      .el-input__inner {
        width: 216px;
        height: 30px;
      }
      .el-form-item--small.el-form-item {
        float: left;
        margin-right: 10px;
        .opi-dim-name {
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
}
</style>
