<!-- 搜索帮助（通用产品列表查询）-->
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
        <scm-menu class="opi-menu"
                  mode="vertical"
                  background-color="#ffffff"
                  text-color="#4A4A4A"
                  active-text-color="#FFFFFF"
                  :default-active="activeIndex"
                  collapse
                  @select="handleSelect">
          <scm-submenu index="1">
            <template slot="title">Tree Item </template>
            <scm-menu-item index="1-1">选项2</scm-menu-item>
            <scm-submenu index="1-2">
              <template slot="title">选项</template>
              <scm-menu-item index="1-2-1">选项2</scm-menu-item>
              <scm-menu-item index="1-2-2">选项2</scm-menu-item>
              <scm-menu-item index="1-2-3">选项2</scm-menu-item>
              <scm-menu-item index="1-2-4">选项2</scm-menu-item>
              <scm-submenu index="1-2-5">
                <template slot="title">选项</template>
                <scm-menu-item index="1-2-a">选项2</scm-menu-item>
                <scm-menu-item index="1-2-b">选项2</scm-menu-item>
                <scm-menu-item index="1-2-c">选项2</scm-menu-item>
                <scm-menu-item index="1-2-d">选项2</scm-menu-item>
              </scm-submenu>
            </scm-submenu>
          </scm-submenu>
          <scm-submenu index="2">
            <template slot="title">移动通信</template>
            <scm-menu-item index="2-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="3">
            <template slot="title">网络设备通信</template>
            <scm-menu-item index="3-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="4">
            <template slot="title">网络配套</template>
            <scm-menu-item index="4-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="5">
            <template slot="title">传输网设备</template>
            <scm-menu-item index="5-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="6">
            <template slot="title">IT硬件产品</template>
            <scm-menu-item index="6-1">服务器</scm-menu-item>
            <scm-submenu index="6-2">
              <template slot="title">客户端（PC）</template>
              <scm-menu-item index="6-2-1">台式计算机</scm-menu-item>
              <scm-menu-item index="6-2-2">笔记本计算机</scm-menu-item>
              <scm-menu-item index="6-2-3">瘦客户机</scm-menu-item>
              <scm-submenu index="6-2-4">
                <template slot="title">平板电脑</template>
                <scm-menu-item index="6-2-4-1">平板电脑</scm-menu-item>
                <scm-menu-item index="6-2-4-2">平板电脑（非标产）</scm-menu-item>
                <scm-menu-item index="6-2-4-3">平板电脑及配件</scm-menu-item>
                <scm-menu-item index="6-2-4-4">数字式掌上设备</scm-menu-item>
              </scm-submenu>
              <scm-menu-item index="6-2-5">电脑配件及外设</scm-menu-item>
              <scm-menu-item index="6-2-6">电脑配套产品及耗材</scm-menu-item>
            </scm-submenu>
            <scm-menu-item index="6-3">存储设备</scm-menu-item>
            <scm-menu-item index="6-4">IT网络设备</scm-menu-item>
            <scm-menu-item index="6-5">安全产品</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="7">
            <template slot="title">软件产品</template>
            <scm-menu-item index="7-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="8">
            <template slot="title">线缆及配件</template>
            <scm-menu-item index="8-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="9">
            <template slot="title">电源及动力环境设备</template>
            <scm-menu-item index="9-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="10">
            <template slot="title">仪器仪表及工具</template>
            <scm-menu-item index="10-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="11">
            <template slot="title">服务类</template>
            <scm-menu-item index="11-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="12">
            <template slot="title">业务产品</template>
            <scm-menu-item index="12-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="13">
            <template slot="title">办公及劳保用品</template>
            <scm-menu-item index="13-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="14">
            <template slot="title">交通运输及仓储物流设备</template>
            <scm-menu-item index="14-1">选项2</scm-menu-item>
          </scm-submenu>
          <scm-submenu index="15">
            <template slot="title">土建设备及产品</template>
            <scm-menu-item index="15-1">选项2</scm-menu-item>
          </scm-submenu>
        </scm-menu>

      </div>
      <div class="scm-opi-select">
        <scm-form :model="condition"
                  @submit.native="onFormSubmit"
                  ref="conditionForm"
                  label-position="top"
                  class="search-condition-opi">
          <scm-form-item label="产品编码"
                         prop="productNum">
            <scm-input v-model="condition.productNum"
                       class="opi-dim-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="产品名称"
                         prop="productName">
            <scm-input v-model="condition.productName"
                       class="opi-dim-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="采购年份"
                         prop="poYear">
            <scm-input v-model="condition.poYear"
                       class="opi-dim-name"></scm-input>
          </scm-form-item>
          <scm-form-item label="采购类型"
                         prop="procurementType">
            <scm-select v-model="condition.procurementType"
                        class="opi-dim-name">
              <scm-option v-for="item of sumYear"
                          :key="item.sumWord"
                          :label="item.checkType"
                          :value="item.sumWord">
              </scm-option>
            </scm-select>
          </scm-form-item>
        </scm-form>
        <scm-divider dashed
                     class="divider"></scm-divider>
        <!-- 全选隐藏与显示 -->
        <scm-table ref="multipleTable"
                   :data="viList"
                   v-loading="false"
                   highlight-current-row
                   @selection-change="handleSelectionChange"
                   @current-change="onCurrentRowChange"
                   max-height="340"
                   style="margin-bottom:0px">

          <scm-table-column type="index"
                            width="54"
                            align="center"
                            :index='getTableIndex'></scm-table-column>
          <scm-table-column label="项目ID"
                            prop="prjId"
                            width="94"
                            align="center"></scm-table-column>
          <scm-table-column label="产品全ID"
                            prop="prodFullId"
                            width="94"
                            align="center"></scm-table-column>
          <!-- <scm-table-column label="产品ID"
                            prop="proId"
                            width="82"
                            align="center"></scm-table-column> -->
          <scm-table-column label="产品名称"
                            prop="prodName"
                            width="89"
                            align="center"></scm-table-column>
          <scm-table-column label="计量单位"
                            prop="unit"
                            width="80"
                            align="center"></scm-table-column>
          <scm-table-column label="六位小类"
                            prop="zkey"
                            width="80"
                            align="center"></scm-table-column>
          <scm-table-column label="小类"
                            prop="zkey3"
                            width="80"
                            align="center"></scm-table-column>
          <scm-table-column label="小类描述"
                            prop="zkey3Text"
                            width="150"
                            align="center"></scm-table-column>
        </scm-table>
      </div>
    </div>
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
// import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

