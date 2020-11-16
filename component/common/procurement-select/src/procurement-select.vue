<!-- 搜索帮助（采购项目编码）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="采购项目编码"
                width="1000px">
    <div class="scm-procurement-new-select">
      <scm-dialog-sub-header title="采购项目编码管理">
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
          <!-- <scm-divider type="vertical"></scm-divider>
          <scm-dialog-sub-header-button icon="submit"
                                        :disabled="submitDisabled"
                                        @click="onSubmit"
                                        v-if="multiple">
            提交
          </scm-dialog-sub-header-button> -->
        </template>
      </scm-dialog-sub-header>
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition"
                inline>
        <div>
          <scm-form-item label="项目编码"
                         prop="viProjectID">
            <scm-input v-model="condition.viProjectID"
                       class="procurement-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="项目名称"
                         prop="viProjectName">
            <scm-input v-model="condition.viProjectName"
                       class="procurement-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="集采类型"
                         prop="viPurType"
                         v-if="isShowPurType">
            <scm-select v-model="condition.viPurType"
                        class="procurement-name">
              <scm-option v-for="(item, index) in purList"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
              </scm-option>
            </scm-select>
        </scm-form-item>
        <scm-form-item label="创建日期（起）"
                       prop="createStartDate"
                       v-if="showCreateStartDate">
          <scm-date-picker
                  v-model="condition.createStartDate"
                  :disabled-date-from="condition.createEndDate">
                </scm-date-picker>
        </scm-form-item>
        <scm-form-item label="创建日期（止）"
                       prop="createEndDate"
                       v-if="showCreateEndDate">
          <scm-date-picker
            v-model="condition.createEndDate"
            :disabled-date-to="condition.createStartDate">
          </scm-date-picker>
        </scm-form-item>
        </div>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="procurement.viList"
                 v-loading="fetchProcurementLoading"
                 @current-change="onCurrentRowChange"
                 @selection-change="hangleSelectionChange"
                 ref="multipleTable"
                 max-height="337">
        <scm-table-column type="index"
                          width="70"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="项目编码"
                          prop="prjId"
                          width="140"></scm-table-column>
        <scm-table-column label="项目名称"
                          prop="prjName"></scm-table-column>
        <scm-table-column label="创建人"
                          prop="prjMgr"
                          width="100"></scm-table-column>
        <scm-table-column label="集采类型"
                          prop="purType2.label"
                          width="100"></scm-table-column>
        <scm-table-column label="开支类型"
                          prop="costType.label"
                          width="100"></scm-table-column>
        <scm-table-column label="采购方式"
                          prop="purMethod"
                          width="238"></scm-table-column>
        <scm-table-column label="项目状态"
                          prop="statusPrj"
                          :formatter="statusPrjFormatter"
                          width="100"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="procurement.viTotal"
                      v-show="procurement.viTotal"
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

const FETCH_PROCUREMENT_ACTION = 'mdm/fetchProcurement';

export default {
  name: 'ScmProcurementSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    addrCode: String, // 省码
    status: String, // 0:保存未提交1:审批中2:审批通过,其他:驳回
    statusPrj: String, // 采购项目状态(1:立项未启动2:项目终止3:项目流标4:项目关闭)
    zfbprod: String, // 是否过滤非标产品(1:不过滤;2:过滤),默认“1”
    isShowPurType: { // 采购类型搜索字段显示与隐藏
      type: Boolean,
      default: true,
    },
    purType: { // 默认初始化查询 3：二级集采 ； 4： 省自采-横向部门  ；7：分公司采购
      type: String,
    },
    createBy: {
      // 创建人ID
      type: String,
      default: '',
    },
    showCreateStartDate: { // 是否显示创建开始时间
      type: Boolean,
      default: true,
    },
    showCreateEndDate: { // 是否显示创建结束时间
      type: Boolean,
      default: true,
    },
    purList: { // 下拉选得条件
      type: Array,
      default() {
        return [
          {
            label: '二级集采',
            value: '3',
          },
          {
            label: '省自采-横向部门',
            value: '4',
          },
          {
            label: '分公司采购',
            value: '7',
          },
        ];
      },
    },
  },
  data() {
    return {
      condition: {
        viProjectID: '',
        viProjectName: '',
        viPurType: '',
        createEndDate: '',
        createStartDate: '',
      },
      initCondition: {
        viProjectID: '',
        viProjectName: '',
        viPurType: '',
        createEndDate: '',
        createStartDate: '',
      },
      esProcurement: '',
      currentPage: 1,
      pageSize: 10,
      cloneCondition: {},
      esData: '',
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchProcurementLoading: state =>
        state.loading.actions[FETCH_PROCUREMENT_ACTION],
      procurement: state => state.mdm.procurement,
    }),
    clearDisabled() {
      return _.isEqual(this.condition, this.initCondition);
    },
    submitDisabled() {
      return _.isEmpty(this.esProcurement);
    },
  },
  mounted() {
    if (this.isShowPurType && !_.isEmpty(this.purType)) {
      this.$set(this.condition, 'viPurType', this.purType);
      this.fetchProcurement(this.condition);
    } else {
      this.fetchProcurement();
    }
    // this.initCondition = _.cloneDeep(this.condition);
  },
  methods: {
    // 按输入的搜索条件进行查询
    onSearch() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchProcurement(this.condition);
    },
    statusPrjFormatter(row, column, cellValue) {
      // 1:项目执行中2:项目中止3:项目流标4:项目关闭
      let text = cellValue;
      if (cellValue === '1') {
        text = '项目执行中';
      } else if (cellValue === '2') {
        text = '项目中止';
      } else if (cellValue === '3') {
        text = '项目流标';
      } else if (cellValue === '4') {
        text = '项目关闭';
      }
      return text;
    },
    // 将页面恢复到初始状态
    onClear() {
      Object.assign(this.condition, this.initCondition);
    },
    onPrevious() {
      this.$emit('select', this.esData);
    },
    // 提交搜索条件
    onFormSubmit() {
      this.fetchProcurement(this.condition);
    },
    // 选择一其中条数据
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchProcurement(this.cloneCondition);
    },
    // 选择窗口显示数据的数量
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchProcurement(this.cloneCondition);
    },
    // 表格的当前行发生变化的时候会触发该事件
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    // 选择要提交的数据
    hangleSelectionChange(val) {
      this.esProcurement = val;
    },
    // 提交所勾选的数据
    onSubmit() {
      this.$emit('select', this.esProcurement);
    },
    // 向后台发送数据
    fetchProcurement(params = {}) {
      const {
        currentPage,
        pageSize,
        addrCode,
        status,
        statusPrj,
        zfbprod,
        createBy,
      } = this;
      this.$store.dispatch(FETCH_PROCUREMENT_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        addrCode,
        status,
        statusPrj,
        zfbprod,
        createBy,
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

.scm-procurement-new-select {
    .search-condition {
      .el-form-item {
        width: 220px;
        margin-right: 25px;
      }
    }

    .divider {
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .el-table {
      margin-bottom: 10px;
      th.gutter{
      display: table-cell!important;
      }
    }
  }
</style>
<style  lang="scss" scoped>
  /deep/ .el-dialog__body{
    max-height: none;
  }
.scm-procurement-new-select{
  /deep/ .el-form-item{
    margin-bottom: 11px;
  }
}
</style>
