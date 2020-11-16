<template>
  <basic-dialog :visible.sync="innerVisible"
                :showClose="false"
                :closeOnPressEscape="false"
                :closeOnClickModal="false"
                :title="title"
                width="1000px">
    <scm-dialog-sub-header :title="subTitle || title"
                           class="bank-common-select-dialog__header">
      <template slot="action">
        <scm-dialog-sub-header-button icon="previous"
                                      @click="onClear">
          返回
        </scm-dialog-sub-header-button>
        <scm-divider type="vertical"
                     v-if="multiple"></scm-divider>
        <scm-dialog-sub-header-button icon="submit"
                                      :disabled="submitDisabled"
                                      @click="onSubmit">
          提交
        </scm-dialog-sub-header-button>
      </template>
    </scm-dialog-sub-header>
    <div class="attachment-dialog">
      <attachment-basic
        :data="data"
        :uploadConfig="uploadConfig"
        :businessTypeConfig="businessTypeConfig"
        :fileLimit="fileLimit"
        :readonly="readonly"
        :required="required"
        :hideTitle="hideTitle"
        :isDialogCall="isDialogCall"
        :noDownload="noDownload"
        :dropdownMenuCustomClass="dropdownMenuCustomClass"
        :beforeFileUploadFun="beforeFileUploadFun"
        :beforeFileDeleteFun="beforeFileDeleteFun"
        @attachment-add="attachmentAdd"
        @attachment-delete="attachmentDelete"
        @attachment-change="attachmentChange"
        :title="title"></attachment-basic>
    </div>

  </basic-dialog>
</template>

<script>
// import _ from 'lodash';
import ScmSdk from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import attachmentBasic from '../../attachment-basic';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

export default {
  name: 'ScmAttachmentDialog',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
    attachmentBasic,
  },
  props: {
    // 附件列表数据
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    // 卡片标题
    title: {
      type: String,
      default: '附件信息',
    },
    // 卡片副标题标题
    subTitle: {
      type: String,
      default: '',
    },
    /**
     * { accept: String }
     */
    uploadConfig: Object,
    /**
     * { label: String, value: String || Object, uploadConfig: { accept: String } }
     */
    businessTypeConfig: Array,
    // 是否只读，设置为true的场合，不显示右上角上传菜单和删除按钮
    readonly: {
      type: Boolean,
      default: false,
    },
    // 是否必须上传附件
    required: {
      type: Boolean,
      default: false,
    },
    // 是否隐藏标题
    hideTitle: Boolean,
    // Dropdown菜单自定义类名
    dropdownMenuCustomClass: String,
    // 上传之前的函数钩子，如果返回false则不上传，返回true正常上传
    beforeFileUploadFun: {
      type: Function,
      default() {
        return true;
      },
    },
    // 删除之前的函数钩子，如果返回false则不删除，返回true正常删除
    // function(fileList)
    beforeFileDeleteFun: {
      type: Function,
      default() {
        return true;
      },
    },
    // 最大上传文件数
    fileLimit: Number,
    // 禁止下载
    noDownload: Boolean,
  },
  watch: {
    data: {
      handler(newVal) {
        /*
          由于删除文件后“attachment-basic”文件会修改this.data参数，
          如果newVal.length > this.fileList.length,说明没有新增的文件，
          因为关闭弹窗后会清空this.fileList,this.uploadingFileList,
          所以只有首次打开会加载数据，点击“返回”按钮也不会修改数据。
         */
        if (newVal.length > this.fileList.length) {
          this.fileList = newVal;
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      fileList: [], // 可以提交的参数，如果其中有正在提交的参数，“提交”按钮置灰
      uploadingFileList: [], // 正在提交的行信息，用来判断“提交”按钮是否置灰
      isDialogCall: true,
    };
  },
  computed: {
    clearDisabled() {
      return this.fileList.length <= 0;
    },
    submitDisabled() {
      return this.uploadingFileList.length !== 0;
    },
    fileUploadUrl() {
      const url = ScmSdk.api.attachment.defaults.baseURL;
      return `${url}uploadFile?fileType=*`;
    },
    uploadData() {
      const user = this.$store.getters['systemConfig/user'];
      return {
        loginUserId: user.userId,
      };
    },
  },
  mounted() {
  },
  methods: {
    attachmentChange(changeFileList) {
      this.uploadingFileList = changeFileList;
    },
    attachmentAdd(currentFile, ret, remainingList) {
      this.fileList = remainingList;
      this.$emit('attachment-add', currentFile, ret);
    },
    attachmentDelete(fileInfo, deleteFileList, remainingList) {
      this.fileList = remainingList;
      this.$emit('attachment-delete', fileInfo, deleteFileList);
    },
    onSubmit() {
      this.$emit('attachment-select', this.fileList);
    },
    onClear() {
      this.innerVisible = false;
    },
  },
};
</script>

<style lang="scss">
</style>


<style lang="scss" scoped>
</style>
