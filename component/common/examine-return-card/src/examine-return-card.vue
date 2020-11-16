<template>
  <div>
    <!-- 提交审批 & 审批驳回  s-->
    <scm-card class="mg-t-15"
              separator-class="el-icon-arrow-right">
      <div slot="header"
           class="clearfix">
        <span>提交处理</span>
      </div>
      <scm-form ref="submitForm"
                :model="dataInfo">
        <scm-row>
          <scm-col :span="11">
            <scm-form-item label="可选流程">
              <template>
                <scm-select v-model="dataInfo.viBusn"
                            placeholder=""
                            @change="getExamineStart"
                            class="w-100">
                  <scm-option v-for="item in dataInfo.viModelName"
                              :key="item.modelKey"
                              :label="item.modelName"
                              :value="item.modelKey">
                  </scm-option>
                </scm-select>
              </template>
            </scm-form-item>
            <div>
              <scm-row>
                <scm-col :span="12">
                  <span>
                    审批意见
                  </span>
                </scm-col>
                <scm-col :span="12">
                  <scm-popover placement="top"
                               trigger="hover"
                               content="添加审批意见为常用批语">
                    <i type="primary"
                       slot="reference"
                       class="el-icon-plus add-examine"
                       @click="onAddCriticize"></i>
                  </scm-popover>
                </scm-col>
              </scm-row>
            </div>
            <scm-input v-model.trim="dataInfo.approveOpinion"
                       class="textareaReply2"
                       maxLength="160"
                       type="textarea"
                       :rows="2">
            </scm-input>
            <div class="textarea-bottom">
                       <span style="margin-right:2px">{{input}}</span>
                       <span>/160</span></div>
          </scm-col>
          <scm-col :span="12"
                   class="flt-r">
            <scm-row>
              <scm-col :span="10">
                <scm-form-item label="下一路径"
                               prop="viTargetNode"
                               class="examine-Leader-submit">
                  <template>
                    <scm-select v-model="dataInfo.viTargetNode"
                                placeholder=""
                                @change="getNextNodesChangeSubmit"
                                class="w-220">
                      <scm-option v-for="item in dataInfo.options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                      </scm-option>
                    </scm-select>
                  </template>
                </scm-form-item>
              </scm-col>
              <scm-col :span="10">
                <scm-form-item label="下一处理人"
                               prop="viTitle"
                               class="examine-Leader-submit">
                  <template>
                    <scm-select v-model="dataInfo.viTitle"
                                @change="getNodeRolechange"
                                class="w-220">
                      <scm-option v-for="item in dataInfo.options1"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                      </scm-option>
                    </scm-select>
                  </template>
                </scm-form-item>
              </scm-col>
            </scm-row>
            <span>
              常用批语
            </span>
            <div class="div-criticize2">
              <div v-for="(item, index) in dataInfo.viCriticize"
                   @mouseover="selectStyle(item)"
                   :class="{'active':item.active}"
                   @mouseout="outStyle(item)"
                   :key=index
                   class="div-hover c-value">
                <scm-row>
                  <scm-col :span="18">
                    <div class="c-add"
                         @dblclick="onEditor(index)">{{item.content}}
                    </div>
                  </scm-col>
                  <scm-col :span="6">
                    <i class="el-icon-delete c-del"
                       v-show="item.active"
                       @click="onDeleteRow(index)">
                    </i>
                  </scm-col>
                </scm-row>
              </div>
            </div>
          </scm-col>
        </scm-row>
      </scm-form>
    </scm-card>
  </div>
</template>
<script>
import { StoreGlobalAPI } from 'scm-sdk';
import _ from 'lodash';

const FETCH_EXAMINE_ACTION = 'mdm/fetchExamine';
const FETCH_GETNEXTNODES_ACTION = 'mdm/fetchGetNextNodes';
const FETCH_GETNODEROLE_ACTION = 'mdm/fetchGetNodeRole';
const FETCH_DELETEROW_SERVICE = 'mdm/deleteRow';
const FETCH_EDITOR_SERVICE = 'mdm/editor';
const FETCH_NODENOLE_SERVICE = 'mdm/updateNodeNole';
const FETCH_GETNODE_SERVICE = 'mdm/updateGetNode';
const FETCH_EXAMINESTART_SERVICE = 'mdm/updateExamineStart';
const FETCH_GETSTARTNODE_ACTION = 'mdm/fetchGetStartNode';
const FETCH_COMMONLIST_ACTION = 'mdm/fetchCommonList';
const FETCH_ADDCOMMONLIST_ACTION = 'mdm/fetchAddCommonList';
const FETCH_DELETECOMMONLIST_ACTION = 'mdm/fetchDeleteCommonList';

