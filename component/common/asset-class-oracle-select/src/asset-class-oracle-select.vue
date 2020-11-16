<template>
  <basic-dialog :visible.sync="innerVisible"
                title="选择资产类别"
                width="1000px">
    <scm-dialog-sub-header title="资产类别信息查询管理"
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
                @submit.native.prevent="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                v-loading="initLoading"
                inline
                class="search-condition">
        <!-- <scm-form-item label="资产类别"
                       prop="assetClass">
          <scm-cascader ref="cascader"
                        :props="propsDynamic"
                        :clearable="true"
                        :showAllLevels="false"
                        v-model="condition.assetClass">
          </scm-cascader>
        </scm-form-item> -->
        <scm-form-item v-for="(item, index) in searchList"
                       :key="index"
                       :label="item.name"
                       :prop="item.prop">
          <scm-select v-model="item.model"
                      @change="searchChange(index)"
                      :disabled="item.disabled">
            <scm-option
              v-for="optionItem in item.options"
              :key="optionItem.assetId"
              :label="optionItem.assetName"
              :value="optionItem.assetId">
            </scm-option>
          </scm-select>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed></scm-divider>
      <scm-table ref="multipleTable"
                 :data="assetClassList.viList"
                 v-loading="fetchDataLoading"
                 highlight-current-row
                 @selection-change="handleSelectionChange"
                 @current-change="onCurrentRowChange"
                 max-height="340"
                 class="search-result-table"
                 row-key="productNum">
        <scm-table-column type="selection"
                          v-if="multiple"
                          reserve-selection
                          width="40"></scm-table-column>
        <scm-table-column type="index"
                          width="54"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="资产类型"
                          prop="assetId"
                          width="250"></scm-table-column>
        <scm-table-column label="资产名称"
                          prop="assetName"></scm-table-column>
      </scm-table>
      <scm-pagination v-show="assetClassList.viTotal"
                      :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="assetClassList.viTotal?assetClassList.viTotal:0"
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

const FETCH_DATA_ACTION = 'mdm/fetchAssetClassList';
const FETCH_TREE_ACTION = 'mdm/fetchAssetClassTree';

export default {
  name: 'ScmAssetClassSelect',
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
    initSearchData: { // 初始化传入的搜索条件
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    const self = this;
    return {
      condition: {
        assetSearchIds: [],
      },
      cloneCondition: {},
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
      initLoading: false,
      searchList: [
        {
          name: '业务领域',
          model: '',
          prop: 'model1',
          options: [],
          disabled: true,
        },
        {
          name: '类',
          model: '',
          prop: 'model2',
          disabled: true,
          options: [],
        },
        {
          name: '项',
          model: '',
          prop: 'model3',
          disabled: true,
          options: [],
        },
        {
          name: '目',
          model: '',
          prop: 'model4',
          disabled: true,
          options: [],
        },
        {
          name: '节',
          model: '',
          prop: 'model5',
          disabled: true,
          options: [],
        },
        {
          name: '名',
          model: '',
          prop: 'model6',
          disabled: true,
          options: [],
        },
      ],
      propsDynamic: {
        lazy: true,
        checkStrictly: true,
        value: 'productNum',
        label: 'productName',
        children: 'list',
        lazyLoad(node, resolve) {
          const v = node;
          if (!v.children || v.children.length <= 0) {
            self.fetchProductTree({
              productNum: node.path,
            }).then(() => {
              if (self.level) {
                self.assetClassTree.viList.map((item) => {
                  const I = item;
                  if (v.level > self.level - 1) {
                    I.disabled = true;
                  }
                  if (self.isHideGreaterLevel && v.level + 1 >= self.level) {
                    I.leaf = true;
                  }
                  return I;
                });
              }
              resolve(self.assetClassTree.viList);
            });
          } else {
            resolve();
          }
        },
      },
    };
  },
  watch: {
    innerVisible(newVal) {
      if (newVal && this.openRefresh) {
        if (!this.initLoading) {
          this.searchInit();
        }
      } else if (!newVal) {
        Object.assign(this.condition, this.cloneCondition);
      }
    },
    initSearchData() {
      this.searchChange(-1, true);
    },
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchDataLoading: state => state.loading.actions[FETCH_DATA_ACTION],
      assetClassList: state => state.mdm.assetClassList,
      assetClassTree: state => state.mdm.assetClassTree,
    }),
    clearDisabled() {
      return _.isEmpty(this.searchList[0].model);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.searchChange(-1, true);
  },
  methods: {
    fetchData(params = {}) {
      const {
        pageSize,
        currentPage,
      } = this;
      this.$store.dispatch(FETCH_DATA_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        addrCode: this.addrCode,
        ...params,
      });
    },
    getTableIndex(index) {
      return ((this.currentPage - 1) * this.pageSize) + index + 1;
    },
    searchInit() {
      this.condition.assetSearchIds = [];
      for (let i = 0; i < this.searchList.length; i += 1) {
        const item = this.searchList[i];
        if (item.model && item.model !== '') {
          this.condition.assetSearchIds.push(item.model);
        }
      }
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchData(this.cloneCondition);
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    fetchProductTree(params = {}) {
      return this.$store.dispatch(FETCH_TREE_ACTION, {
        addrCode: this.addrCode,
        ...params,
      });
    },
    searchChange(index, isInit) {
      if (index < this.searchList.length - 1) {
        this.initLoading = isInit;
        const path = [];
        if (index >= 0) {
          for (let i = 0; i <= index; i += 1) {
            const item = this.searchList[i];
            path.push(item.model);
          }
        }
        this.searchList[index + 1].disabled = false;
        this.fetchProductTree({
          assetSearchIds: path,
        }).then(() => {
          this.searchList[index + 1].options = this.assetClassTree.viList;
          this.searchList[index + 1].model = '';
          if (this.initSearchData.length > index + 1 && isInit) {
            this.assetClassTree.viList.forEach((item) => {
              if (item.assetId === this.initSearchData[index + 1]) {
                this.searchList[index + 1].model = this.initSearchData[index + 1];
              }
            });
          }
          this.searchList.map((itemList, itemIndex) => {
            const iList = itemList;
            if (itemIndex > index + 1) {
              iList.model = '';
              iList.options = [];
              iList.disabled = true;
            }
            return iList;
          });
          if (isInit && this.searchList[index + 1].model !== '') {
            this.searchChange(index + 1, isInit);
          } else if (isInit) {
            this.initLoading = false;
            this.searchInit();
          }
        });
      }
    },
    onSearch() {
      this.searchInit();
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
      for (let i = 0; i < this.searchList.length; i += 1) {
        const item = this.searchList[i];
        item.model = '';
        if (i !== 0) {
          item.options = [];
          item.disabled = true;
        }
      }
    },
    onPrevious() {
      this.$emit('select', '');
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
      this.$refs.multipleTable.clearSelection();
    },
    onFormSubmit() {
      this.searchInit();
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
      this.fetchData(this.cloneCondition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchData(this.cloneCondition);
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
</style>
