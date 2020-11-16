<!-- 搜索帮助（框架合同搜索帮助） -->
<template>
  <basic-dialog :visible.sync="innerVisible"
                :title="title"
                width="600px">
    <div class="scm-contract-select">
      <scm-dialog-sub-header :title="title">
        <template slot="action">
          <!-- <scm-dialog-sub-header-button
            :disabled="fileList.length === 0 && !importLoading"
            icon="submit"
            @click="onImport">
            导入
          </scm-dialog-sub-header-button> -->
        </template>
      </scm-dialog-sub-header>
        <scm-upload
          ref="upload"
          class="upload-btn"
          :action="url"
          :data="param"
          :headers="headerParam"
          :file-list="fileList"
          :auto-upload="true"
          :before-upload="beforeUpload"
          :on-remove="onRemove"
          :on-change="handleChange"
          :on-success="onFileUploadSuccess"
          :on-progress="onFileProgress"
          :on-error="onFileUploadError">
          <scm-button
            class="uploadBtn"
            size="mini"
            type="primary">
            选择文件
          </scm-button>
        </scm-upload>
        <div class="buttonWrap">
          <scm-button
            v-if="isShowDownloadBtn"
            :loading="downLoading"
            @click="download"
            class="uploadBtn"
            size="mini"
            type="primary">
            下载模板
          </scm-button>
          <slot name="customBtn"></slot>
        </div>
        <!--  -->
        <div v-if="uploadPercent >= 100" style="padding-top:10px;">
          文件上传成功，数据处理中...
          <span class="loadingWrap">
            <span v-loading="true"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"></span>

          </span>
        </div>
      <scm-divider dashed
                   class="divider"></scm-divider>
      <scm-table
        v-if="isShowTable"
        :data="errMsgData"
        v-loading="importLoading"
        :element-loading-text="'导入中'"
        stripe
        class="err-table"
        max-height="390"
        tooltip-effect="dark">
        <scm-table-column
          show-overflow-tooltip
          prop="msg"
          label="导入结果">
        </scm-table-column>
      </scm-table>
    </div>
  </basic-dialog>
</template>
<script>
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

const DOWNLOAD_IMPORT_TEMPLATE = 'mdm/downloadImportTemplate';

export default {
  name: 'ScmImportDialog',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    param: Object, // 下载需要的参数
    url: String, // 上传地址
    module: String, // 下载的必要参数
    code: String, // 下载的必要参数
    isShowDownloadBtn: {
      // 是否显示下载按钮
      type: Boolean,
      default: true,
    },
    title: {
      // 弹窗标题
      tyep: String,
      default: '导入',
    },
  },
  data() {
    return {
      errMsgData: [],
      fileList: [],
      fileName: '',
      importLoading: false,
      isShowTable: false,
      uploadPercent: 0,
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      downLoading: state => state.loading.actions[DOWNLOAD_IMPORT_TEMPLATE],
    }),
    headerParam() {
      const user = this.$store.getters['systemConfig/user'];
      return {
        loginUserId: user.userId,
        loginAddrCode: user.addrCode,
      };
    },
  },
  methods: {
    download() {
      const {
        module,
        code,
      } = this;
      this.$store.dispatch(DOWNLOAD_IMPORT_TEMPLATE, {
        module,
        code,
      });
    },
    onFileProgress(event) {
      this.uploadPercent = event.percent;
    },
    onRemove(file, fileList) {
      this.fileList = fileList;
      this.isShowTable = false;
      this.uploadPercent = 0;
      this.importLoading = false;
      this.errMsgData = [];
    },
    beforeUpload() {
      this.importLoading = true;
    },
    handleChange(file) {
      this.fileName = file.name;
      this.fileList = [];
      this.fileList.push(file);
      if (file.status === 'ready') {
        this.errMsgData = [];
        this.isShowTable = false;
      }
    },
    onImport() {
      this.$refs.upload.submit();
    },
    /**
     * 文件上传成功的钩子
     * @event
     */
    onFileUploadSuccess(response) {
      this.importLoading = false;
      this.uploadPercent = 0;
      if (response.data.batch) {
        if (response.data.list && response.data.list.length > 0) {
          this.isShowTable = true;
          this.errMsgData = response.data.list;
        } else {
          this.innerVisible = false;
        }
        this.$emit('initProTable', response);
      } else if (response.data && response.data.list) {
        this.isShowTable = true;
        this.errMsgData = response.data.list;
      } else {
        this.$message({
          fullscreen: true,
          type: 'error',
          message: '导入失败',
        });
      }
    },
    onFileUploadError(response) {
      this.importLoading = false;
      this.uploadPercent = 0;
      if (response.data && response.data.list) {
        this.isShowTable = true;
        this.errMsgData = response.data.list;
      } else if (response.message) {
        this.$message({
          fullscreen: true,
          type: 'error',
          message: JSON.parse(response.message).message,
        });
      } else {
        this.$message({
          fullscreen: true,
          type: 'error',
          message: '系统内部错误',
        });
      }
    },
  },
};
</script>
<style lang="scss">
.scm-contract-select {
  position: relative;
  .divider {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .upload-btn{
    display: block;
    margin-right: 10px;
  }

  .uploadBtn{
    width: auto;
  }

  .buttonWrap{
    position: absolute;
    left: 82px;
    top: 50px;
    button{
      width: auto;
    }
  }

  .loadingWrap{
    position: relative;
    span{
      position: absolute !important;
      bottom: -20px;
      left: 5px;
    }
  }

  .el-table {
    margin-bottom: 10px;
  }
}
</style>