export default {
  name: 'ScmExamineSelect',
  computed: {
    ...StoreGlobalAPI.mapState({
      examine: state => state.mdm.examine,
      dataInfo: state => state.mdm.examine.dataInfo,
      ifPermission: state => state.mdm.examine.ifPermission,
    }),
  },
  data() {
    return {
      condition: {
        viRadio: true,
        procInstId: null,
        taskName: '',
        modelKey: '',
        viApproveUserId: '',
        viApproveOpinion: '',
        viId: '',
        radio: false,
      },
      input: 160,
      count: 0,
      count1: 0,
      viAddrCode: null,
    };
  },
  props: {
    updateUserId: {
      type: String,
    },
    procInstId: {
      type: String,
    },
    modelName: {
      type: Array,
    },
    addrCode: { // 省码
      type: String,
    },
    cityCode: { // 地市码
      type: String,
    },
  },
  created() {
    this.examine.checkField.startNode = '请选择可选流程';
    this.examine.checkField.targetNode = '下一路径不能为空';
    this.examine.checkField.title = '下一处理人不能为空';
    if (!_.isEmpty(this.modelName)) {
      this.count += 1;
      this.fetchGetStartNode(this.condition);
    }
    this.fetchCommonList();
  },
  destroyed() {
    this.dataInfo.options = [];
    this.dataInfo.options1 = [];
    this.dataInfo.viModelName = [];
    this.dataInfo.viBusn = '';
    this.dataInfo.viTargetNode = '';
    this.dataInfo.viTitle = '';
    this.count = 0;
    this.count1 = 0;
  },
  watch: {
    'dataInfo.approveOpinion': {
      handler(newValue) {
        this.changeText(newValue);
        this.saveApprove();
      },
    },
    // 监听市码不为空得情况形式为addrCode_cityCode
    cityCode: {
      handler(newPro) {
        if (_.isEmpty(this.addrCode)) {
          return;
        }
        if (_.isEmpty(newPro)) {
          this.viAddrCode = this.addrCode;
        } else {
          this.viAddrCode = `${this.addrCode}_${newPro}`;
        }
      },
      immediate: true,
    },
    modelName() {
      if (!_.isEmpty(this.modelName) && this.count < 1) {
        this.fetchGetStartNode(this.condition);
      }
    },
  },
  methods: {
    outStyle(item) {
      this.$set(item, 'active', false);
    },
    selectStyle(item) {
      const self = this;
      this.$nextTick(() => {
        this.dataInfo.viCriticize.forEach((v) => {
          self.$set(v, 'active', false);
        });
        this.$set(item, 'active', true);
      });
    },
    onAddCriticize() {
      this.condition.viApproveOpinion = this.dataInfo.approveOpinion;
      this.fetchAddCommonList(this.condition);
      if (!this.condition.viApproveOpinion) {
        this.$message('添加常用批语不能为空');
      } else {
        this.$message.success('添加成功');
      }
    },
    onDeleteRow(index) {
      this.condition.viId = this.dataInfo.viCriticize[index].id;
      this.$store.commit(FETCH_DELETEROW_SERVICE, index);
      this.fetchDeleteCommonList(this.condition);
    },
    onEditor(index) {
      this.$store.commit(FETCH_EDITOR_SERVICE, index);
      this.input = 160 - this.dataInfo.approveOpinion.length;
    },
    onFormSubmit() {
      this.fetchExamine();
    },
    saveApprove() {
      this.examine.data.approveOpinion = this.dataInfo.approveOpinion;
    },
    changeText(val) {
      this.input = 160 - val.length;
    },
    getExamineStart(val) {
      this.count1 += 1;
      this.dataInfo.viModelName.forEach((v) => {
        if (val === v.modelKey) {
          this.dataInfo.options = [];
          this.dataInfo.options1 = [];
          this.$store.commit(FETCH_EXAMINESTART_SERVICE);
          this.dataInfo.viTargetNode = '';
          this.dataInfo.viTitle = '';
          this.condition.modelKey = val;
          if (!v.procInstId) {
            this.fetchExamine(this.condition);
          } else {
            this.condition.procInstId = v.procInstId;
            this.fetchGetNextNodes(this.condition);
          }
        }
      });
    },
    getNextNodesChangeSubmit(val) {
      const params = this.examine.data;
      this.examine.data.nextNode = val;
      params.signDtos = [];
      this.dataInfo.options.forEach((v) => {
        if (v.value === val) {
          this.condition.taskName = v.label;
          this.condition.modelKey = v.modelKey;
          this.condition.viApproveUserId = v.approveUserId;
          params.type = v.type;
          params.modelKey = v.modelKey;
          params.signDtos.push({
            taskName: v.label,
            taskType: v.taskType,
            receiveUserId: null,
            id: v.id,
          });
        }
      });
      if (this.dataInfo.options.length === 1) {
        params.signDtos[0].receiveUserId = this.dataInfo.options1[0].value;
      }
      if (this.dataInfo.options.length > 1) {
        this.dataInfo.options1 = [];
        this.dataInfo.viTitle = '';
        this.fetchGetNodeRole(this.condition);
      }
      this.$store.commit(FETCH_GETNODE_SERVICE);
    },
    getNodeRolechange(val) {
      this.examine.data.signDtos[0].receiveUserId = val;
      this.$store.commit(FETCH_NODENOLE_SERVICE);
    },
    fetchExamine(params = {}) {
      const { updateUserId } = this;
      this.$store.dispatch(FETCH_EXAMINE_ACTION, {
        updateUserId,
        ...params,
      }).then(() => {
        if (this.dataInfo.options.length === 1 && this.modelName) {
          this.condition.taskName = this.dataInfo.options[0].label;
          this.fetchGetNodeRole(this.condition);
        }
      });
    },
    fetchGetNextNodes(params = {}) {
      this.$store.dispatch(FETCH_GETNEXTNODES_ACTION, {
        ...params,
      }).then(() => {
        if (this.dataInfo.options.length === 1) {
          this.condition.taskName = this.dataInfo.options[0].label;
          this.condition.modelKey = this.dataInfo.options[0].modelKey;
          this.fetchGetNodeRole(this.condition);
        }
      }).then(() => {
        if (!_.isEmpty(this.procInstId) && this.count1 < 1) {
          this.condition.modelKey = this.dataInfo.options[0].modelKey;
          this.dataInfo.viModelName.forEach((v) => {
            if (v.modelKey === this.dataInfo.options[0].modelKey) {
              this.dataInfo.viBusn = v.modelName;
              this.examine.checkField.startNode = '';
            }
          });
        }
      });
    },
    fetchGetStartNode() {
      const { updateUserId, modelName, viAddrCode } = this;
      this.$store.dispatch(FETCH_GETSTARTNODE_ACTION, {
        loginUserId: updateUserId,
        modelName,
        viAddrCode,
      }).then(() => {
        if (this.dataInfo.viModelName.length === 1 && !this.procInstId) {
          this.condition.modelKey = this.dataInfo.viModelName[0].modelKey;
          this.fetchExamine(this.condition);
        }
      }).then(() => {
        if (!_.isEmpty(this.procInstId)) {
          this.condition.procInstId = this.procInstId;
          this.$nextTick(() => {
            this.fetchGetNextNodes(this.condition);
          });
        }
      });
    },
    fetchGetNodeRole(params = {}) {
      const { updateUserId, viAddrCode } = this;
      this.$store.dispatch(FETCH_GETNODEROLE_ACTION, {
        updateUserId,
        ...params,
        viAddrCode,
      });
    },
    fetchCommonList() {
      const { updateUserId } = this;
      this.$store.dispatch(FETCH_COMMONLIST_ACTION, {
        userId: updateUserId,
      });
    },
    fetchAddCommonList(params = {}) {
      const { updateUserId } = this;
      this.$store.dispatch(FETCH_ADDCOMMONLIST_ACTION, {
        userId: updateUserId,
        ...params,
      });
    },
    fetchDeleteCommonList(params = {}) {
      this.$store.dispatch(FETCH_DELETECOMMONLIST_ACTION, {
        ...params,
      });
    },
  },
};
</script>
<style lang="scss">
.add-examine {
  float: right;
  color: #0085d0;
  font-size: 14px;
}
.examine-Leader {
  margin-bottom: 5px !important;
  .el-form-item__content {
    width: 216px !important;
    input {
      width: 216px;
    }
  }
}
.examine-Leader-submit {
  .el-form-item__content {
    width: 220px !important;
  }
}
.criticize {
  margin-top: 0px;
  float: right;
}
 .textareaReply2 {
  margin-top: 7px !important;
  height: 103px;
  .el-textarea__inner {
    margin-top:0px !important;
    height: 103px !important;
    width: 100%;
    resize: none;
  }
}
.textareaReply1 {
  margin-top: 7px !important;
  height: 172px;
  .el-textarea__inner {
    margin-top:0px !important;
    height: 172px !important;
    width: 100%;
    resize: none;
  }
}
.textarea-bottom {
  float:right;
  font-size: 10px;
  color: #999999;
  .el-input {
    width:24px;
     input {
       padding:0px;
       border:0px;
        width:24px;
        background: transparent;
     }
  }
}
.div-criticize2 {
  border: 1px solid #d0d0d0;
  height: 101px;
  margin-top: 7px !important;
  overflow: auto;
}
.div-criticize1 {
  border: 1px solid #d0d0d0;
  height: 170px;
  margin-top: 7px !important;
  overflow: auto;
}
.div-hover:hover {
  background: #e6f3fb;
}
.c-value {
  padding-left: 11px;
  padding-right: 11px;
  padding-top: 9px;
  padding-bottom: 9px;
}
.c-add {
  font-size: 13px;
}
.c-add:hover {
  cursor: pointer;
}
.c-del {
  float: right;
  color: #0085d0;
  font-size: 18px;
}
.flt-r {
  float: right;
  .w-220 {
    width: 220px;
  }
}
.w-100 {
  width: 100%;
}
.el-popover {
  background-color: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  padding: 3px;
  text-align: center;
}
</style>
