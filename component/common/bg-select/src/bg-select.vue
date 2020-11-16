<!-- 搜索帮助（预算维度）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="预算维度"
                width="1000px">
    <div class="scm-bg-select">
      <scm-dialog-sub-header title="预算维度查询管理">
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
        </template>
      </scm-dialog-sub-header>

      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition"
                inline>
        <scm-form-item label="预算项目编号"
                       prop="viBgLineNum">
          <scm-input v-model="condition.viBgLineNum"
                     class="bg-dim-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="预算项目名称"
                       prop="viBgItemName">
          <scm-input v-model="condition.viBgItemName"
                     class="bg-dim-name"></scm-input>
        </scm-form-item>
         <scm-form-item label="预算责任部门"
                       prop="viBgResDep">
          <scm-input v-model="condition.viBgResDep"
                     class="bg-dim-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="公司名称"
                       prop="viCorName">
          <scm-input v-model="condition.viCorName"
                     class="bg-dim-name"></scm-input>
        </scm-form-item>
        <!-- 组合单选-->
        <!-- <scm-form-item label="组合方式"
                       prop="viCorMode">
          <scm-select v-model="condition.viCorMode"
                      placeholder="A.B.C.D.E..G..."
                      class="bg-dim-name">
            <scm-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </scm-option>
          </scm-select>
        </scm-form-item> -->

        <scm-form-item label="业务活动编码"
                       prop="viBnAct">
          <scm-input v-model="condition.viBnAct"
                     class="bg-dim-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="业务活动名称"
                       prop="viBnActName">
          <scm-input v-model="condition.viBnActName"
                     class="bg-dim-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="预算信息年度"
                       prop="viAnnual">
          <scm-date-picker v-model="condition.viAnnual"
                           type="year">
          </scm-date-picker>
        </scm-form-item>
        <scm-form-item label="预算项目年度"
                       prop="projectYear">
          <scm-date-picker v-model="condition.viProjectYear"
                           type="year">
          </scm-date-picker>
        </scm-form-item>
        <scm-form-item label="预算开始时间"
                       prop="startDate">
          <scm-date-picker v-model="condition.startDate"
                           :disabled-date-from="condition.endDate"
                           type="date">
          </scm-date-picker>
        </scm-form-item>
        <scm-form-item label="预算结束时间"
                       prop="endDate">
          <scm-date-picker v-model="condition.endDate"
                           :disabled-date-to="condition.startDate"
                           type="date">
          </scm-date-picker>
        </scm-form-item>
      </scm-form>

      <scm-divider dashed
                   class="divider"></scm-divider>
      <!-- 切换tab -->
      <scm-table ref="multipleTable"
                 :data="bg.viList"
                 v-loading="fetchBgLoading"
                 :pagination="false"
                 highlight-current-row
                 style="width:100%"
                 max-height="186"
                 @current-change="onCurrentRowChange"
                 :current-group-name="currentGroupName1">
        <scm-table-column-group name="group1"
                                label="预算信息1">
          <scm-table-column type="index"
                            width="47"
                            :index='getTableIndex'></scm-table-column>
          <scm-table-column label="预算项目编号"
                            prop="projectNum"
                            width="95"></scm-table-column>
          <scm-table-column label="预算项目名称"
                            prop="projectName"
                            width="95"></scm-table-column>
          <scm-table-column label="预算项目年度"
                            prop="projectYear"
                            width="95"></scm-table-column>
          <scm-table-column label="预算开始时间"
                            prop="startDate"
                            width="95"></scm-table-column>
          <scm-table-column label="预算结束时间"
                            prop="endDate"
                            width="95"></scm-table-column>
          <scm-table-column label="预算可用金额"
                            prop="availableAmount"
                            width="95"></scm-table-column>
          <scm-table-column label="投资主体"
                            prop="environmentName"
                            width="70"></scm-table-column>
          <scm-table-column label="业务活动编码"
                            prop="activityCode"
                            width="95"></scm-table-column>
          <scm-table-column label="业务活动名称"
                            width="95"
                            prop="reference13"></scm-table-column>
          <scm-table-column label="预算责任部门"
                            prop="reference12"
                            width="95"></scm-table-column>
        </scm-table-column-group>
        <scm-table-column-group name="group2"
                                label="预算信息2">
          <scm-table-column type="index"
                            width="47"
                            :index='getTableIndex'></scm-table-column>
          <scm-table-column label="预算项目编号"
                            prop="projectNum"
                            width="95"></scm-table-column>
          <scm-table-column label="预算项目名称"
                            prop="projectName"
                            width="95"></scm-table-column>
          <scm-table-column label="科目名称"
                            prop="reference14"
                            width=""></scm-table-column>
          <scm-table-column label="品牌名称"
                            prop="reference15"
                            width="100"></scm-table-column>
          <scm-table-column label="预算组合名称"
                            prop="companyName"></scm-table-column>
          <scm-table-column label="预算组合编码"
                            prop="companyCode"
                            width=""></scm-table-column>
          <scm-table-column label="预算信息年度"
                            prop="year"
                            width="95"></scm-table-column>
                            <!-- 后端无准确返回字段，待确认是否删除 （税码，是否可抵扣） -->
        </scm-table-column-group>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      v-show="bg.viTotal"
                      :page-size="pageSize"
                      :total="bg.viTotal?bg.viTotal:0"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
