<template class="tag-select">
  <basic-dialog :visible.sync="innerVisible"
                title="选择特定角色"
                width="1080px">
    <scm-dialog-sub-header title="特定角色查询管理"
                           class="bank-common-select-dialog__header">
      <template slot="action">
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
    <div class="container-wrapper">
      <div v-for="(item,index) in userByFixedRoles" :key="item.name">
        <multiple-tags v-model="item.model"
                       :title="item.typeName"
                       :optionsList="item.dataList"
                       :props="multipleTagsProps"></multiple-tags>
        <scm-divider dashed class="divider" v-if="index < userByFixedRoles.length-1"></scm-divider>
      </div>
    </div>

  </basic-dialog>
</template>

<script>
// import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import multipleTags from '@/component/common/multipleTags';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const FETCH_DATA_ACTION = 'mdm/fetchUserByFixedRoles';

export default {
  name: 'ScmBankSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
    multipleTags,
  },
  props: {
  },
  watch: {
    innerVisible: {
      handler(newVal) {
        if (!newVal && this.openRefresh) {
          this.onClear();
        }
      },
    },
  },
  data() {
    return {
      multipleTagsProps: {
        label: 'displayName',
        value: 'userId',
      },
      selectData: [],
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchDataLoading: state => state.loading.actions[FETCH_DATA_ACTION],
      userByFixedRoles: state => state.mdm.userByFixedRoles.viList,
    }),
    clearDisabled() {
      return this.mergeSelectData().length === 0;
    },
    submitDisabled() {
      return this.mergeSelectData().length === 0;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$store.dispatch(FETCH_DATA_ACTION);
    },
    onClear() {
      this.userByFixedRoles.map((item) => {
        const i = item;
        i.model = [];
        return i;
      });
      return false;
    },
    onPrevious() {
      this.$emit('clearSelect', []);
    },
    onSubmit() {
      this.$emit('select', this.getDetailList());
    },
    mergeSelectData() {
      let selectArray = [];
      this.userByFixedRoles.map((item) => {
        if (item.model) {
          selectArray = [...item.model, ...selectArray];
        }
        return item;
      });
      this.selectData = selectArray;
      return selectArray;
    },
    getDetailList() {
      const detailList = [];
      this.userByFixedRoles.map((itemData) => {
        const iData = itemData;
        iData.dataList.map((itemDataList) => {
          const iDataList = itemDataList;
          iData.model.map((itemModel) => {
            const iModel = itemModel;
            if (iModel === iDataList.userId) {
              detailList.push(iDataList);
            }
            return iModel;
          });
          return iDataList;
        });
        return iData;
      });
      return detailList;
    },
  },
};
</script>

<style lang="scss">
.el-dialog__body{
    max-height: 610px;
  }
  .container-wrapper{
    .divider{
      margin: 5px 0;
    }
  }
</style>


<style lang="scss" scoped>
</style>
