<!-- 搜索帮助（库存组织） -->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="库存组织查询"
                width="1000px">
    <div class="scm-ouOrganize-select">
      <scm-dialog-sub-header title="库存组织查询">
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
        <scm-form-item label="库存组织名称"
                       prop="viName">
          <scm-input v-model="condition.viName"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="库存组织类型"
                       prop="invTypeList">
          <scm-select v-model="condition.invTypeList"
                      multiple
                      collapse-tags>
            <scm-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </scm-option>
          </scm-select>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="ouOrganize.viList"
                 v-loading="fetchOuOrganizeLoading"
                 highlight-current-row
                 ref="multipleTable"
                 @current-change="onCurrentRowChange"
                 max-height="327">
        <scm-table-column type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="省码"
                          prop="addrCode"
                          width="60"></scm-table-column>
        <scm-table-column label="OU组织编码"
                          prop="orgId"
                          width="90"></scm-table-column>
        <scm-table-column label="OU组织名称"
                          prop="orgName"></scm-table-column>
        <scm-table-column label="库存组织ID"
                          prop="organizationId"
                          width="90"></scm-table-column>
        <scm-table-column label="库存组织名称"
                          prop="organizationName"></scm-table-column>
        <scm-table-column label="库存组织编号"
                          prop="organizationCode"
                          width="100"></scm-table-column>
        <scm-table-column label="库存组织类型"
                          prop="invType"
                          width="100"></scm-table-column>
        <scm-table-column label="库存组织类型描述"
                          prop="invTypeDescription"
                          width="120"></scm-table-column>
        <scm-table-column label="环境名称"
                          prop="environmentName"
                          width="80"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="ouOrganize.viTotal"
                      v-show="ouOrganize.viTotal"
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

const FETCH_OU_ORGANIZE_ACTION = 'mdm/fetchOuOrganize';

export default {
  name: 'ScmOuOrganizeSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      condition: {
        viName: '',
        invTypeList: [],
      },
      options: [],
      invTypeListOptions: [
        {
          label: '业务用品',
          value: 'C',
        },
        {
          label: '备品备件',
          value: 'P',
        },
        {
          label: '杂品',
          value: 'O',
        },
        {
          label: '工程物资',
          value: 'E',
        },
        {
          label: '发运仓',
          value: 'F',
        },
      ],
      esData: '',
      currentPage: 1,
      pageSize: 10,
      cloneCondition: {},
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchOuOrganizeLoading: state =>
        state.loading.actions[FETCH_OU_ORGANIZE_ACTION],
      ouOrganize: state => state.mdm.ouOrganize,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viName);
    },
  },
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    plantCode: String, // 工厂编码
    orgId: { // ou组织编码
      type: String,
      default: '',
    },
    invTypeList: { // 库存组织类型List
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    this.Searchinit();
  },
  watch: {
    plantCode: {
      handler() {
        this.Searchinit();
      },
    },
    invTypeList: {
      handler(newVal) {
        const list = [];
        newVal.forEach((i) => {
          this.invTypeListOptions.forEach((j) => {
            if (i === j.value) {
              list.push(j);
            }
          });
        });
        if (list.length > 0) {
          this.options = list;
        } else {
          this.options = this.invTypeListOptions;
        }
      },
      immediate: true,
    },
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchOuOrganize(this.condition);
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
      this.fetchOuOrganize(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchOuOrganize(this.cloneCondition);
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchOuOrganize(this.cloneCondition);
    },
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    getAllInvTypeList() {
      const list = [];
      this.options.forEach((i) => {
        list.push(i.value);
      });
      return list;
    },
    fetchOuOrganize(params = {}) {
      const param = _.cloneDeep(params);
      const {
        currentPage, pageSize, addrCode, plantCode, orgId,
      } = this;
      if (params && param.invTypeList.length === 0) {
        param.invTypeList = this.getAllInvTypeList();
      }
      this.$store.dispatch(FETCH_OU_ORGANIZE_ACTION, {
        viAddrCode: addrCode,
        viPageNum: currentPage,
        viPageSize: pageSize,
        viPlantCode: plantCode,
        orgId,
        ...param,
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
.scm-ouOrganize-select {
  width: 100%;

  .search-condition {
    .el-form-item {
      margin-bottom: 0;
      width: 220px;
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