// const FETCH_OPI_ACTION = 'mdm/fetchOpi';

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
      viList: [
        {
          prjId: '2323',
          prodFullId: '1122',
          prodId: '0011',
          prodName: '小品类',
          unit: '台',
          zkey: '小商品',
          zkey3: '',
          zkey3Text: '',
        },
        {
          prjId: '23',
          prodFullId: '112',
          prodId: '001',
          prodName: '小品类',
          unit: '台',
          zkey: '小商品',
          zkey3: '小类',
          zkey3Text: '',
        },
      ],
      condition: {
        productNum: '',
        productName: '',
        procurementType: '',
      },
      currentPage: 1,
      pageSize: 10,
      multipleSelection: [],
      sumYear: [
        { sumWord: '选项1', checkType: '一级采集产品' },
        { sumWord: '选项2', checkType: '二级采集产品' },
        { sumWord: '选项3', checkType: '非采集产品' },
      ],
      activeIndex: '1',
    };
  },
  computed: {
    // ...StoreGlobalAPI.mapState({
    //   false: state => state.loading.actions[FETCH_OPI_ACTION],
    //   opi: state => state.mdm.opi,
    // }),
    clearDisabled() {
      return _.isEmpty(this.condition.smallName ||
          this.condition.proName ||
          this.condition.proType);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    // this.fetchOpi();
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(keyPath);
    },
    onSearch() {
      // this.fetchOpi(this.condition);
    },
    onClear() {
      this.$refs.conditionForm.resetFields();
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
    },
    onFormSubmit() {
      // this.fetchOpi(this.condition);
    },
    onCurrentPageChange(val) {
      this.currentPage = val;
      // this.fetchOpi();
    },
    onSizeChange(val) {
      this.pageSize = val;
      // this.fetchOpi();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    // fetchOpi(params = {}) {
    //   const { currentPage, pageSize } = this;
    //   this.$store.dispatch(FETCH_OPI_ACTION, {
    //     viPageNum: currentPage,
    //     viPageSize: pageSize,
    //     ...params,
    //   });
    // },
  },
};
</script>
<style lang="scss">
.el-dialog__sub-header {
  margin: 0px !important;
  text-align: left !important;
}
.scm-opi {
  display: flex;
  height: 480px;
  .scm-opi-menu {
    width: 246px;
    .opi-menu {
      width: 246px;
    }
    .el-submenu__title {
      height: 30px;
      width: 246px;
      line-height: 30px;
      border-bottom: 1px dashed #cccccc;
      padding: 0px !important;
      margin: 0px 8px;
      text-align: left;
    }
  }
  .scm-opi-select {
    padding: 5px 15px;
    background: white;
    .search-condition-opi {
      padding-right: 50px;
      .el-input__inner {
        width: 216px;
        height: 30px;
      }
      .el-form-item--small.el-form-item {
        text-align: left !important;
        float: left;
        margin-right:15px;
        .bg-dim-name {
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
