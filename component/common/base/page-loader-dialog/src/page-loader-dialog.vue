<template>
  <div class="page-loader-dialog" v-show="innerVisible">

    <basic-dialog :visible.sync="innerVisible"
      ref="basicDialog"
      fullscreen
      :title="title"
      @opened="onOpened"
      @close="setNullUrl">
      <page-loader
         ref="pageLoader"
         v-if="isDialogOpened"
        :query="query"
        :path="path"
        :category="category"></page-loader>
      <template slot="footer">
        <span>
          <scm-button class="custom-btn" @click="onClose">关闭</scm-button>
        </span>
      </template>

    </basic-dialog>

  </div>
</template>
<script>
import { constants } from 'scm-sdk';
import BasicDialog from '@/component/common/basic-dialog';
import PageLoader from '@/component/common/base/page-loader';

const { SYSTEM_CATEGORY } = constants;

export default {
  name: 'PageLoaderDialog',
  components: { BasicDialog, PageLoader },
  props: {
    visible: Boolean,
    // 使用Iframe打开页面的场合，此参数必须输入
    path: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: SYSTEM_CATEGORY.G4,
      validator(value) {
        // 这个值必须匹配下列字符串中的一个
        return !value || Object.values(SYSTEM_CATEGORY).includes(value);
      },
    },
    query: {
      type: Object,
      default() {
        return {};
      },
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isDialogOpened: false,
    };
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    //
    onClose() {
      this.innerVisible = false;
      // this.$emit('');
    },
    setNullUrl() {
      // 移除路由中的信息
      this.$refs.pageLoader.setNullSrc();
    },
    onOpened() {
      this.$nextTick(() => {
        this.isDialogOpened = true;
        // 重置高度
        const body = this.$refs.basicDialog.$el.querySelector('.el-dialog__body');
        body.style.height = `${window.innerHeight - 50 - 16}px`;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.page-loader-dialog {
  width: 100%;
  height: 100%;
  .custom-btn{
    width: 120px;
    height: 26px;
    padding: 6px 11px;
  }
  /deep/ .el-dialog__header {
    background-color: #94b9cd;
    padding: 3px;
    .el-dialog__title {
      color: #fff;
      font-size: 15px;
    }
    .el-dialog__headerbtn{
      top: 4px;
    }
    .el-svg-icon {
      color: #fff;
    }
  }
  /deep/ .el-dialog__body {
    padding-bottom: 0px;
  }
  /deep/ .el-dialog__footer{
    padding:5px;
  }
}
</style>
