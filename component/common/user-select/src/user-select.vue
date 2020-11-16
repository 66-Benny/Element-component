<!-- 搜索帮助（用户信息）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="用户信息"
                width="1000px">
    <div class="scm-user-select">
      <scm-dialog-sub-header title="用户信息操作管理">
        <template slot="action">
          <scm-dialog-sub-header-button icon="search"
                                        @click="onSearch">
            搜索
          </scm-dialog-sub-header-button>
          <scm-divider type="vertical"></scm-divider>
          <scm-dialog-sub-header-button icon="clear"
                                        :disabled="false"
                                        @click="onClear">
            清空
          </scm-dialog-sub-header-button>
          <scm-divider type="vertical" v-if="nullValue"></scm-divider>
          <scm-dialog-sub-header-button icon="previous"
                                        v-if="nullValue"
                                        @click="onPrevious">
            返回空值
          </scm-dialog-sub-header-button>
          <scm-divider type="vertical" v-if="multiple" ></scm-divider>
          <scm-dialog-sub-header-button icon="submit"
                                        :disabled="submitDisabled"
                                        @click="onSubmit"
                                        v-if="multiple">
            提交
          </scm-dialog-sub-header-button>
        </template>
      </scm-dialog-sub-header>
      <scm-form :model="condition"
                @submit.native.prevent="onFormSubmit"
                ref="conditionForm"
                label-position="top"
                class="search-condition"
                inline>
        <scm-form-item label="用户名"
                       prop="viUserName">
          <scm-input v-model="condition.viUserName"
                     class="user-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="部门全称"
                       v-if="!isHideOrgName"
                       prop="viorgName">
          <scm-input v-model="condition.viorgName"
                     class="user-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="省公司"
                        v-if="!isHideOrgAddrName"
                       prop="viorgAddrName">
          <scm-input v-model="condition.viorgAddrName"
                     class="user-name"></scm-input>
        </scm-form-item>
        <scm-form-item label="角色选择"
                       v-if="roleIds"
                       prop="viroleIds">
          <scm-select v-model="condition.viroleIds"
                      multiple
                      placeholder="请选择"
                      clearable
                      collapse-tags
                      class="user-name">
            <scm-option v-for="item in roleIds"
                        :key="item.value"
                        :title="item.title"
                        :label="item.label"
                        :value="item.value">
            </scm-option>
          </scm-select>
        </scm-form-item>
      </scm-form>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table :data="user.viList"
                 v-loading="fetchUserLoading"
                 ref="userTable"
                 highlight-current-row
                 @current-change="onCurrentRowChange"
                 @selection-change="handleSelectionChange"
                 max-height="327"
                 row-key="userIdIndex">
        <scm-table-column type="selection"
                          v-if="multiple"
                          reserve-selection></scm-table-column>
        <scm-table-column type="index"
                          width="50"
                          :index='getTableIndex'></scm-table-column>
        <scm-table-column label="省公司"
                          prop="orgAddrName"
                          width="132"></scm-table-column>
        <scm-table-column label="用户名"
                          prop="employeeBasicNameCn"
                          width="103"></scm-table-column>
        <scm-table-column label="部门全称"
                          prop="orgName"></scm-table-column>
        <scm-table-column label="部门简称"
                          width="175"
                          prop="orgShortName"></scm-table-column>
        <scm-table-column label="登录名"
                          prop="userId"
                          width="240"></scm-table-column>
      </scm-table>
      <scm-pagination :page-sizes="[10, 20, 50]"
                      :page-size="pageSize"
                      :total="user.viTotal?user.viTotal:0"
                      v-show="user.viTotal"
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

const FETCH_USER_ACTION = 'mdm/fetchUser';

