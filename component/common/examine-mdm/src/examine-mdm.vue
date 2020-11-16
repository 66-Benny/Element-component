<template>
  <div>
    <scm-card class="mg-t-15"
              separator-class="el-icon-arrow-right"
              v-show="isShowExamine === false">
      <div slot="header"
           class="clearfix">
        <span>审批处理</span>
      </div>
      <scm-form ref="dataInfoLeader"
                @submit.native="onFormSubmit"
                :model="dataInfoLeader">
        <scm-row>
          <scm-col :span="5">
            <scm-form-item label=""
                            class="examine-Leader">
            <div style="line-height:1.36;margin-bottom:7px">审批结果</div>
              <scm-radio-group v-model="condition.viRadio"
                               @change="handleRadioChange"
                               class="mg-b-10">
                <scm-radio :label="true">审批通过</scm-radio>
                <scm-radio :label="false">审批不通过</scm-radio>
              </scm-radio-group>
            </scm-form-item>
            <scm-form-item label=""
                           prop="viTargetNode"
                           v-show="condition.viRadio===true &&
                            dataInfoLeader.isShowNextNodes1 === true"
                           class="mg-b-20 examine-Leader">
              <template>
                <div>下一路径</div>
                <scm-select v-model="dataInfoLeader.viTargetNode"
                            @change="getNextNodesChange"
                            placeholder="">
                  <scm-option v-for="(item, index) in dataInfoLeader.options"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
              </template>
            </scm-form-item>
            <scm-form-item label=""
                           prop="viRejectNode"
                           v-show="condition.viRadio === false && dataInfoLeader.isShowNextNodes2"
                           class="mg-b-20 examine-Leader">
              <template>
                <div>退回路径</div>
                <scm-select v-model="dataInfoLeader.viRejectNode"
                             @change="getNextNodesChange"
                            placeholder="">
                  <scm-option v-for="(item, index) in dataInfoLeader.options3"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
              </template>
            </scm-form-item>
            <scm-form-item label=""
                           prop="viTitle"
                           class="mg-b-20 examine-Leader"
                           v-show="this.isShowNextNodes &&
                            condition.viRadio===true && dataInfoLeader.isShowNextNodes1">
              <template>
                <div>下一处理人</div>
                <scm-select v-model="dataInfoLeader.viTitle"
                            @change="getNodeRolechange"
                            placeholder="">
                  <scm-option v-for="(item, index) in dataInfoLeader.options1"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
              </template>
            </scm-form-item>
            <scm-form-item label=""
                           v-show="condition.viRadio === true &&
                            dataInfoLeader.isShowNextNodes1 === false"
                           class="mg-b-20 examine-Leader">
              <template>
                <scm-alert title="没有可选下一路径"
                           type="info"
                           :closable="false">
                </scm-alert>
              </template>
            </scm-form-item>
            <scm-form-item label=""
                           prop="viTitle1"
                           class="mg-b-20 examine-Leader"
                           v-show="condition.viRadio===false && dataInfoLeader.isShowNextNodes2">
              <template>
                <div>下一处理人</div>
                <scm-select v-model="dataInfoLeader.viTitle1"
                            @change="getNodeRolechange"
                            placeholder="">
                  <scm-option v-for="(item, index) in dataInfoLeader.options2"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
              </template>
            </scm-form-item>
            <scm-form-item label=""
                           v-show="condition.viRadio === false &&
                            dataInfoLeader.isShowNextNodes2 === false"
                           class="mg-b-20 examine-Leader">
              <template>
                <scm-alert title="没有可选退回路径"
                           type="info"
                           :closable="false">
                </scm-alert>
              </template>
            </scm-form-item>
          </scm-col>
          <scm-col :span="9">
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
            <scm-input v-model.trim="dataInfoLeader.approveOpinion"
                       class="textareaReply1"
                       maxLength="160"
                       type="textarea"
                       :rows="2">
            </scm-input>
            <div class="textarea-bottom">
                       <span style="margin-right:2px">{{input}}</span>
                       <span>/160</span></div>
          </scm-col>
          <scm-col :span="9"
                   class="criticize">
            <span>
              常用批语
            </span>
            <div class="div-criticize1">
              <div v-for="(item, index) in dataInfoLeader.viCriticize"
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
    <!-- 领导审批 e -->

    <!-- 提交审批 & 审批驳回  s-->
    <scm-card class="mg-t-15"
              separator-class="el-icon-arrow-right"
              v-show="isShowExamine === true">
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
                            :disabled="isDisabled"
                            placeholder=""
                            @change="getExamineStart"
                            class="w-100">
                  <scm-option v-for="(item, index) in dataInfo.viModelName"
                              :key="index"
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
                      <scm-option v-for="(item, index) in dataInfo.options"
                                  :key="index"
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
                      <scm-option v-for="(item, index) in dataInfo.options1"
                                  :key="index"
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
const FETCH_GETNEXTNODESLEADER_ACTION = 'mdm/fetchGetNextNodesLeader';
const FETCH_GETNODEROLE_ACTION = 'mdm/fetchGetNodeRole';
const FETCH_GETNODEROLETRUE_ACTION = 'mdm/fetchGetNodeRoleTrue';
const FETCH_DELETEROW_SERVICE = 'mdm/deleteRow';
const FETCH_EDITOR_SERVICE = 'mdm/editor';
const FETCH_UPDATEISSHOWEXAMINE_SERVICE = 'mdm/updateIsShowExamine';
const FETCH_NODENOLE_SERVICE = 'mdm/updateNodeNole';
const FETCH_GETNODE_SERVICE = 'mdm/updateGetNode';
const FETCH_EXAMINESTART_SERVICE = 'mdm/updateExamineStart';
const FETCH_CHANGEIFAGREE_ACTION = 'mdm/changeIfAgrees';
const FETCH_GETSTARTNODE_ACTION = 'mdm/fetchGetStartNode';
const FETCH_GETCURRENTNODE_ACTION = 'mdm/fetchGetCurrentNode';
const FETCH_COMMONLIST_ACTION = 'mdm/fetchCommonList';
const FETCH_ADDCOMMONLIST_ACTION = 'mdm/fetchAddCommonList';
const FETCH_DELETECOMMONLIST_ACTION = 'mdm/fetchDeleteCommonList';
const FETCH_GETNODEROLEFALSE_ACTION = 'mdm/fetchGetNodeRoleFalse';
export default {
  name: 'ScmExamineSelect',
  computed: {
    ...StoreGlobalAPI.mapState({
      examine: state => state.mdm.examine,
      dataInfo: state => state.mdm.examine.dataInfo,
      dataInfoLeader: state => state.mdm.examine.dataInfoLeader,
      isShowNextNodes: state => state.mdm.examine.dataInfoLeader.isShowNextNodes,
      ifPermission: state => state.mdm.examine.ifPermission,
    }),
  },
  data() {
    return {
      condition: {
        viRadio: true,
        procInstId: '',
        taskName: '',
        modelKey: '',
        viApproveUserId: '',
        viApproveOpinion: '',
        viId: '',
        radio: false,
      },
      input: 160,
      viAddrCode: null,
    };
  },
  props: {
    updateUserId: { // 更新人ID（提交审批页面必传）
      type: String,
    },
    procInstId: { // 流程ID（领导审批页面必传）
      type: String,
    },
    modelName: { // 流程名字 （提交审批页面必传）
      type: Array,
    },
    isDisabled: { // 是否可编辑
      type: Boolean,
      default: false,
    },
    isShowExamine: { // 是否可显示（用于提交审批和领导审批页面显示或隐藏）
      required: true,
      type: Boolean,
      default: false,
    },
    receiveUserIdAutoFlag: {
      type: Number,
    },
    receiveUserList: {
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
    if (!this.isShowExamine) {
      // this.fetchGetNextNodesLeader(this.condition);
      // this.$store.commit(FETCH_CHANGEIFAGREE_ACTION, this.condition.viRadio);
      // this.fetchGetCurrentNode(this.condition);
    } else if (this.isDisabled && (!_.isEmpty(this.modelName)) && this.isShowExamine) {
      this.examine.checkField.startNode = '';
      this.condition.procInstId = this.procInstId;
      this.fetchGetStartNode(this.condition);
    } else if (!_.isEmpty(this.modelName) && this.isShowExamine) {
      this.fetchGetStartNode(this.condition);
    }
    this.fetchCommonList();
    if (this.isShowExamine) {
      this.dataInfo.approveOpinion = '请审批';
      this.examine.data.approveOpinion = this.dataInfo.approveOpinion;
      this.input = 160 - this.dataInfo.approveOpinion.length;
    } else {
      this.input = 160 - this.dataInfoLeader.approveOpinion.length;
    }
  },
  destroyed() {
    this.dataInfoLeader.options = [];
    this.dataInfoLeader.options1 = [];
    this.dataInfoLeader.options2 = [];
    this.dataInfoLeader.options3 = [];
    this.dataInfo.options = [];
    this.dataInfo.options1 = [];
    this.dataInfo.viModelName = [];
    this.dataInfo.viBusn = '';
    this.dataInfo.viTargetNode = '';
    this.dataInfo.viTitle = '';
  },
  watch: {
    'dataInfoLeader.approveOpinion': {
      handler(newValue) {
        this.changeText(newValue);
        this.saveApproveLeader();
      },
    },
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
      if (!_.isEmpty(this.modelName) && this.isShowExamine) {
        this.fetchGetStartNode(this.condition);
      }
    },
    procInstId: {
      handler(newPro) {
        this.condition.procInstId = newPro;
        if (!_.isEmpty(this.procInstId) && !this.isDisabled) {
          this.fetchGetNextNodesLeader(this.condition);
          this.$store.commit(FETCH_CHANGEIFAGREE_ACTION, this.condition.viRadio);
          this.fetchGetCurrentNode(this.condition);
        }
        if (this.isDisabled) {
          this.fetchGetNextNodes(this.condition);
        }
      },
      immediate: true,
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
      if (this.isShowExamine) {
        this.condition.viApproveOpinion = this.dataInfo.approveOpinion;
      } else {
        this.condition.viApproveOpinion = this.dataInfoLeader.approveOpinion;
      }
      this.$store.commit(FETCH_UPDATEISSHOWEXAMINE_SERVICE, this.isShowExamine);
      if (!this.condition.viApproveOpinion) {
        this.$message({
          showClose: true,
          message: '请输入审批意见!',
          type: 'warning',
        });
      } else {
        this.fetchAddCommonList(this.condition).then(() => {
          this.$message({
            fullscreen: true,
            type: 'success',
            message: '添加成功',
          });
        });
      }
    },
    handleRadioChange(val) {
      this.condition.viRadio = val;
      this.$store.commit(FETCH_CHANGEIFAGREE_ACTION, this.condition.viRadio);
      this.input = 160 - this.dataInfoLeader.approveOpinion.length;
    },
    onDeleteRow(index) {
      this.$confirm('您确定要删除该常用批语吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        if (this.isShowExamine) {
          this.condition.viId = this.dataInfo.viCriticize[index].id;
        } else {
          this.condition.viId = this.dataInfoLeader.viCriticize[index].id;
        }
        this.$store.commit(FETCH_UPDATEISSHOWEXAMINE_SERVICE, this.isShowExamine);
        this.$store.commit(FETCH_DELETEROW_SERVICE, index);
        this.fetchDeleteCommonList(this.condition);
        this.$message({
          type: 'success',
          message: '常用批语被删除',
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    onEditor(index) {
      this.$store.commit(FETCH_UPDATEISSHOWEXAMINE_SERVICE, this.isShowExamine);
      this.$store.commit(FETCH_EDITOR_SERVICE, index);
      if (this.isShowExamine) {
        this.input = 160 - this.dataInfo.approveOpinion.length;
      } else {
        this.input = 160 - this.dataInfoLeader.approveOpinion.length;
      }
    },
    onFormSubmit() {
      this.fetchExamine();
    },
    saveApprove() {
      this.examine.data.approveOpinion = this.dataInfo.approveOpinion;
    },
    saveApproveLeader() {
      this.examine.data.approveOpinion = this.dataInfoLeader.approveOpinion;
    },
    changeText(val) {
      this.input = 160 - (val ? val.length : 0);
    },
    getExamineStart(val) {
      this.dataInfo.viModelName.forEach((v) => {
        if (val === v.modelKey) {
          this.dataInfo.options = [];
          this.dataInfo.options1 = [];
          this.$store.commit(FETCH_EXAMINESTART_SERVICE);
          this.dataInfo.viTargetNode = '';
          this.dataInfo.viTitle = '';
          this.condition.modelKey = val;
          if (_.isEmpty(v.procInstId)) {
            this.fetchExamine(this.condition);
          } else {
            this.condition.procInstId = v.procInstId;
            this.fetchGetNextNodes(this.condition);
          }
        }
      });
    },
    getNextNodesChange(val) {
      const params = this.examine.data;
      if (this.dataInfoLeader.options.length !== 1) {
        this.dataInfoLeader.viTitle = '';
        this.dataInfoLeader.options1 = [];
      }
      if (this.dataInfoLeader.options3.length !== 1) {
        this.dataInfoLeader.viTitle1 = '';
        this.dataInfoLeader.options2 = [];
      }
      params.signDtos = [];
      params.nextNode = val;
      if (this.condition.viRadio) {
        this.dataInfoLeader.options.forEach((v) => {
          if (v.value === val) {
            this.condition.taskName = v.label;
            this.condition.modelKey = v.modelKey;
            params.type = v.type;
            params.procInstId = v.procInstId;
            params.modelKey = v.modelKey;
            params.signDtos.push({
              taskName: v.label,
              taskType: v.taskType,
              receiveUserId: null,
              id: v.id,
            });
            if (v.taskType === 'endEvent') {
              this.examine.checkField.title = '';
            } else {
              this.examine.checkField.title = '下一处理人不能为空';
            }
          }
        });
        if (this.dataInfoLeader.options.length === 1 && this.dataInfoLeader.options1.length === 1) {
          params.signDtos[0].receiveUserId = this.dataInfoLeader.options1[0].value;
        }
        if (this.dataInfoLeader.options.length > 1 && this.receiveUserIdAutoFlag !== 1) {
          this.fetchGetNodeRole(this.condition);
        } else if (this.dataInfoLeader.options.length > 1 && this.receiveUserIdAutoFlag === 1) {
          this.getReceiveList(this.receiveUserList);
        }
      } else {
        this.dataInfoLeader.options3.forEach((v) => {
          if (v.value === val) {
            this.condition.taskName = v.label;
            this.condition.modelKey = v.modelKey;
            this.condition.viApproveUserId = v.approveUserId;
            params.type = v.type;
            params.procInstId = v.procInstId;
            params.modelKey = v.modelKey;
            params.signDtos.push({
              taskName: v.label,
              taskType: v.taskType,
              receiveUserId: null,
              id: v.id,
            });
          }
        });
        if (this.dataInfoLeader.options3.length === 1 &&
         this.dataInfoLeader.options2.length === 1) {
          params.signDtos[0].receiveUserId = this.dataInfoLeader.options2[0].value;
        }
        if (this.dataInfoLeader.options3.length > 1) {
          this.fetchGetNodeRole(this.condition);
        }
      }
      this.$store.commit(FETCH_UPDATEISSHOWEXAMINE_SERVICE, this.isShowExamine);
      this.$store.commit(FETCH_GETNODE_SERVICE);
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
      if (this.dataInfo.options.length === 1 && this.dataInfo.options1.length === 1) {
        params.signDtos[0].receiveUserId = this.dataInfo.options1[0].value;
      }
      if (this.dataInfo.options.length > 1) {
        this.dataInfo.options1 = [];
        this.dataInfo.viTitle = '';
        this.fetchGetNodeRole(this.condition);
      }
      this.$store.commit(FETCH_UPDATEISSHOWEXAMINE_SERVICE, val);
      this.$store.commit(FETCH_GETNODE_SERVICE);
    },
    getNodeRolechange(val) {
      this.examine.data.signDtos[0].receiveUserId = val;
      this.$store.commit(FETCH_NODENOLE_SERVICE);
    },
    getReceiveList(array) {
      if (array.length === 1) {
        this.dataInfoLeader.options1.push({
          value: array[0].value,
          label: array[0].label,
        });
        this.examine.data.signDtos[0].receiveUserId = array[0].value;
        this.dataInfoLeader.viTitle = array[0].label;
        this.examine.checkField.title = '';
      } else if (array.length > 1) {
        array.forEach((v) => {
          this.dataInfoLeader.options1.push({
            value: v.value,
            label: v.label,
          });
        });
      } else {
        this.dataInfoLeader.options1 = [];
      }
    },
    fetchExamine(params = {}) {
      const { updateUserId } = this;
      this.$store.dispatch(FETCH_EXAMINE_ACTION, {
        updateUserId,
        ...params,
      }).then(() => {
        if (this.dataInfo.options.length === 1 && this.isShowExamine && this.modelName) {
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
        if (this.isDisabled) {
          // 修改驳回时候modelkey找不到得情况
          if (!_.isEmpty(this.dataInfo.options)) {
            this.condition.modelKey = this.dataInfo.options[0].modelKey;
            this.dataInfo.viModelName.forEach((v) => {
              if (v.modelKey === this.dataInfo.options[0].modelKey) {
                this.dataInfo.viBusn = v.modelName;
                this.examine.checkField.startNode = '';
              }
            });
          }
        }
      });
    },
    fetchGetNextNodesLeader() {
      const { procInstId } = this;
      this.$store.dispatch(FETCH_GETNEXTNODESLEADER_ACTION, {
        viProcInstId: procInstId,
      }).then(() => {
        if (this.dataInfoLeader.options.length === 1 && this.receiveUserIdAutoFlag !== 1) {
          if (this.dataInfoLeader.options[0].taskType !== 'endEvent') {
            this.condition.modelKey = this.dataInfoLeader.options[0].modelKey;
            this.condition.taskName = this.dataInfoLeader.options[0].label;
            this.fetchGetNodeRoleTrue(this.condition);
          }
        } else if (this.dataInfoLeader.options.length === 1 && this.receiveUserIdAutoFlag === 1) {
          this.getReceiveList(this.receiveUserList);
        }
      }).then(() => {
        if (this.dataInfoLeader.options3.length === 1) {
          this.condition.viApproveUserId = this.dataInfoLeader.options3[0].approveUserId;
          this.condition.modelKey = this.dataInfoLeader.options3[0].modelKey;
          this.condition.taskName = this.dataInfoLeader.options3[0].label;
          this.fetchGetNodeRoleFalse(this.condition);
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
        if (this.dataInfo.viModelName.length === 1 && _.isEmpty(this.procInstId)) {
          this.condition.modelKey = this.dataInfo.viModelName[0].modelKey;
          this.fetchExamine(this.condition);
        }
      }).then(() => {
        if (!_.isEmpty(this.procInstId) && this.isShowExamine) {
          this.condition.procInstId = this.procInstId;
          this.$nextTick(() => {
            this.fetchGetNextNodes(this.condition);
          });
        }
      });
    },
    fetchGetCurrentNode(params = {}) {
      const { procInstId, updateUserId } = this;
      this.$store.dispatch(FETCH_GETCURRENTNODE_ACTION, {
        viProcInstId: procInstId,
        updateUserId,
        ...params,
      });
    },
    fetchGetNodeRoleTrue(params = {}) {
      const { updateUserId, viAddrCode } = this;
      this.$store.dispatch(FETCH_GETNODEROLETRUE_ACTION, {
        updateUserId,
        ...params,
        viAddrCode,
      });
    },
    fetchGetNodeRoleFalse(params = {}) {
      const { updateUserId, viAddrCode } = this;
      this.$store.dispatch(FETCH_GETNODEROLEFALSE_ACTION, {
        updateUserId,
        ...params,
        viAddrCode,
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
      return this.$store.dispatch(FETCH_ADDCOMMONLIST_ACTION, {
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
