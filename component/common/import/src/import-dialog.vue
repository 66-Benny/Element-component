<template>
  <div>
    <scm-input class="upload-input" v-model="fileName" readonly></scm-input>
    <scm-upload
      ref="upload"
      class="upload-btn"
      :action="url"
      :headers="headerParam"
      :file-list="fileList"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChange"
      :on-success="onFileUploadSuccess"
      :on-error="onFileUploadError">
      <scm-button size="mini" type="primary">选择文件</scm-button>
    </scm-upload>
    <div class="import-btn">
      <scm-button v-if="showAppend"
        size="mini" type="primary" @click="onImport('append')">追加</scm-button>
      <scm-button class="cover" size="mini" type="primary" @click="onImport('cover')">
        覆盖导入
      </scm-button>
    </div>
    <scm-table
      :data="errMsgData"
      stripe
      class="err-table"
      tooltip-effect="dark">
      <scm-table-column
        show-overflow-tooltip
        prop="msg"
        label="错误信息">
      </scm-table-column>
    </scm-table>
    <!-- <div class="errMsg">{{errMsgData}}</div> -->
  </div>
</template>

<script>
export default {
  name: 'ScmImportDialog',
  data() {
    return {
      errMsgData: [],
      fileList: [],
      fileName: '',
      type: '',
    };
  },
  props: {
    param: Object,
    url: String,
    saveService: String,
    showAppend: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    headerParam() {
      const user = this.$store.getters['systemConfig/user'];
      return {
        loginUserId: user.userId,
        loginAddrCode: user.addrCode,
      };
    },
  },
  methods: {
    handleChange(file) {
      this.fileName = file.name;
      this.fileList = [];
      this.fileList.push(file);
    },
    onImport(flg) {
      if (flg === 'append') {
        this.type = '0';
      } else if (flg === 'cover') {
        this.type = '1';
      }
      this.$refs.upload.submit();
    },
    /**
     * 文件上传成功的钩子
     * @event
     */
    onFileUploadSuccess(response) {
      if (response.data.batch) {
        const params = {
          ...this.param,
          type: this.type,
          batch: response.data.batch,
        };
        let msg = '';
        if (this.type === '0') {
          msg = '是否确认追加导入？';
        } else {
          msg = '是否确认覆盖导入？';
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$store.dispatch(this.saveService, params).then(() => {
            this.$emit('initProTable');
          });
        }).catch(() => {});
      } else if (response.data && response.data.list) {
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
      if (response.data && response.data.list) {
        this.errMsgData = response.data.list;
      } else {
        this.$message({
          fullscreen: true,
          type: 'error',
          message: '导入失败',
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-input {
  width: 220px;
}
.upload-btn {
  display: inline-block;
}
.el-upload {
  width:  100px;
  .el-button--mini.is-round {
    width:  80px;
    margin: 0 10px;
  }
}
.import-btn {
  display: inline-block;
  .cover {
    width: 80px;
    margin: 0 10px;
  }
}
.errMsg {
  border: 1px solid #d0d0d0;
  width: 100%;
  height: 300px;
  margin-top: 10px;
}
.err-table {
  width: 100%;
  margin-top: 10px;
}
</style>