export default {
  name: 'ScmUserSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      options: '',
      condition: {
        viUserName: '',
        viroleIds: '',
        viorgName: this.inputViorgName,
        viorgAddrName: '',
      },
      currentPage: 1,
      pageSize: 10,
      cloneCondition: {},
      multipleSelection: [],
      esopiData: '',
      owtotal: '',
      viroleIds2: null,
      viroleIds1: null,
      fetchUserLoading: false,
      user: {
        viTotal: 0,
        viList: [],
      },
    };
  },
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    cityCode: { // 市码
      type: String,
    },
    roleIds: {
      // 角色id ===例子： [{value: '选项1',label: '黄金糕',}]
      type: Array,
    },
    provinceComFlag: {
      // 是否匹配省公司下所用公司，Y:获取省公司下所有公司，N:仅仅查询省公司,空：只查询组织Id
      type: String,
    },
    cityComFlag: {
      // 是否匹配省公司及市公司，1：查询省公司及市公司，2：仅查询市公司
      type: String,
      default: '1',
    },
    owroleIds: Array,
    owroleIds2: {
      type: Array,
      // default: ['1401', '1402', '1440', '1441'],
    },
    orgId: { // 组织ID
      type: String,
      default: '',
    },
    userType: { // 员工类别Code，0:内部员工,1:供应商一级账号,2:供应商二级账号,3:内部专家,4:外部专家,5:代理机构,6:检测机构
      type: String,
    },
    userId: { // 用户id(系统账号)
      type: String,
    },
    userStatus: { // 用户状态，1:有权;2(无效,无权)
      type: String,
    },
    orgFlag: { // 部门id查询方式，1或者'':查当前id; 2:查询当前id及下一层id； 3：仅查询下一层id
      type: String,
      default: '',
    },
    inputViorgName: { // 部门全称
      type: String,
      default: '',
    },
    isHideOrgName: { // 是否隐藏部门全称输入框
      type: Boolean,
      default: false,
    },
    isHideOrgAddrName: { // 是否隐藏省公司输入框
      type: Boolean,
      default: false,
    },
  },
  computed: {
    clearDisabled() {
      return _.isEmpty(this.condition.viUserName ||
          this.condition.viroleIds ||
          this.condition.viorgName ||
          this.condition.viorgAddrName);
    },
    submitDisabled() {
      if (this.multipleSelection.length === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.fetchUser(this.condition);
  },
  watch: {
    innerVisible(newVal) {
      if (newVal && this.openRefresh) {
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        }
        this.fetchUser(this.condition);
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
        }
      }
    },
    multiple() {
      this.$refs.userTable.clearSelection();
    },
    roleIds: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.condition.viroleIds = _.map(newVal, 'value');
          Object.assign(this.cloneCondition, this.condition);
        }
      },
      immediate: true,
      deep: true,
    },
    owroleIds: {
      handler(newName, oldName) {
        if (newName !== oldName) {
          this.viroleIds1 = newName;
          Object.assign(this.cloneCondition, this.condition);
        }
      },
      immediate: true,
      deep: true,
    },
    owroleIds2: {
      handler(newName, oldName) {
        if (newName !== oldName) {
          this.viroleIds2 = newName;
          Object.assign(this.cloneCondition, this.condition);
        }
      },
      immediate: true,
      deep: true,
    },
    inputViorgName: {
      handler(newVal) {
        this.condition.viorgName = newVal;
      },
      immediate: true,
    },
  },
  destroyed() {
    if (this.viroleIds2) {
      this.viroleIds2 = null;
      this.fetchUser();
    }
    if (this.viroleIds1) {
      this.viroleIds1 = null;
      this.fetchUser();
    }
  },
  methods: {
    Searchinit() {
      this.currentPage = 1;
      Object.assign(this.cloneCondition, this.condition);
      this.fetchUser(this.condition);
      this.$refs.userTable.clearSelection();
    },
    // 按输入的搜索条件进行查询
    onSearch() {
      this.Searchinit();
    },
    // 将页面恢复到初始状态
    onClear() {
      this.$refs.conditionForm.resetFields();
      this.condition.viroleIds = [];
    },
    onSubmit() {
      this.$emit('select', this.multipleSelection);
      this.$refs.userTable.clearSelection();
    },
    onPrevious() {
      this.$emit('select', this.esopiData);
    },
    // 提交搜索条件
    onFormSubmit() {
      this.Searchinit();
    },
    // 选择一其中条数据
    onCurrentPageChange(val) {
      this.currentPage = val;
      this.fetchUser(this.cloneCondition);
    },
    // 选择窗口显示数据的数量
    onSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchUser(this.condition);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 表格的当前行发生变化的时候会触发该事件
    onCurrentRowChange(val) {
      if (val && !this.multiple) {
        this.$emit('select', val);
        this.$refs.userTable.setCurrentRow();
      }
    },
    // 将数据发送给后台
    fetchUser(params = {}) {
      const {
        currentPage,
        pageSize,
        addrCode,
        cityCode,
        provinceComFlag,
        cityComFlag,
        viroleIds2,
        viroleIds1,
        orgId,
        userType,
        userId,
        userStatus,
        orgFlag,
      } = this;
      this.fetchUserLoading = true;
      this.$store.dispatch(FETCH_USER_ACTION, {
        viAddrCode: addrCode,
        cityCode,
        viprovinceComFlag: provinceComFlag,
        cityComFlag,
        viPageNum: currentPage,
        viPageSize: pageSize,
        ...params,
        viroleIds2,
        viroleIds1,
        orgId,
        viUserType: userType,
        viUserId: userId,
        viUserStatus: userStatus,
        orgFlag,
      }).then((res) => {
        this.user = res;
        this.fetchUserLoading = false;
      }).catch(() => {
        this.fetchUserLoading = false;
      }).finally(() => {
        this.fetchUserLoading = false;
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
  .scm-user-select {
      .el-dialog__sub-header-title {
        font-size: 14px;
        color: #4a4a4a;
      }
    .search-condition {
      .el-form-item {
        margin-bottom: 10px;
        margin-right: 20px;
        width: 220px;
        .user-name{
              width: 100%;
        }
      }
    }
    .divider {
      margin-top: 8px;
      margin-bottom: 8px;
      border: 1px dashed #e8e8e8;
    }
    .el-table {
      margin-bottom: 10px;
    }
  }

</style>
