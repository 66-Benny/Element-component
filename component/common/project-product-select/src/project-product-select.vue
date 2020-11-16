<!-- 搜索帮助（OU信息） -->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="选择项目信息"
                width="1000px">
    <div class="scm-ou-select">
      <scm-dialog-sub-header title="项目信息操作管理">
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
        </template>
      </scm-dialog-sub-header>
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition">
        <scm-form-item label="项目编码"
                       prop="viErpMapName">
          <scm-input v-model="condition.viErpMapName"
                     class="erp-map-name"></scm-input>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="viList"
                 v-loading="false"
                 highlight-current-row
                 @current-change="onCurrentRowChange"
                 max-height="337">
        <scm-table-column type="index"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="项目基本信息"
                          prop="projectInformation"
                          width="130"></scm-table-column>
        <scm-table-column label="产品类型清单"
                          prop="projectList"
                          width="162"></scm-table-column>
        <scm-table-column label="标准实现计划"
                          prop="plan"></scm-table-column>
        <scm-table-column label="项目编码"
                          prop="projectCode"
                          width="261"></scm-table-column>
        <scm-table-column label="项目状态"
                          prop="projectState"></scm-table-column>
        <scm-table-column label="省码"
                          prop="addrCode"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="viTotal"
                      :current-page="currentPage"
                      @size-change="onSizeChange"
                      @current-change="onCurrentPageChange">
      </scm-pagination>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
// import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

// const FETCH_OU_ACTION = 'mdm/fetchOu';

export default {
  name: 'ScmProjectProductSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      condition: {
        viErpMapName: '',
      },
      currentPage: 1,
      pageSize: 10,
      viList: [
        {
          projectInformation: 'cmcc',
          projectList: '倒萨倒萨倒萨',
          plan: 'dsad',
          projectCode: '12860',
          projectState: '进行',
          addrCode: 'HQ',
        },
        {
          projectInformation: 'cmcc',
          projectList: '倒萨倒萨倒萨',
          plan: 'dsad',
          projectCode: '12860',
          projectState: '进行',
          addrCode: 'HQ',
        },
        {
          projectInformation: 'cmcc',
          projectList: '倒萨倒萨倒萨',
          plan: 'dsad',
          projectCode: '12860',
          projectState: '进行',
          addrCode: 'HQ',
        },
        {
          projectInformation: 'cmcc',
          projectList: '倒萨倒萨倒萨',
          plan: 'dsad',
          projectCode: '12860',
          projectState: '进行',
          addrCode: 'HQ',
        },
        {
          projectInformation: 'cmcc',
          projectList: '倒萨倒萨倒萨',
          plan: 'dsad',
          projectCode: '12860',
          projectState: '进行',
          addrCode: 'HQ',
        },
      ],
    };
  },
  computed: {
    // ...StoreGlobalAPI.mapState({
    //   fetchOuLoading: state => state.loading.actions[FETCH_OU_ACTION],
    //   ou: state => state.mdm.ou,
    // }),
    clearDisabled() {
      return _.isEmpty(this.condition.viErpMapName);
    },
  },
  mounted() {
    // this.fetchOu();
  },
  methods: {
    onSearch() {
      this.fetchOu(this.condition);
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onFormSubmit() {
      // this.fetchOu(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      // this.fetchOu();
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.fetchOu();
    },
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
      }
    },
    // 获取table序号
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
    // fetchOu(params = {}) {
    //   const { currentPage, pageSize } = this;
    //   this.$store.dispatch(FETCH_OU_ACTION, {
    //     viPageNum: currentPage,
    //     viPageSize: pageSize,
    //     ...params,
    //   });
    // },
  },
};
</script>
<style lang="scss">
.scm-ou-select {
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
