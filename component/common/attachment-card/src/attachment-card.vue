<template>
  <scm-card class="scm-attachment-card">
    <div v-if="fileLimit">附件上限：{{fileLimit}}</div>
    <div class="clearBoth" slot="header" v-if="!(hideTitle && readonly)">
      <span v-if="!hideTitle" :class="[ required ? 'is-required' : '']">{{ title }}</span>
      <div class="shadow" v-if="judgeLimit"></div>
      <scm-dropdown class="attachment-menu"
        v-if="innerBusinessTypeConfig.length > 0 && !readonly"
        @command="onAttachmentMenuClick">
        <span class="el-dropdown-link"
          :class="[ judgeLimit ? 'disabled' : '']">
          <div class="attachment-menu-dropdown">
            <scm-button type="text"
              :disabled="judgeLimit"
              class="attachment-label">
              上传附件
            </scm-button>
            <scm-icon name="attachment"
              class="tool-btn"
              :tooltip="false"></scm-icon>
          </div>
        </span>
        <scm-dropdown-menu slot="dropdown"
          :class="[dropdownMenuCustomClass]">
          <scm-dropdown-item v-for="typeObj in innerBusinessTypeConfig"
            :command="typeObj.value"
            :key="`attachment-menu-${typeObj.value}`">
            <scm-upload class="attachment-card__attachment-file-upload"
              :action="fileUploadUrl"
              :show-file-list="false"
              :headers="uploadData"
              :accept="getFileUploadConfig(typeObj.value).accept"
              multiple
              :before-upload="beforeFileUpload"
              :on-progress="onFileUploadProgress"
              :on-success="onFileUploadSuccess"
              :on-error="onFileUploadError">
              <div><span class="required"
                  v-if="typeObj.required">*</span>{{ typeObj.label }}</div>
            </scm-upload>
          </scm-dropdown-item>
        </scm-dropdown-menu>
      </scm-dropdown>
      <scm-upload v-if="(!innerBusinessTypeConfig
                  || innerBusinessTypeConfig.length) <= 0 && !readonly"
                  class="attachment-card__attachment-file-upload is-single"
                  :disabled="judgeLimit"
                  :action="fileUploadUrl"
                  :show-file-list="false"
                  :headers="uploadData"
                  multiple
                  :before-upload="beforeFileUpload"
                  :on-progress="onFileUploadProgress"
                  :on-success="onFileUploadSuccess"
                  :on-error="onFileUploadError">
        <span class="el-button--text" :class="[ judgeLimit ? 'disabled' : '']">
          上传附件
        </span>
      </scm-upload>
    </div>
    <scm-table :data="attachTableData"
      :control-layout="controlLayout"
      :before-delete-data="beforeDeleteButtonClick"
      :on-row-delete="attachTableRowDelete"
      @selection-change="onAttachTableSelectChange"
      @control-button-click="onControlButtonClick">
      <scm-table-column type="selection"
        width="55"></scm-table-column>
      <scm-table-column type="index"
        width="55"></scm-table-column>
      <scm-table-column label="文件名称">
        <template slot-scope="scope">
          <div class="attach-file-name-container">
            <scm-progress :text-inside="true"
              :stroke-width="24"
              :percentage="scope.row.percentage"
              :show-text="false"
              :color="scope.row.viStatus !== 'exception' ? 'rgba(231, 242, 249, 0.8)' : null"
              class="file-progress"></scm-progress>
            <scm-button type="text"
              @click="onFileDownload(scope.row)"
              :style="{
                color: scope.row.viStatus === 'exception' ? '#ff5252': null
              }"
              class="file-name">
              {{ scope.row.viFileName }}
            </scm-button>
          </div>
        </template>
      </scm-table-column>
      <scm-table-column label="文件类型"
        v-if="innerBusinessTypeConfig.length > 0">
        <template slot-scope="scope">
          {{ scope.row.viFileBusinessType.label }}
        </template>
      </scm-table-column>
      <scm-table-column label="上传人"
        width="220">
        <template slot-scope="scope">
          {{ getCreateAuthor(scope.row) }}
        </template>
      </scm-table-column>
      <scm-table-column prop="viCreateDatetime"
        label="上传时间"
        width="220">
      </scm-table-column>
      <scm-table-column
        label="操作"
        v-if="isShwoActionColumn"
        width="100">
        <template slot-scope="scope">
          <scm-button v-if="isImageFile(scope.row.fileExtension)"
                      type="text" @click="viewImg(scope.row)">预览</scm-button>
        </template>
      </scm-table-column>
    </scm-table>
    <form ref="downloadForm"
      :action="downloadURL"
      method="post"
      target="_blank">
    </form>
    <!-- <scm-upload
      class="attachment-file-upload"
      :action="fileUploadUrl"
      :show-file-list="false"
      :accept="uploadConfig && uploadConfig.accept"
      :before-upload="beforeFileUpload"
      :on-success="onFileUploadSuccess">
    </scm-upload> -->
    <scm-dialog
      title="图片预览"
      class="viewImgWrap"
      :visible.sync="viewImgVisible"
      width="80%"
      :before-close="viewImgDialogBeforClose">
      <img style="width: 100%" v-if="imgUrl" :src="imgUrl" />
    </scm-dialog>
  </scm-card>
