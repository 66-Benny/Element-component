<!-- 搜索帮助（批量更新）-->
<!-- props属性（输入）-->
<!--
  // common prop 组件公共prop属性,
  // 是否显示对话框，默认为 `false`
  visible: Boolean,
  // 在Dialog打开时是否自动根据默认查询条件进行查询操作，默认为 `false`
  autoSearch: Boolean,
  // 详情请查看component/common/basic-dialog/src/basic-dialog-mixin.js的customize属性
  customize: Object,
  // business prop 组件独有prop属性
          table表格：
                  data ：array，显示的数据,
                  highlight-current-row: boolean,是否要高亮当前行
                  type :string,对应列的类型。如果设置了 selection 则显示多选框；
                        如果设置了 index 则显示该行的索引;如果设置了 expand 则显示为一个可展开的按钮
                  prop :string,对应列内容的字段名，也可以使用 property 属性
                  current-change:当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，
                                  请打开表格的 highlight-current-row 属性
          input框：
                  type string,类型,
                  suffix-icon:string,输入框尾部图标,
                  readonly: boolean,原生属性，是否只读,
          button按钮：
                  type：string,类型,
                  icon: string,图标类名,
          Pagination分页:
                  page-size:number 每页显示条目个数，支持 .sync 修饰符,
                  total:number 总条目数,
                  current-page:number 当前页数，支持 .sync 修饰符,
          radio单选按钮：
                  label：string/number，Radio 的 value
-->
<!-- event事件（输出） -->
<!--
  /*
   * obj 选择的数据，数据对象内的属性请参考本文件134 ~ 172行
   */
   /*
    *onCurrentRowChange(val):点击表格行的时候会获取当前行的值，val 返回的是一个对象，需要的值都在这个对象里
    */
  select(obj) obj：input框里的value值
  onCurrentPageChange(val):currentPage 改变时会触发 val:当前页，
  onSizeChange(val)：pageSize 改变时会触发 val:每页条数,
  onClear()：清空搜索框里的value值，
  onFormSubmit():提交表单，
  fetchToc(params);将前台数据发送到服务器，
  clearDisabled()：监听input框里的value值，返回 Boolean
}
-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="批量更新"
                width="1000px">
    <div class="scm-update-select">
      <scm-dialog-sub-header title="批量更新操作管理">
        <template slot="action">
          <scm-dialog-sub-header-button icon="submit"
                                        @click="onSearch">
            全部更新
          </scm-dialog-sub-header-button>
          <scm-divider type="vertical"></scm-divider>
          <scm-dialog-sub-header-button icon="clear"
                                        :disabled="clearDisabled"
                                        @click="onClear">
            全部清空
          </scm-dialog-sub-header-button>
        </template>
      </scm-dialog-sub-header>
      <scm-form :model="condition"
                @submit.native="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition">
        <scm-form-item label="项目编号"
                       prop="viProjectCode">
          <scm-input v-model="condition.viProjectCode"
                     placeholder="请选择"
                     suffix-icon="search"
                     class="update-name"></scm-input>
          <div class="input-down"><span>更新</span>
            <scm-divider type="vertical"></scm-divider><span>清空</span>
          </div>
        </scm-form-item>
        <scm-form-item label="产品编码"
                       prop="viProductCode">
          <scm-input v-model="condition.viProductCode"
                     placeholder="请选择"
                     suffix-icon="search"
                     class="update-name"></scm-input>
          <div class="input-down"><span>更新</span>
            <scm-divider type="vertical"></scm-divider><span>清空</span>
          </div>
        </scm-form-item>
        <scm-form-item label="要求货到日期"
                       prop="viDataValue">
          <scm-date-picker v-model="condition.viDataValue"
                           type="date"
                           :editable="false"
                           placeholder="请选择"
                           class="update-name"></scm-date-picker>
          <div class="input-down"><span>更新</span>
            <scm-divider type="vertical"></scm-divider><span>清空</span>
          </div>
        </scm-form-item>
        <scm-form-item label="税码"
                       prop="viSelectValue">
          <scm-select v-model="condition.viSelectValue"
                      placeholder="请选择"
                      class="update-name">
            <scm-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></scm-option>
          </scm-select>
          <div class="input-down">
            <span>更新</span>
            <scm-divider type="vertical"></scm-divider><span>清空</span>
          </div>
        </scm-form-item>
        <scm-form-item label="所属单位"
                       prop="viCompany">
          <scm-input v-model="condition.viCompany"
                     placeholder="请选择"
                     suffix-icon="search"
                     class="update-name"></scm-input>
          <div class="input-down"><span>更新</span>
            <scm-divider type="vertical"></scm-divider><span>清空</span>
          </div>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="update.viList"
                 v-loading="fetchUpdateLoading"
                 highlight-current-row
                 ref="multipleTable"
                 @current-change="onCurrentRowChange"
                 max-height="223">
        <scm-table-column label="行号"
                          prop="lineID"
                          width="55"
                          align="center"></scm-table-column>
        <scm-table-column label="产品编码"
                          prop="productCode"
                          width="90"
                          align="center"></scm-table-column>
        <scm-table-column label="产品描述"
                          prop="describe"
                          width="102"
                          align="center"></scm-table-column>
        <scm-table-column label="项目编号"
                          prop="serial"
                          width="92"
                          align="center"></scm-table-column>
        <scm-table-column label="项目名称"
                          prop="projectName"
                          width="148"
                          align="center"></scm-table-column>
        <scm-table-column label="要求到货日期"
                          prop="dateTimes"
                          width="98"
                          align="center"></scm-table-column>
        <scm-table-column label="所属单位"
                          prop="company"
                          width="94"
                          align="center"></scm-table-column>
        <scm-table-column label="所属单位名称"
                          prop="companyName"
                          width="167"
                          align="center"></scm-table-column>
        <scm-table-column label="税码"
                          prop="taxCode"
                          width="107"
                          align="center"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="update.viTotal"
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

