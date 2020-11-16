<template>
  <scm-footer-toolbar class="el-page-footer"
    v-show="isShowFooter"
    ref="footer">
    <slot></slot>
    <scm-button :type="operBtnType"
      @click="onCloseButtonClick"
      v-if="isShowCloseButton">关闭</scm-button>
    <scm-button :type="operBtnType"
      @click="onBackButtonClick"
      v-if="showReturnButton">返回</scm-button>
  </scm-footer-toolbar>
</template>
<script>
import _ from 'lodash';
import { StoreGlobalAPI, constants } from 'scm-sdk';

const { STORE_KEY } = constants;

export default {
  name: 'ScmPageFooter',
  props: {
    // 数据标题
    dataTitle: {
      type: String,
      default: '数据',
    },
    // 数据是否有变动
    dataChanged: {
      type: Boolean,
      default: true,
    },
    isShowReturnButton: {
      type: Boolean,
      default: true,
    },
    // 阻止组件内部原始后退事件,改为传入的方法
    backEvent: {
      type: Function,
    },
  },
  watch: {
    isShowReturnButton: {
      immediate: true,
      handler(val) {
        this.showReturnButton = val;
      },
    },
  },
  data() {
    return {
      isShowCloseButton: false,
      showReturnButton: true,
      isShowFooter: true,
      operBtnType: '',
    };
  },
  created() {
    const { PAGE_SOURCE_TYPE } = constants;
    // 从已办页面打开的场合(待办/已办页面通过对话框的形式打开当前页面)
    const fromPageType = this.getFromPageType();
    if (fromPageType === PAGE_SOURCE_TYPE.DONE_LIST) {
      this.isShowFooter = false;
      // 如果从4期pageLoader打开时
    } else if (fromPageType === PAGE_SOURCE_TYPE.FROM_PAGE_LOADER && this.getRouteCurrentIndex() === 0) {
      this.isShowCloseButton = false;
      this.showReturnButton = false;
      // 从OA系统直接点击当前页面URL打开的场合(以浏览器窗口的形式打开当前页面)
    } else if (
      fromPageType === PAGE_SOURCE_TYPE.OA_LIST ||
      // 从个人桌面直接打开的场合(以系统内Tab页签的形式打开当前页面)
      fromPageType === PAGE_SOURCE_TYPE.DESKTOP_LIST ||
      // 从待阅进来
      fromPageType === PAGE_SOURCE_TYPE.NOTICE_TO_READ ||
      // 如果以上都不符合，且是打开的第一个页面时，也需要显示关闭
      this.getRouteCurrentIndex() === 0
    ) {
      this.isShowCloseButton = true;
      this.showReturnButton = false;
      this.$emit('update:isShowReturnButton', this.showReturnButton);
    }

    // 如果当前路由下标有大于0，则需要显示返回按钮
    if (this.getRouteCurrentIndex() > 0) {
      this.showReturnButton = true;
    }
  },
  mounted() {
    // this.changeBtnType();
  },
  updated() {
    // this.changeBtnType();
  },
  methods: {
    ...StoreGlobalAPI.mapGetters({
      getFromPageType: `${STORE_KEY.GET_FROM_PAGE_TYPE}`,
      getRouteCurrentIndex: `${STORE_KEY.GET_ROUTE_CURRENT_INDEX}`,
      getRouteHistory: `${STORE_KEY.GET_ROUTE_HISTORY}`,
    }),
    // 改变按钮样式
    changeBtnType() {
      this.$nextTick(() => {
        const btnLength = Array.from(this.$refs.footer.$el.querySelectorAll('.default>*')).filter(item => item.style.display !== 'none').length;
        this.operBtnType = btnLength > 1 ? '' : 'primary';
      });
    },
    /**
     * 返回按钮点击事件处理
     * @event
     */
    onBackButtonClick() {
      const { dataTitle, dataChanged } = this;
      const h = this.$createElement;
      // 判断是否有自定义回退事件
      if (this.backEvent) {
        this.backEvent();
        return;
      }
      // 如果数据有变动的场合
      if (dataChanged) {
        const message = h('div', null, [
          h('div', null, `返回将不保存填写的${dataTitle}信息，确定返回吗？`),
        ]);
        // 弹出提示框进行提示
        this.$confirm(message, '提示')
          .then(() => {
            this.back();
          })
          .catch(() => {});
      } else {
        this.back();
      }
    },
    /**
     * 关闭按钮点击事件处理
     * @event
     */
    onCloseButtonClick() {
      this.$router.close(false);
    },
    /**
     * 返回至前页面
     */
    back() {
      this.$router.back();
      this.$emit('back');
    },
    /**
     * 关闭当前页
     * 判断来源：
     * 如果是从OA系统、个人桌面、已办页面打开，则直接关闭Tab页
     * 其他条件，比如工作台进来的就直接返回
     * @public
     */
    close() {
      const fromPageType = this.getFromPageType();
      const routerHistroy = this.getRouteHistory();

      if (!_.isEmpty(fromPageType) || (routerHistroy.length === 1 && document.referrer)) {
        // 适配A页面打开了B页面，再关闭B页面，导致A页面的返回按钮不好用，这里手动路由返回一下。（仅限IE）
        // if (util.isIE) {
        //   this.$router.back();
        // }
        this.$router.close();
      } else {
        this.back();
      }
    },
  },
};
</script>
