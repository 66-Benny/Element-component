<template>
  <div>
  </div>
</template>
<script>
import _ from 'lodash';
import ScmSdk, { constants } from 'scm-sdk';
import { Message } from 'scm-ui';
import { getWorkOrderInfo } from '@/model/common/opnsrpt/util.js';

// const { STORE_KEY, PAGE_SOURCE_TYPE } = constants;

export default {
  props: {
    fromOa: {
      type: Boolean,
      default: false,
    },
    isNewLayout: {
      type: Boolean,
      default: false,
    },
  },
  components: {
  },
  computed: {
    // ...StoreGlobalAPI.mapGetters({
    //   fromPageType: `${STORE_KEY.GET_FROM_PAGE_TYPE}`,
    // }),
    // fromOa() {
    //   return this.fromPageType === PAGE_SOURCE_TYPE.OA_LIST;
    // },
    // isNewLayout() {
    //   const showList = ['/web-source/', '/web-nonsource/'];
    //   let show = false;
    //   const url = window.location.href;
    //   showList.forEach((v) => {
    //     if (url.includes(v)) {
    //       show = true;
    //     }
    //   });
    //   return show;
    // },
  },
  watch: {
  },
  created() {
    // 程序抛出的错误信息处理
    ScmSdk.config.errorHanlder = (error) => {
      // This error means that ResizeObserver was not able to deliver all observations
      // within a single animation frame. It is benign (your site will not break)
      // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
      const { id, noIdMessage } = error;
      if (
        noIdMessage === 'ResizeObserver loop limit exceeded' ||
        noIdMessage === 'cancel' || // $confirm cancel ign
        // ResizeObserver warning in firefox.
        (!_.isEmpty(noIdMessage) &&
          noIdMessage.indexOf('ResizeObserver loop completed') === 0)
      ) {
        return;
      }
      let messageType = constants.MESSAGE_TYPE.ERROR;
      if (!_.isEmpty(id) && _.endsWith(id, 'W')) {
        messageType = constants.MESSAGE_TYPE.WARNING;
      }
      if (this.isNewLayout) {
        this.showConfirmErrorMsg(error, messageType);
      } else {
        this.showBaseErrorMsg(error, messageType);
      }
    };
  },
  data() {
    return {
      isErrorShowing: false,
      responseData: {},
    };
  },
  methods: {
    // 显示确认样式的错误信息
    showConfirmErrorMsg(error, type) {
      const {
        noIdMessage, requestId, oddNumber, message, code,
      } = error;
      const { currentPageModule } = getWorkOrderInfo();
      const requestIdMsg = requestId ? `Ticket.${requestId}` : '';
      this.$confirm(`${noIdMessage}${requestIdMsg}`, '错误', {
        type,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true,
        distinguishCancelAndClose: true,
        cancelButtonText: '知识库',
        confirmButtonText: '发起工单',
      })
        .then(() => {
          const sysModule = currentPageModule.reduce((res, item) => {
            res.push(item.value);
            return res;
          }, []);

          this.$emit('openPageOrDialog', {
            global: true,
            tab: {
              name: '发起工单',
            },
            category: constants.SYSTEM_CATEGORY.G4,
            path: '/web-opnsrpt/workorder/opsorder-create',
            query: {
              fromName: 'businessError',
              product: 'SCM',
              sysModule: sysModule.join(),
              workOrderType: 'INCIDENT', // 默认传事件工单
              workOrderInfo: {
                errorCode: code, // 错误代码
                errorMessage: noIdMessage, // 错误信息
                errorNum: requestId, // 错误参考号
                stackInformation: message, // 堆栈信息
                businessNumber: oddNumber, // 业务单号
              },
              // workOrderType: dict.dictEntryCode,
            },
          });

          // this.openPageOrDialog();
        })
        .catch((action) => {
          if (action === 'cancel') {
            const { userId } = this.$store.getters['systemConfig/user'];
            this.$emit('openPageOrDialog', {
              path: '/Repository-api/repository/mainPage/listCust',
              category: constants.SYSTEM_CATEGORY.HOMEPAGE,
              // global: true,
              tab: {
                name: '知识文件库',
              },
              query: {
                uid: userId,
              },
            });
          }
        });
    },
    gotoViewDebugDetailHandler() {
      this.$router.push({
        global: true,
        tab: {
          name: '错误日志查看',
        },
        // category: constants.SYSTEM_CATEGORY.G4,
        path: '/web-bpm/view-error-info',
        query: {
          responseData: this.responseData,
        },
      });
    },
    // 显示基础错误信息处理
    showBaseErrorMsg(error, type) {
      const { noIdMessage, requestId } = error;
      const h = this.$createElement;


      let debugModeStatus = false;

      if (window.top.g4Base) {
        if (typeof window.top.g4Base.clientDebugMode === 'boolean' && window.top.g4Base.clientDebugMode) {
          debugModeStatus = true;
          this.responseData = _.get(error, 'detail.response.data', {});
        }
      }

      const message = h('div', { class: 'global-error-message__content_wrap' }, [
        h('div', { class: 'global-error-message__content' }, noIdMessage),
        requestId
          ? h(
            'div',
            { class: 'global-error-message__request-id' },
            [
              h('p', {}, `Ticket.: ${requestId}`),
              debugModeStatus ? h('a', {
                class: 'global-error-message__debug_read_more',
                on: {
                  click: this.gotoViewDebugDetailHandler,
                },
              }, '查看更多') : '',
            ],


          )
          : null,
      ]);
      const errorOption = {
        message,
        showClose: true,
        duration: type === constants.MESSAGE_TYPE.WARNING ? 1000 : 0,
        onClose: () => {
          this.isErrorShowing = false;
        },
      };
      // 服务端状态码为非200或timeout的场合，提示框不自动关闭
      // if (typeof error.type === 'string' && error.type === 'ServiceError') {
      // errorOption.showClose = true;
      // errorOption.duration = 0;
      // }
      // This error means that ResizeObserver was not able to deliver all observations
      // within a single animation frame. It is benign (your site will not break)
      // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
      // if (
      //   noIdMessage === 'ResizeObserver loop limit exceeded' ||
      //   // ResizeObserver warning in firefox.
      //   (!_.isEmpty(noIdMessage) &&
      //     noIdMessage.indexOf('ResizeObserver loop completed') === 0)
      // ) {
      //   return;
      // }
      // 只显示一个错误
      if (!this.isErrorShowing) {
        this.isErrorShowing = true;
        Message[type](errorOption);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.global-error-message__content {
  font-size: 16px;
  line-height: 1.5;
  padding-right: 20px;
}
.global-error-message__request-id {
  color: grey;
  font-size: 10px;
}
.global-error-message__debug_read_more{
  display: block;
  text-align:center;
  cursor: pointer;
}
</style>
<style >
 .global-error-message__content_wrap + .el-message__closeBtn{
    top: 10px;
    right: 10px;
    transform:none;
}
</style>
