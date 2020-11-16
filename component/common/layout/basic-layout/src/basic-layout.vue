<template>
  <div class="scm-system-fourth">
    <div id="g4td-root"
      :class="[className]">
      <router-view></router-view>
    </div>
    <!-- OA入口进入时，显示工单助手 -->
    <fixed-work-order-menu :dataList="workOrderDataList"
      @open="openPageOrDialog"
      v-if=" workOrderDataList.length >0 && isNewLayout && fromOa"></fixed-work-order-menu>
    <!-- OA入口进入时，错误时或者点击工单助手时的页面处理 -->
    <page-loader-dialog :visible.sync="dialog.visible"
      :query="dialog.query"
      :title="dialog.title"
      :category="dialog.category"
      :path="dialog.path" />
    <!-- 你懂得模式组件 -->
    <debug-mode />
    <!--全局异常捕获机制  -->
    <error-hanlder :fromOa="fromOa"
      :isNewLayout="isNewLayout"
      @openPageOrDialog="openPageOrDialog" />
  </div>
</template>
<script>
import _ from 'lodash';
import { constants, StoreGlobalAPI } from 'scm-sdk';
import { getWorkOrderType } from '@/model/common/opnsrpt/service.js';
import { Loading } from 'scm-ui';
import FixedWorkOrderMenu from '../../../fixed-work-order-menu';
import PageLoaderDialog from '../../../base/page-loader-dialog';
import DebugMode from '../../debug-mode';
import ErrorHanlder from '../../error-hanlder';

const { STORE_KEY, PAGE_SOURCE_TYPE } = constants;
let loadingInstance;

export default {
  name: 'app',
  props: {
    prefixCls: String,
  },
  components: {
    ErrorHanlder,
    DebugMode,
    FixedWorkOrderMenu,
    PageLoaderDialog,
  },
  computed: {
    ...StoreGlobalAPI.mapGetters({
      fromPageType: `${STORE_KEY.GET_FROM_PAGE_TYPE}`,
    }),
    fromOa() {
      return this.fromPageType === PAGE_SOURCE_TYPE.OA_LIST;
    },
    className() {
      return this.prefixCls ? `${this.prefixCls}-layout` : 'layout';
    },
    loadingState() {
      return _.get(this.$store, 'getters')[constants.STORE_KEY.GET_IS_LOADING];
    },
    isNewLayout() {
      const showList = ['/web-source/', '/web-nonsource/'];
      let show = false;
      const url = window.location.href;
      showList.forEach((v) => {
        if (url.includes(v)) {
          show = true;
        }
      });
      return show;
    },
  },
  watch: {
    loadingState: {
      immediate: true,
      handler(val) {
        if (val) {
          loadingInstance = Loading.service({
            fullscreen: true,
            text: process.env.VUE_APP_SERVICE_LOADING_TEXT,
          });
        } else {
          this.$nextTick(() => {
            if (loadingInstance) {
              loadingInstance.close();
            }
          });
        }
      },
    },
  },
  beforeCreate() {},
  created() {
    if (this.isNewLayout && this.fromOa) {
      this.getWorkOrderDataList();
    }
  },
  data() {
    return {
      workOrderDataList: [],
      dialog: {
        title: '',
        visible: false,
        query: {},
        path: '',
        category: '',
      },
    };
  },
  methods: {
    // 判断环境打开页面或dialog
    openPageOrDialog(location) {
      const proxy = location;
      if (this.fromOa) {
        // OA来源
        this.$router.generateModuleParams(proxy);
        this.dialog.title = proxy.tab.name;
        this.dialog.query = proxy.query;
        this.dialog.path = proxy.path;
        this.dialog.category = proxy.category;
        this.dialog.visible = true;
        delete proxy.global;
        delete proxy.tab;
        // this.$router.generateModuleParams(proxy);
      } else {
        // 非OA来源
        if (proxy.category === constants.SYSTEM_CATEGORY.G4) {
          delete proxy.category;
        }
        this.$router.push(proxy);
      }
    },
    // 获取工单类型
    getWorkOrderDataList() {
      if (this.isNewLayout && this.fromOa) {
        getWorkOrderType().then((res) => {
          this.workOrderDataList = _.get(res, 'data.data', []);
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