import moment from 'moment';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_BG_ACTION = 'mdm/fetchBg';

export default {
  name: 'ScmBgSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      condition: {
        viBgLineNum: '',
        viBgItemName: '',
        viBnActName: '',
        viBnAct: '',
        viBgResDep: '',
        viCorName: '',
        viAnnual: '',
        startDate: '',
        endDate: '',
        viProjectYear: '',
      },
      currentPage: 1,
      pageSize: 10,
      options: [
        // { value: '1', label: '…D…' }, // 公司
        { value: '2', label: 'A.B.C.D.E..G...' }, // 部门
        // { value: '3', label: 'C' }, // 项目
        // { value: '4', label: 'D' }, // 业务
        // { value: '5', label: 'E' }, // 科目
        // { value: '6', label: 'F' }, // 品牌
      ],
      currentGroupName1: 'group1',
      esBgdata: '',
      cloneCondition: {},
    };
  },
  props: {
    ziskj: { // 是否为框架合同
      type: Boolean,
    },
    budgetGroup: { // 组合查询
      type: String,
    },
    budgetAccountLikeParam: { // 预算科目编码模糊查询条件
      type: String,
    },
    zcoid: { // 合同系统合同号
      type: String,
    },
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    // CorName: { // 所属单位名称
    //   type: String,
    //   default: '天津',
    // },
    plantCode: { // 工厂编码
      type: String,
    },
    orderType: { // 是否为零购订单( 1:零购订单,2:非零购订单)
      type: String,
    },
    allWord: { // 初始化 预算责任部门
      type: Object,
      // default() {
      //   viBgResDep: '333', // 预算责任部门
      // },
    },
  },
  watch: {
    innerVisible(newVal) {
      if (newVal && this.openRefresh) {
        this.currentPage = 1;
        Object.assign(this.cloneCondition, this.condition);
        this.fetchBg(this.cloneCondition);
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
        }
      }
    },
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchBgLoading: state => state.loading.actions[FETCH_BG_ACTION],
      bg: state => state.mdm.bg,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viBgLineNum ||
          this.condition.viBgItemName ||
          this.condition.viBnActName ||
          this.condition.viBnAct ||
          this.condition.viBgResDep ||
          this.condition.viCorName ||
          this.condition.viAnnual ||
          this.condition.startDate ||
          this.condition.viProjectYear ||
          this.condition.endDate);
    },
  },
  mounted() {
    this.condition.viAnnual = new Date().getFullYear().toString();
    // Object.assign(this.cloneCondition, this.condition);
    if (this.allWord) {
      const member = this.allWord;
      this.$set(this.condition, 'viBgResDep', member.viBgResDep);
      this.$set(this.condition, 'viAnnual', moment().format('YYYY')); // 有效期在year的期限内
    }
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchBg(this.condition);
    },
    onSearch() {
      this.Searchinit();
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
      this.condition.viBgResDep = '';
      this.condition.viAnnual = '';
      this.condition.viProjectYear = '';
    },
    onPrevious() {
      this.$emit('select', this.esBgdata);
    },
    onFormSubmit() {
      this.Searchinit();
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchBg(this.cloneCondition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchBg(this.cloneCondition);
    },
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    fetchBg(params = {}) {
      const {
        currentPage,
        pageSize,
        addrCode,
        zcoid,
        budgetGroup,
        budgetAccountLikeParam,
        plantCode,
        orderType,
        ziskj,
      } = this;
      this.$store.dispatch(FETCH_BG_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
        zcoid,
        budgetGroup,
        budgetAccountLikeParam,
        plantCode,
        orderType,
        ziskj,
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
<style lang="scss">
.scm-bg-select {
  background: white;
  .search-condition {
    .el-form-item {
      width: 216px;
      margin: 0px 20px 10px 0px;
      .bg-dim-name {
        width: 100%;
      }
    }
  }

  .divider {
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .el-radio-button__inner {
    width: 73px;
    height: 30px;
  }

  .el-table {
    margin-bottom: 10px;
  }

  .switch-btn {
    margin-right: 15px;
    float: right;
  }
}
</style>
