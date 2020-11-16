<!-- 搜索帮助（供应商信息）-->

<template>
  <basic-dialog :visible.sync="innerVisible"
                title="供应商联系人信息"
                width="1000px">
    <div class="scm-sup-select">
      <scm-dialog-sub-header title="供应商联系人信息">
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
                 max-height="250"
                 @selection-change="handleSelectionChange"
                 @current-change="onCurrentRowChange"
                 :current-group-name="currentGroupName">
        <!-- <scm-table-column type="selection" ></scm-table-column> -->
        <scm-table-column-group v-for="groupItem in selectDataListType"
                                :key="groupItem.groupName"
                                :name="groupItem.groupName"
                                :label="groupItem.groupLabel">
          <scm-table-column type="index"
                            width="80"
                            :index='getTableIndex'></scm-table-column>
          <scm-table-column v-for="item in groupItem.groupList"
                            :key="item.label"
                            :label="item.label"
                            :prop="item.prop"
                            :width="item.width"></scm-table-column>
        </scm-table-column-group>
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
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_SUP_ACTION = 'mdm/fetchSupContact';

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
      fetchSupLoading: false,
      sup: {
        viTotal: 0,
        viList: [],
      },
      esSup: '',
      cloneCondition: {},
      esData: '',
      currentGroupName: 'group1',
      listDataType0: [
        {
          groupName: 'group1',
          groupLabel: '基本信息',
          groupList: [
            {
              label: '供应商编码',
              prop: 'lifnr',
              width: '90',
            },
            {
              label: '供应商名称',
              prop: 'name',
              width: '',
            },
            {
              label: '省码',
              prop: 'addrCode',
              width: '70',
            },
            {
              label: '纳税资质',
              prop: 'vatFlag',
              width: '100',
            },
            {
              label: '供应商地址编码',
              prop: 'vendorSitCode',
              width: '250',
            },
            {
              label: 'OU组织名称',
              prop: 'ouName',
              width: '180',
            },
          ],
        },
        {
          groupName: 'group2',
          groupLabel: '联系人信息',
          groupList: [
            {
              label: '联系人姓名',
              prop: 'contactName',
              width: '',
            },
            {
              label: '联系人电话',
              prop: 'contactPhone',
              width: '220',
            },
            {
              label: '联系人传真',
              prop: 'contactFax',
              width: '220',
            },
            {
              label: '联系人邮箱',
              prop: 'contactMail',
              width: '220',
            },
          ],
        },
      ],
      listDataType1: [
        {
          groupName: 'group1',
          groupLabel: '基本信息',
          groupList: [
            {
              label: '供应商编码',
              prop: 'lifnr',
              width: '90',
            },
            {
              label: '供应商名称',
              prop: 'name',
            },
            {
              label: '供应商地址',
              prop: 'address',
            },
            {
              label: '省码',
              prop: 'addrCode',
              width: '70',
            },
          ],
        },
        {
          groupName: 'group2',
          groupLabel: '组织信息',
          groupList: [
            {
              label: '数据来源',
              prop: 'sourceCode',
            },
            {
              label: '是否为关联方',
              prop: 'innerFlag',
            },
            {
              label: '关联码',
              prop: 'innerCode',
            },
            {
              label: '纳税资质',
              prop: 'vatFlag',
            },
            {
              label: 'OU组织编码',
              prop: 'ouCode',
            },
            {
              label: 'OU组织名称',
              prop: 'ouName',
            },
          ],
        },
        {
          groupName: 'group3',
          groupLabel: '联系人信息',
          groupList: [
            {
              label: '联系人姓名',
              prop: 'contactName',
              width: '',
            },
            {
              label: '联系人手机',
              prop: 'contactCellphone',
              width: '180',
            },
            {
              label: '联系人电话',
              prop: 'contactPhone',
              width: '180',
            },
            {
              label: '联系人传真',
              prop: 'contactFax',
              width: '180',
            },
            {
              label: '联系人邮箱',
              prop: 'contactMail',
              width: '180',
            },
          ],
        },
      ],
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
    loginUserId: {
      // 登录用户ID
      type: String,
    },
    ouCode: {
      // OU组织编码（仅在输入省码为ERP大集中的省份时有效）
      type: String,
    },
  },
  computed: {
    clearDisabled() {
      return _.isEmpty(this.condition.viSupNum || this.condition.viSupName);
    },
    submitDisabled() {
      return _.isEmpty(this.esSup);
    },
    selectDataListType() {
      const flag = this.sup.viList[0] && this.sup.viList[0].isERPCentralization ? this.sup.viList[0].isERPCentralization : '';
      if (flag === '0') {
        return this.listDataType0;
      } else if (flag === '1') {
        return this.listDataType1;
      }
      return [];
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
        currentPage,
        pageSize,
        addrCode,
        purchaseType,
        loginUserId,
        ouCode,
      } = this;
      this.fetchSupLoading = true;
      this.$store.dispatch(FETCH_SUP_ACTION, {
        addrCode,
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
        purchaseType,
        loginUserId,
        ouCode,
      }).then((res) => {
        this.sup = res;
        this.fetchSupLoading = false;
      }).finally(() => {
        this.fetchSupLoading = false;
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