const FETCH_UPDATE_ACTION = 'mdm/fetchUpdate';

export default {
  name: 'ScmUpdateSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      condition: {
        viProjectCode: '',
        viProductCode: '',
        viDataValue: '',
        viSelectValue: '',
        viCompany: '',
      },
      options: [
        {
          value: '选项1',
          label: 'BHG00987',
        },
      ],
      selectValue: '',
      currentPage: 1,
      pageSize: 10,
      dataValue: '',
      checkAll: false,
      isIndeterminate: false,
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchUpdateLoading: state => state.loading.actions[FETCH_UPDATE_ACTION],
      update: state => state.mdm.update,
    }),
    clearDisabled() {
      return _.isEmpty(this.condition.viProjectCode ||
        this.condition.viProductCode ||
        this.condition.viSelectValue ||
        this.condition.viCompany ||
        this.condition.viDataValue);
    },
  },
  mounted() {
    this.fetchUpdate();
  },
  methods: {
    // 按输入的搜索条件进行查询
    onSearch() {
      this.fetchUpdate(this.condition);
    },
    // 将页面恢复到初始状态
    onClear() {
      this.$refs.conditionForm.resetFields();
      this.condition.viStr = '';
    },
    // 提交搜索条件
    onFormSubmit() {
      this.fetchUpdate(this.condition);
    },
    // 选择一其中条数据
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchUpdate();
    },
    // 选择窗口显示数据的数量
    onSizeChange(val) {
      this.pageSize = val;
      this.fetchUpdate();
    },
    // 表格的当前行发生变化的时候会触发该事件
    onCurrentRowChange(val) {
      if (val) {
        this.$emit('select', val);
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    // 将数据发送给后台
    fetchUpdate(params = {}) {
      const { currentPage, pageSize } = this;
      this.$store.dispatch(FETCH_UPDATE_ACTION, {
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
      });
    },
  },
};
</script>
<style lang="scss">
.scm-update-select {
  width: 970px;
  margin: auto;
  .el-dialog__sub-header {
    width: 999px;
    margin-left: -15px;
    text-align: left;
  }
  .search-condition {
    .el-form-item {
       float:left;
      margin-right:35px;
      margin-bottom: 0;
      .update-name {
        width: 216px;
      }
      .input-down{
        text-align:right;
      }
      .input-down span{
        color:#0085D0;
        cursor: pointer;
      }
    }
    .el-form-item:nth-child(4){
      margin-right:0px;
    }
    .el-form-item:nth-child(5){
      margin-bottom:13px;
    }
  }

  .divider {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .el-table {
    margin-bottom: 10px;
  }
  .el-pagination {
    .el-pagination__sizes,
    button,
    ul,
    .el-pagination__jump {
      float: left;
    }
  }
}
</style>
