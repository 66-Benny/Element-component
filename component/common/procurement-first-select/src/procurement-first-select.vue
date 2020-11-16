<!-- 搜索帮助（一采项目编码）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="一采项目编码"
                width="1000px">
    <div class="scm-procurement-select">
      <scm-dialog-sub-header title="一采项目编码管理">
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
                          prop="purType.label"
                          width="100"></scm-table-column>
        <scm-table-column label="合同大类"
                          prop="costType.label"
                          width="100"></scm-table-column>
        <scm-table-column label="采购方式"
                          prop="purMethod"
                          width="238"></scm-table-column>
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

const FETCH_PROCUREMENT_ACTION = 'mdm/fetchProcurementFirst';

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
    isShowPurType: { // 采购类型搜索字段显示与隐藏
      type: Boolean,
      default: false,
    },
    purType: { // 默认初始化查询 一级集采 ； 5： 总部一采项目
      type: String,
    },
    purList: { // 下拉选得条件
      type: Array,
      default() {
        return [
          {
            label: '一级集采',
            value: '1',
          },
          {
            label: '总部一采项目',
            value: '5',
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
      procurement: state => state.mdm.procurementFirst,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viProjectID
        || this.condition.viProjectName
        || this.condition.viPurType);
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
  },
  methods: {
    // 按输入的搜索条件进行查询
    onSearch() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchProcurement(this.condition);
    },
    // 将页面恢复到初始状态
    onClear() {
      this.$refs.conditionForm.resetFields();
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
        currentPage, pageSize, addrCode, status, statusPrj,
      } = this;
      this.$store.dispatch(FETCH_PROCUREMENT_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        addrCode,
        status,
        statusPrj,
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

.scm-procurement-select {
    .search-condition {
      .el-form-item {
        width: 220px;
        margin-bottom: 0px;
        margin-right: 25px;
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