</template>
<script>
import ScmSdk, {constants} from 'scm-sdk';
import _ from 'lodash';
import moment from 'moment';
const { SYSTEM_CATEGORY } = constants;

class AttachmentFileBean {
  constructor() {
    // 用于文件上传过程中能够找到指定的文件
    this.viFileUid = '';
    // 文件上传成功后服务端返回的文件ID
    this.viFileId = '';
    // 文件名称
    this.viFileName = '';
    // 文件URL
    this.viFileUrl = '';
    // { label: String, value: Object }
    this.viFileBusinessType = {};
    // 是否可以删除此文件
    // this.viIsCanDeleteFile = true;
    // 文件上传状态
    this.viStatus = null;
    // 文件上传人(为尽量不修改旧代码，默认使用姓名)
    this.viCreateAuthor = '';
    // 文件上传人ID
    this.viCreateAuthorId = '';
    // 文件上传人姓名
    this.viCreateAuthorName = '';
    // String || Number
    this.viCreateDatetime = '';
  }
}

export default {
  name: 'ScmAttachmentCard',
  props: {
    // 附件列表数据
    data: Array,
    // 卡片标题
    title: {
      type: String,
      default: '附件信息',
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
    readonly: Boolean,
    // 是否必须上传附件
    required: Boolean,
    // 是否隐藏标题
    hideTitle: Boolean,
    // Dropdown菜单自定义类名
    dropdownMenuCustomClass: String,
    // 最大上传文件数
    fileLimit: Number,
    // 是否显示操作列
    isShwoActionColumn: {
      type: Boolean,
      default: false,
    },
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
  },
  data() {
    return {
      currentAttachmentType: '',
      uploadingFileObject: {},
      addFileList: [],
      deleteFileList: [],
      multiSelections: [],
      downloadURL: '',
      selectFileType: null,
      imgUrl: '',
      viewImgVisible: false,
    };
  },
  computed: {
    uploadData() {
      const user = this.$store.getters['systemConfig/user'];
      const headers = { loginUserId: user.userId };
      let devToken = null;
      // 开发环境时，增加token信息
      if (process.env.NODE_ENV === 'development') {
        devToken = this.$store.getters['systemConfig/devToken'];
        if (devToken) {
          headers.AUTHSSOTGC = devToken;
        }
      }
      return headers;
    },
    attachTableData() {
      const propData = this.data || [];
      const list = this.addFileList.concat(propData);
      list.map((item) => {
        const i = item;
        const arr = i.viFileName.split('.');
        const fileExtension = arr[arr.length - 1];
        i.fileExtension = fileExtension;
        return i;
      });
      return list;
    },
    fileUploadUrl() {
      const url = ScmSdk.api.attachment.defaults.baseURL;
      return `${url}uploadFile?fileType=*`;
    },
    innerBusinessTypeConfig() {
      return this.businessTypeConfig || [];
    },
    controlLayout() {
      const ret = [
        {
          name: 'download',
          content: '批量下载',
        },
      ];
      if (!this.readonly) {
        ret.push({
          name: 'delete',
        });
      }
      // if (!this.readonly && this.innerBusinessTypeConfig.length === 0) {
      //   ret.unshift('add');
      // }
      return ret;
    },
    judgeLimit() {
      return [...this.data, ...this.addFileList].length >= this.fileLimit;
    },
  },
  watch: {
    data() {
      // data属性值变化的场合，重置状态
      this.uploadingFileObject = {};
      this.deleteFileList = [];
    },
  },
  methods: {
    isImageFile(fileExtension) {
      if (fileExtension === 'png' ||
          fileExtension === 'PNG' ||
          fileExtension === 'jpg' ||
          fileExtension === 'JPG' ||
          fileExtension === 'gif' ||
          fileExtension === 'GIF' ||
          fileExtension === 'jpeg' ||
          fileExtension === 'JPEG' ||
          fileExtension === 'dib' ||
          fileExtension === 'DIB' ||
          fileExtension === 'bmp' ||
          fileExtension === 'BMP') {
        return true;
      }
      return false;
    },
    viewImg(row) {
      console.log(row);
      if (row.viFileUrl) {
        const arr = row.viFileUrl.split('.');
        const fileExtension = arr[arr.length - 1];
        if (this.isImageFile(fileExtension)) {
          const arr1 = row.viFileUrl.split('/');
          this.imgUrl = `/${arr1.splice(3, arr1.length - 1).join('/')}`;
          this.viewImgVisible = true;
        }
      } else if (row.viFileId) {
        if (row.viFileId.indexOf('$V1$') !== -1) {
          let fileIdV1 = row.viFileId.split('@')[1];
          this.imgUrl = `/${SYSTEM_CATEGORY.HOMEPAGE}/CommonSystem-api/commonAcmFileStore/downloadWithGetItem//${fileIdV1}`;
          this.viewImgVisible = true;
        } else {
          this.$store.dispatch('mdm/fetchFileDetail', row.viFileId).then((res) => {
            this.imgUrl = `/${SYSTEM_CATEGORY.G4}/gateway/api-attachment/${res.data.data.list[0].fileUrl}`;
            this.viewImgVisible = true;
          });
        }
      }
    },
    viewImgDialogBeforClose() {
      this.imgUrl = '';
      this.viewImgVisible = false;
    },
    onFileDownload({ viFileId }) {
      // [Prod]修复当文件为3期文件，文件下载服务进行重定向导致文件无法下载的问题
      // 改为通过Form提交文件下载请求
      // this.downloadURL = `${ScmSdk.api.attachment.defaults.baseURL}downloadFile/${viFileId}`;
      this.downloadURL = `${ScmSdk.api.attachment.defaults.baseURL}downloadFileWithLog/${viFileId}/${this.uploadData.loginUserId}`;
      this.$nextTick(() => {
        this.$refs.downloadForm.submit();
      });
      // this.$store.dispatch('attachment/downloadFile', viFileId);
    },
    onAttachTableSelectChange(val) {
      this.multiSelections = val;
    },
    onControlButtonClick(iconName) {
      if (iconName === 'download') {
        const idArray = this.multiSelections.map(item => item.viFileId);
        this.$store.dispatch('attachment/downloadFiles', { idArray, ...this.uploadData });
      }
    },
    beforeDeleteButtonClick(selection) {
      return new Promise((resolve, reject) => {
        if (this.beforeFileDeleteFun(selection)) {
          this.$confirm('确定删除勾选的附件？', '提示')
            .then(() => {
              resolve(selection);
            })
            .catch(() => {});
        } else {
          reject();
        }
      });
    },
    /**
     * 文件上传之前的钩子
     */
    beforeFileUpload(file) {
      if (this.fileLimit && [...this.data, ...this.addFileList, [file]].length > this.fileLimit) {
        return false;
      }
      if (!this.beforeFileUploadFun(file, this.selectFileType)) {
        return false;
      }
      this.selectFileType = null;
      if (file && file.size === 0) {
        this.$message.error('不能上传大小为0的文件！');
        return false;
      }
      // 将文件添加到上传文件列表
      this.uploadingFileObject[file.uid] = {
        type: this.currentAttachmentType,
        file,
      };
      const bean = new AttachmentFileBean();
      bean.viFileName = file.name;
      bean.viFileUid = file.uid;
      bean.viFileBusinessType = this.currentAttachmentType;
      this.addFileList.push(bean);
      return true;
    },
    /**
     * 文件上传时的钩子
     */
    onFileUploadProgress(event, file) {
      this.updateFilePercentage(file);
    },
    /**
     * 更新文件上传进度
     */
    updateFilePercentage(file) {
      const bean = this.getFileByUID(this.addFileList, file.uid);
      if (bean) {
        bean.percentage = Math.floor(file.percentage);
        const list = this.addFileList;
        this.addFileList = [];
        this.addFileList = list;
      }
    },
    /**
     * 文件上传成功的钩子
     * @event
     */
    onFileUploadSuccess(response, file) {
      const f = file;
      f.percentage = 100;
      this.updateFilePercentage(f);
      const res = response;
      if (res && res.data) {
        res.data.uid = f.uid;
        const bean = this.updateFile(response, this.getFileBusinessType(f));
        this.emitAddFileChange(bean);
      }
    },
    clear() {
      this.addFileList = [];
      this.deleteFileList = [];
    },
    emitAddFileChange(currentFile) {
      const ret = [];
      this.addFileList.forEach((item) => {
        if (item.viStatus !== 'exception') {
          ret.push(item);
        }
      });
      this.$emit('attachment-add', currentFile, ret);
    },
    /**
     * 文件上传失败的钩子
     * @event
     */
    onFileUploadError(err, file) {
      let errorMessage = `文件 ${file.name} 上传失败。`;
      if (err && err.message) {
        try {
          const messageObj = JSON.parse(err.message);
          if (messageObj && messageObj.message) {
            const code = messageObj.code ? `${messageObj.code}: ` : '';
            errorMessage = `${code}${messageObj.message}`;
          }
        } catch (error) {
          // do nothing
        }
      }
      this.$message.error(errorMessage);

      const errorFileIndex = _.findIndex(
        this.addFileList,
        addFile => addFile.viFileUid === file.uid,
      );
      if (errorFileIndex !== -1) {
        this.addFileList.splice(errorFileIndex, 1);
      }
      const list = this.addFileList;
      this.addFileList = [];
      this.addFileList = list;
    },
    /**
     * 上传的文件业务类型菜单点击事件处理
     * @event
     */
    onAttachmentMenuClick(command) {
      this.currentAttachmentType = command;
      this.innerBusinessTypeConfig.forEach((item) => {
        if (item.value === command) {
          this.selectFileType = item;
        }
      });
    },
    /**
     * 删除附件事件处理
     * @event
     */
    attachTableRowDelete(data) {
      if (data && data.length > 0) {
        data.forEach((fileInfo) => {
          this.deleteFile(fileInfo);
        });
      }
    },
    getFileBusinessType(file) {
      let ret = '';
      const retFile = this.uploadingFileObject[file.uid];
      if (retFile) {
        const businessTypeValue = retFile.type;
        const config = this.getFileBusinessTypeConfig(businessTypeValue);
        ret = {
          label: config.label,
          value: config.value,
        };
        delete this.uploadingFileObject[file.uid];
      }
      return ret;
    },
    /**
     * 取得对应的文件业务类型对象
     * { label: String, value: Object }
     */
    getFileBusinessTypeConfig(value) {
      let ret = {};
      const configIndex = _.findIndex(
        this.innerBusinessTypeConfig,
        config => config.value === value,
      );
      if (configIndex !== -1) {
        const config = this.innerBusinessTypeConfig[configIndex];
        ret = {
          label: config.label,
          value: config.value,
        };
      }
      return ret;
    },
    /**
     * 取得上传文件设置信息
     */
    getFileUploadConfig(value) {
      const uploadConfig = this.uploadConfig || {};
      if (this.innerBusinessTypeConfig.length > 0 && value) {
        const configIndex = _.findIndex(
          this.innerBusinessTypeConfig,
          config => config.value === value,
        );
        if (configIndex !== -1) {
          return (
            this.innerBusinessTypeConfig[configIndex].uploadConfig ||
            uploadConfig
          );
        }
      }
      return uploadConfig;
    },
    /**
     * 上传成功后更新文件信息
     */
    updateFile({ data }, type) {
      const { addFileList } = this;
      const bean = this.getFileByUID(addFileList, data.uid);
      bean.detail = data;
      bean.viFileId = data.id;
      bean.viFileName = data.fileName;
      bean.viFileUrl = data.fileUrl;
      bean.viFileBusinessType = type;
      bean.viCreateAuthor = this.$store.getters[
        'systemConfig/user'
      ].employeeName;
      bean.viCreateAuthorId = data.createBy;
      bean.viCreateAuthorName = this.$store.getters[
        'systemConfig/user'
      ].employeeName;
      bean.viCreateDatetime = data.createTime
        ? this.data2String(data.createTime)
        : '';
      return bean;
    },
    getFileByUID(fileList, uid) {
      const index = _.findIndex(fileList, item => item.viFileUid === uid);
      if (index !== -1) {
        return fileList[index];
      }
      return null;
    },
    deleteFile(fileInfo) {
      // 根据fileId信息查找文件
      const addFileIndex = _.findIndex(
        this.addFileList,
        file => file.viFileId === fileInfo.viFileId,
      );
      // 删除的文件不是新增的文件的场合
      if (addFileIndex === -1) {
        // 将删除的文件添加至文件删除列表
        this.deleteFileList.push(fileInfo);
        // 在data数据中查找希望删除的数据
        const dataIndex = _.findIndex(
          this.data,
          file => file.viFileId === fileInfo.viFileId,
        );
        // 从data数据源中删除数据
        if (dataIndex !== -1) {
          this.data.splice(dataIndex, 1);
        }
      } else {
        this.addFileList.splice(addFileIndex, 1);
        this.emitAddFileChange(fileInfo);
        this.deleteFileList.push(fileInfo);
      }
      this.$emit('attachment-delete', fileInfo, this.deleteFileList);
    },
    data2String(timestamp) {
      // 返回字符串格式日期的场合
      if (typeof timestamp === 'string') {
        return timestamp;
      }
      return moment(new Date(timestamp)).format('YYYY-MM-DD HH:mm:ss');
    },
    getCreateAuthor(row) {
      return row.viCreateAuthorName
        ? row.viCreateAuthorName
        : row.viCreateAuthor;
    },
    validate() {
      const isExistUploadingFile = this.addFileList.some(item => item.percentage !== 100);
      if (isExistUploadingFile) {
        this.$message.error('文件正在上传中，请稍后...');
        return false;
      }
      if (this.required && this.attachTableData.length === 0) {
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.scm-attachment-card {
  .viewImgWrap{
    /deep/ {
      .el-dialog__body{
        max-height: none;
      }
    }
  }
  .clearBoth {
    position: relative;
    &::after {
      content: '';
      clear: both;
      display: block;
      height: 0;
      overflow: hidden;
      visibility: hidden;
    }
  }
  .is-required {
    &:before {
      content: "*";
      color: #ff5252;
      margin-right: 4px;
    }
  }
    .shadow {
    width: 80px;
    height: 25px;
    position: absolute;
    right: -5px;
    top: 0px;
    z-index: 1;
    cursor: not-allowed;
  }

  .el-button--text.disabled {
    color: #d0d0d0;
      cursor: not-allowed;
  }
    .el-dropdown-link {
    &.disabled i{
      color: #d0d0d0;
      cursor: not-allowed;
    }
  }

  .attachment-menu {
    float: right;

    .attachment-menu-dropdown {
      .attachment-label {
        font-size: 12px;
      }

      .el-svg-icon {
        vertical-align: middle;
      }
    }
  }
  .attach-file-name-container {
    position: relative;

    .file-name {
      padding: 0;
      line-height: 17px;
      height: 17px;
      position: absolute;
      top: 2px;
      left: 0;
      z-index: 10;
    }

    .file-progress {
      margin-left: -10px;
      margin-right: -5px;

      /deep/ {
        .el-progress-bar {
          .el-progress-bar__outer {
            border-radius: 2px;
            background-color: transparent;

            .el-progress-bar__inner {
              border-radius: 2px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.attachment-card__attachment-file-upload {
  .el-upload {
    width: 100%;
  }
  .required {
    color: #f00;
    padding-right: 2px;
  }
  &.is-single {
    float: right;
  }
}
</style>
