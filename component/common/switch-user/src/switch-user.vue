<template>
  <basic-dialog :visible.sync="innerVisible"
                title="切换用户"
                width="1000px">
    <div class="switch-user-select">
      <scm-button
        type="text"
        :disabled="employee.userId === currentUserId"
        v-for="employee in employeeList"
        :key="`employee-${employee.userId}`"
        @click="onSelectUser(employee.userId)">
        {{ getDisplayLabel(employee) }}
      </scm-button>
    </div>
  </basic-dialog>
</template>
<script>
// import { ApplicationError } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';
import userList from './user-list.json';
import { updateUserInfo } from './util';

export default {
  name: 'ScmSupSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  data() {
    return {
      currentUserId: '',
    };
  },
  computed: {
    employeeList() {
      return this.getDummyUserInfoList();
    },
    employeeName() {
      const employee
        = Object.keys(this.getDummyUserInfoList()).find(item => item.userId === this.currentUserId);
      return employee ? employee.employeeName : '';
    },
  },
  watch: {
    currentUserId: {
      handler(val) {
        const currentEmployeeInfo = this.getDummyUserInfoList()[val];
        // 更新用户信息
        if (currentEmployeeInfo) {
          updateUserInfo(currentEmployeeInfo);
        } else {
          this.$message.error('userID不能为空');
          // throw new ApplicationError('MCM003E', val); // userID不能为空
        }
      },
    },
  },
  methods: {
    onSelectUser(userId) {
      this.currentUserId = userId;
      this.$emit('select', userId);
    },
    /**
     * 取得Dummy用户信息列表
     * @public
     */
    getDummyUserInfoList() {
      return userList;
    },
    getDisplayLabel(employee) {
      return `${employee.employeeName}（${employee.addrName} - ${employee.locationName}）`;
    },
  },
};
</script>
<style lang="scss" scoped>
.switch-user-select {
  /deep/ {
    .el-button--text {
      font-size: 18px;
    }
  }
}
</style>
