<template>
  <div class="debug-mode-container"
    v-if="showDebugStatus">
    <div class="button"
      @click="getAndClearRequestList">复制并清空请求接口</div>
    <div class="button"
      :class="openDebugStatus?'enable':'disabled'"
      @click="toggleDebugStatus">已{{openDebugStatus?'开启':'关闭'}}调试模式</div>
  </div>
</template>
<script>
import { constants, StoreGlobalAPI } from 'scm-sdk';

const { STORE_KEY, SESSION_STORAGE_SCM_SDK_G4BASE } = constants;
export default {
  props: {},
  components: {},
  watch: {},
  created() {
    this.initRootDebugMode();
    window.addEventListener('keyup', this.globalKeyUp);
  },
  data() {
    return {
      openDebugStatus: false,
      showDebugStatus: false,
    };
  },
  computed: {
    ...StoreGlobalAPI.mapGetters({
      debugRequestList: `${STORE_KEY.GET_DEBUG_REQUEST_LIST}`,
    }),
  },
  methods: {
    ...StoreGlobalAPI.mapMutations({
      clearDebugRequestList: `${STORE_KEY.CLEAR_DEBUG_REQUEST_LIST}`,
    }),
    getG4Base() {
      const g4Base = sessionStorage.getItem(SESSION_STORAGE_SCM_SDK_G4BASE);
      if (g4Base) {
        return JSON.parse(g4Base);
      }
      return {};
    },
    initRootDebugMode() {
      const g4Base = this.getG4Base();
      if (g4Base) {
        if (
          typeof g4Base.clientDebugMode === 'boolean' && g4Base.clientDebugMode
        ) {
          this.openDebugStatus = true;
          this.showDebugStatus = true;
        }
      }
    },
    globalKeyUp(event) {
      if (event.ctrlKey && event.altKey && event.keyCode === 119) {
        this.showDebugStatus = !this.showDebugStatus;
        let clientDebugMode = false;
        if (this.showDebugStatus) {
          // 调试状态可见时
          this.openDebugStatus = true;
          clientDebugMode = true;
        } else {
          // 调试状态不可见时
          clientDebugMode = false;
        }
        this.setRootDebugMode(clientDebugMode);
      }
    },
    toggleDebugStatus() {
      this.openDebugStatus = !this.openDebugStatus;
      this.setRootDebugMode(this.openDebugStatus);
    },
    setRootDebugMode(val) {
      const g4Base = this.getG4Base();
      g4Base.clientDebugMode = val;
      sessionStorage.setItem(SESSION_STORAGE_SCM_SDK_G4BASE, JSON.stringify(g4Base));
    },
    getAndClearRequestList() {
      // const list = cloneDeep(this.debugRequestList);
      const mapRes = {};
      this.debugRequestList.forEach((item, index) => {
        mapRes[`interface${index}`] = item;
      });
      this.copyOper(mapRes);
      this.clearDebugRequestList();
    },
    copyOper(val) {
      const oInput = document.createElement('textarea');
      const jsonString = JSON.stringify(val, null, 2);
      oInput.innerHTML = jsonString;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand('Copy'); // 执行浏览器复制命令
      this.$message({
        showClose: true,
        message: '复制成功。',
        type: 'success',
      });
      document.body.removeChild(oInput);
    },
  },
};
</script>
<style lang="scss" scoped>
.debug-mode-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  .button {
    margin-top: 10px;
    background-color: #6f7e95;
    padding: 10px;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
  }
  .enable {
    background-color: #67c23a;
  }
  .disable {
    background-color: #6f7e95;
  }
}
</style>
