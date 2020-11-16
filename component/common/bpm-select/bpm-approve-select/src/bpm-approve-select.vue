<template>
    <basic-dialog :visible.sync="innerVisible"
                title="审批"
                width="1050px">
    <div class="bpm-select">
    <scm-dialog-sub-header title="审批处理" style="margin-bottom:0px">
      <template slot="action">
        <scm-dialog-sub-header-button icon="submit"
                                      @click.native='onSubmit'>
          提交
        </scm-dialog-sub-header-button>
      </template>
    </scm-dialog-sub-header>
       <scm-card v-if="isShowExamine === false && isShowCounter">
      <scm-form ref="dataInfoLeader"
                class="basic-info"
                :model="dataInfoLeader"
                inline>
        <scm-row :gutter="20">
          <scm-col :span="5">
            <scm-form-item label="审批结果">
              <scm-radio-group v-model="condition.viRadio"
                              :disabled="inputIsApproveDisabled"
                               style="width:220px"
                               @change="handleRadioChange">
                <scm-radio :label="true">审批通过</scm-radio>
                <scm-radio :label="false">审批不通过</scm-radio>
              </scm-radio-group>
            </scm-form-item>
            <scm-form-item label="下一路径"
                           prop="viTargetNode"
                           v-show="condition.viRadio === true && !isShowNextPath && isShowNextNode"
                           class="mg-b-20 examine-Leader">
                <scm-select v-model="dataInfoLeader.viTargetNode"
                            @change="getNextNodesChange"
                            placeholder="">
                  <scm-option v-for="(item, index) in returnFalseData"
                              :key="index"
                              :label="item.taskName"
                              :value="item.nextNode">
                  </scm-option>
                </scm-select>
            </scm-form-item>
            <scm-form-item label="退回路径"
                           prop="viRejectNode"
                           v-show="condition.viRadio === false && !isShowBackPath"
                           class="mg-b-20 examine-Leader">
                <scm-select v-model="dataInfoLeader.viRejectNode"
                             @change="getNextNodesChange"
                            placeholder="">
                  <scm-option v-for="(item, index) in returnTrueData"
                              :key="index"
                              :label="item.taskName"
                              :value="item.nextNode">
                  </scm-option>
                </scm-select>
            </scm-form-item>
            <scm-form-item label="下一处理人"
                           prop="viTitle"
                           class="mg-b-20 examine-Leader"
                           v-show="condition.viRadio===true
                                   &&!isShowNextPath
                                   && isShowNextPer
                                   && isShowNextNode
                                   && !isShowSignPer
                                   && isShowNextProcessor
                                   && !isShowCascader">
                <scm-select v-model="dataInfoLeader.viTitle"
                            @change="getNodeRolechange"
                            placeholder="">
                  <scm-option v-for="(item, index) in truePer"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
            </scm-form-item>
            <!-- 级联显示同意下一处理人得情况 -->
            <scm-form-item label="下一处理人"
                           prop="viCaseTrueData"
                           class="examine-Leader"
                           v-show="condition.viRadio===true
                                    &&!isShowNextPath
                                    && isShowNextPer
                                    && isShowNextNode
                                    && isShowCascader">
              <scm-cascader :key="isResouceShowTrue"
                            :options="optionsApproveTrue"
                            :props="{multiple:isShowSignPer}"
                            :show-all-levels="false"
                            collapse-tags
                            @change="onChangeApproveRole"
                            v-model="dataInfoLeader.viCaseTrueData"></scm-cascader>
            </scm-form-item>
              <!-- 投票会签审批时下一处理人为多选的时候          -->
            <scm-form-item label="下一处理人"
                           prop="viSignPer"
                           class="mg-b-20 examine-Leader"
                           v-show="condition.viRadio===true
                                    &&!isShowNextPath
                                    && isShowNextPer
                                    && isShowNextNode
                                    && isShowSignPer
                                    && !isShowCascader">
                <scm-select v-model="dataInfoLeader.viSignPer"
                            @change="getNodeRolechange"
                            :clearable="!voteSignDisabled"
                            :class="voteSignDisabled ? 'removeClose': ''"
                            multiple
                            collapse-tags
                            placeholder="">
                  <scm-option v-for="(item, index) in truePer"
                              :key="index"
                              :disabled="item.disabled"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
            </scm-form-item>

<!--              批量审批时 下一处理人为自动匹配时 显示如下  待确认。                    -->
            <scm-form-item label="下一处理人"
                           prop="viPeople"
                           class="mg-b-20 examine-Leader"
                           v-show="condition.viRadio===true
                                   &&!isShowNextPath
                                   && isShowNextPer
                                   && isShowNextNode
                                   && !isShowSignPer
                                   &&!isShowNextProcessor
                                   && !isShowCascader">
                  <scm-input value="自动匹配"
                             :disabled="true"></scm-input>
            </scm-form-item>


            <scm-form-item label=""
                           v-show="condition.viRadio===true && isShowNextPath"
                           class="mg-b-20 examine-Leader">
              <template>
                <scm-alert title="没有可选下一路径"
                           type="info"
                           :closable="false">
                </scm-alert>
              </template>
            </scm-form-item>


            <!-- 批量审批时 驳回状态下一处理人固定显示提交人 submitUser -->

            <scm-form-item label="下一处理人"
                           prop="viPeople"
                           class="mg-b-20 examine-Leader"
                           v-show="condition.viRadio===false &&
                           !isShowBackPath && (!isShowCascader || isSubmitUser)">
                <scm-select v-model="dataInfoLeader.viPeople"
                            @change="getNodeRolechange"
                            placeholder="">
                  <scm-option v-for="(item, index) in falsePer"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
            </scm-form-item>
            <!-- 级联不同意的时候 -->
            <scm-form-item label="下一处理人"
                           prop="viCaseFalseData"
                           class="examine-Leader"
                           v-show="condition.viRadio===false &&
                           !isShowBackPath && isShowCascader && !isSubmitUser">
              <scm-cascader :key="isResouceShowFalse"
                            :options="optionsApproveFalse"
                            :show-all-levels="false"
                            @change="onChangeApproveRole"
                            v-model="dataInfoLeader.viCaseFalseData"></scm-cascader>
            </scm-form-item>
            <!-- 下一处理人驳回状态下得会签 多选
            <scm-form-item label=""
                           prop="viRebutPer"
                           class="mg-b-20 examine-Leader"
                           v-show="condition.viRadio===false && !isShowBackPath && isShowRebut">
              <template>
                <div>下一处理人</div>
                <scm-select v-model="dataInfoLeader.viRebutPer"
                            @change="getNodeRolechange"
                            multiple
                            collapse-tags
                            placeholder="">
                  <scm-option v-for="(item, index) in falsePer"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
              </template>
            </scm-form-item> -->

            <scm-form-item label=""
                           class="mg-b-20 examine-Leader"
                           v-show="condition.viRadio===false && isShowBackPath">
              <template>
                <scm-alert title="没有可选退回路径"
                           type="info"
                           :closable="false">
                </scm-alert>
              </template>
            </scm-form-item>
          </scm-col>


          <scm-col :span="9" class="criticize1">
            <div>
              <scm-row style="margin-bottom:10px;">
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
                       @click="onAddCriticize1"></i>
                  </scm-popover>
                </scm-col>
              </scm-row>
            </div>
            <scm-input v-model.trim="dataInfoLeader.approveOpinion"
                        resize="none"
                        class="div-textarea"
                       maxLength="160"
                       type="textarea"
                       :rows="2">
            </scm-input>
            <div class="textarea-bottom">
                       <span style="margin-right:2px">{{input}}</span>
                       <span>/160</span></div>
          </scm-col>
          <scm-col :span="9" class="criticize1">
            <span>
              常用批语
            </span>
            <div class="div-criticize3">
              <div v-for="(item, index) in phrasesData"
                   @mouseover="selectStyle(item)"
                   :class="{'active':item.active}"
                   @mouseout="outStyle(item)"
                   :key=index
                   class="div-hover c-value">
                <scm-row>
                  <scm-col :span="18">
                    <div class="c-add"
                         @dblclick="onEditor(item.phrase)">{{item.phrase}}
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
       <!------------------------- 会签时候显示得领导审批卡片isShowCounter控制显示与隐藏 ---------------------------->
    <scm-card v-if="isShowExamine === false && !isShowCounter">
      <scm-form ref="dataInfoLeader"
                class="basic-info"
                label-position="top"
                :model="dataInfoLeader"
                inline>
        <scm-row :gutter="20" style="margin-bottom:10px">
          <scm-col :span="6">
            <scm-form-item label="审批结果">
              <scm-radio-group v-model="condition.viRadio"
                               @change="handleRadioChange"
                               class="mg-b-10">
                <scm-radio :label="true">审批通过</scm-radio>
                <scm-radio :label="false">审批不通过</scm-radio>
              </scm-radio-group>
            </scm-form-item>
          </scm-col>
          <scm-col :span="6">
            <scm-form-item label="下一路径"
                           prop="viTargetNode"
                           v-show="condition.viRadio === true && !isShowNextPath"
                           class="mg-b-20 examine-Leader">
              <scm-select v-model="dataInfoLeader.viTargetNode"
                          @change="getNextNodesChange"
                          placeholder="">
                <scm-option v-for="(item, index) in returnFalseData"
                            :key="index"
                            :label="item.taskName"
                            :value="item.nextNode">
                </scm-option>
              </scm-select>
            </scm-form-item>
          </scm-col>
          <scm-col :span="6">
           <scm-form-item label="退回路径"
                           prop="viRejectNode"
                           v-show="condition.viRadio === false && !isShowBackPath"
                           class="mg-b-20 examine-Leader">
                <scm-select v-model="dataInfoLeader.viRejectNode"
                            @change="getNextNodesChange"
                            placeholder="">
                  <scm-option v-for="(item, index) in returnTrueData"
                              :key="index"
                              :label="item.taskName"
                              :value="item.nextNode">
                  </scm-option>
                </scm-select>
            </scm-form-item>
          </scm-col>
          <scm-col :span="6">
            <scm-form-item label=""
                           v-show="condition.viRadio===true && isShowNextPath"
                           class="mg-b-20 examine-Leader">
              <template>
                <scm-alert title="没有可选下一路径"
                           type="info"
                           :closable="false">
                </scm-alert>
              </template>
            </scm-form-item>
          </scm-col>
          <scm-col :span="6">
            <scm-form-item label=""
                           class="mg-b-20 examine-Leader"
                           v-show="condition.viRadio===false && isShowBackPath">
              <template>
                <scm-alert title="没有可选退回路径"
                           type="info"
                           :closable="false">
                </scm-alert>
              </template>
            </scm-form-item>
          </scm-col>

          <scm-col :span="6">
            <scm-form-item label="下一处理人"
                           prop="viTitle"
                           class="mg-b-20 examine-Leader"
                           v-show="condition.viRadio===true
                                    &&!isShowNextPath
                                    && isShowNextPer
                                    && isShowCounter">
                <scm-select v-model="dataInfoLeader.viTitle"
                            @change="getNodeRolechange"
                            placeholder="">
                  <scm-option v-for="(item, index) in truePer"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
            </scm-form-item>
          </scm-col>
          <scm-col :span="6">

            <scm-form-item label="下一处理人"
                           prop="viPeople"
                           class="mg-b-20 examine-Leader"
                           v-show="condition.viRadio===false && !isShowBackPath">
                <scm-select v-model="dataInfoLeader.viPeople"
                            @change="getNodeRolechange"
                            placeholder="">
                  <scm-option v-for="(item, index) in falsePer"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
            </scm-form-item>
          </scm-col>
        </scm-row>
        <!--  领导审批会签处理人 -->
        <scm-row>
            <scm-form-item :label="item.taskName"
                            v-for="(item,index) in allCounterData"
                            :key="index"
                            :prop="item.val"
                            style="width:220px"
                            v-show="!isShowCounter && condition.viRadio">
                  <scm-select placeholder="选择处理人"
                              v-model="rad[index]"
                              @change="getNodeRoleNewChange(index,rad[index])"
                              style="width:220px;margin-top:5px">
                    <scm-option v-for="(v, index) in realNameList[index]"
                                :key="index"
                                :label="v.label"
                                :value="v.value">
                    </scm-option>
                  </scm-select>
                </scm-form-item>
            </scm-row>
        <scm-divider dashed></scm-divider>
        <scm-row :gutter="20">
          <scm-col :span="12">
            <div>
              <scm-row style="margin-bottom:10px">
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
                       @click="onAddCriticize1"></i>
                  </scm-popover>
                </scm-col>
              </scm-row>
            </div>
            <scm-input v-model.trim="dataInfoLeader.approveOpinion"
                        resize="none"
                       maxLength="160"
                       type="textarea"
                        class="div-textarea"
                       :rows="2">
            </scm-input>
            <div class="textarea-bottom">
              <span style="margin-right:2px">{{input}}</span>
              <span>/160</span></div>
          </scm-col>

          <scm-col :span="12">
            <span>
              常用批语
            </span>
            <div class="div-criticize4">
                <div v-for="(item, index) in phrasesData"
                   @mouseover="selectStyle(item)"
                   :class="{'active':item.active}"
                   @mouseout="outStyle(item)"
                   :key=index
                   class="div-hover c-value">
                <scm-row>
                  <scm-col :span="18">
                    <div class="c-add"
                         @dblclick="onEditor(item.phrase)">{{item.phrase}}
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
  </basic-dialog>
</template>
<script>
import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../../basic-dialog';
import BasicDialogMixin from '../../../basic-dialog/src/basic-dialog-mixin';
import BpmCardtMixin from '../../../bpm-card/src/bpm-card-mixin';

const FETCH_FETCHGETQUERYSELECTSTYLE_ACTION = 'bpm/fetchGetQuerySelectStyle';
export default {
  name: 'ScmBpmApproveSelect',
  mixins: [BasicDialogMixin, BpmCardtMixin],
  components: {
    BasicDialog,
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      startPathData: state => state.bpm.startPathData,
      wayData: state => state.bpm.wayData,
      personData: state => state.bpm.personData,
      phrasesData: state => state.bpm.phrasesData,
      examine: state => state.bpm.examine,
      allCounterData: state => state.bpm.allCounterData,
      realNameList: state => state.bpm.userNameList,
      returnTrueData: state => state.bpm.returnBackData.returnTrueData,
      returnFalseData: state => state.bpm.returnBackData.returnFalseData,
      truePer: state => state.bpm.returnPer.truePer,
      falsePer: state => state.bpm.returnPer.falsePer,
      isShowNextPer: state => state.bpm.isShowNextPer,
      isShowNextPath: state => state.bpm.isShowNextPath,
      isShowBackPath: state => state.bpm.isShowBackPath,
      allProIdData: state => state.bpm.allProIdData,
      isShowCounter: state => state.bpm.isShowCounter,
      isShowNextNode: state => state.bpm.isShowNextNode,
      isShowSignPer: state => state.bpm.isShowSignPer,
      // isShowRebut: state => state.bpm.isShowRebut, // 驳回时候得多选会签状态。
      isShowNextProcessor: state => state.bpm.isShowNextProcessor, // 判断下一处理人是否显示(不包括会签)
      isShowCascader: state => state.bpm.isShowCascader,
    }),
    // isShowCounter() {
    //   return _.isEmpty(this.realNameList);
    // },
    optionsApproveTrue() {
      return this.convertData(this.truePer, '0');
    },
    optionsApproveFalse() {
      if (!this.isSubmitUser) {
        return this.convertData(this.falsePer, '0');
      }
      return [];
    },
  },
  data() {
    return {
      condition: {
        modelKey: '', // 提交审批可选流程 流程图key
        viPathNode: '', // 可选路径 value
        viPathLabel: '',
        viProcInstId: '',
        viTaskName: '', // 节点名称
        viPerson: '',
        approveOpinion: '', // 常用语
        viId: '',
        viTaskType: '',
        viReturnBack: '',
        viType: '',
        viApproveUserId: '',
        viRadio: true,
        ifAgrees: '', // 同意与否
        // viProcInstIds: '', // 批量审批传出的
      },
      dataInfoLeader: {
        viTargetNode: '', // 下一路径
        viTargetNodeValue: '', // 下一路径
        viRejectNode: '', // 退回路径
        viRejectNodeValue: '', // 退回路径
        viTitle: '', // 下一处理人1
        viTitleValue: '',
        viTitleLabel: '',
        viPeople: '', // 下一处理人2
        viPeopleValue: '', // 下一处理人2
        viPeopleLabel: '', // 下一处理人2
        approveOpinion: '', // 常用语
        viProcInstId: '',
        viTaskName: '',
        viId: '',
        modelKey: '',
        viTaskType: '',
        viReturnBack: '',
        viType: '',
        viSignPer: [], // 投票会签下一处理人为多选
        viSignPerLabel: [], // 投票会签下一处理人为多选
        viRebutPer: [], // 投票会签下一处理人为多选 不同意状态下
        viCaseTrueData: [], // 同意
        viCaseTrueLabel: '',
        viCaseTrueValue: '',
        viCaseFalseData: [], // 不同意
        viCaseFalseLabel: '',
        viCaseFalseValue: '',
      },
      argreeData: {},
      notArgreeData: {},
      // 审批获取流程
      getProcInstId: {
        procInstId: '',
      },
      input: 160,
      rad: [],
      isResouceShowTrue: 0,
      isResouceShowFalse: 0,
    };
  },
  props: {
    updateUserId: {
      type: String,
    },
    procInstId: {
      // 流程id
      type: String,
    },
    procInstIds: {
      // 批量审批流程id
      type: Array,
    },
    // modelName: { // 启动流程由业务组传入
    //   type: Array,
    // },
    // isDisabled: {
    //   type: Boolean,
    //   default: false,
    // },
    isShowExamine: { // 提交与领导审批的显示
      // required: true,
      type: Boolean,
      default: true,
    },
    bpmCount: { // 批量审批传入的个数
      type: Number,
    },
    receiveUserIdAutoFlag: { // 1 === 业务组传入
      type: Number,
      // default: 1,
    },
    receiveUserList: { // 传入的下一处理人list；
      type: Array,
      // default() {
      //   return [{
      //     label: 'gggg',
      //     value: 'oooo@qq.com',
      //   }];
      // },
    },
    isSubmitUser: { // 批量审批中下一处理人驳回状态 true为固定处理人 {label:'提交人',value: 'submitUser'}
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.fetchCommonList();
  },
  mounted() {
    if (this.condition.viRadio) {
      this.dataInfoLeader.approveOpinion = '同意';
      this.input = 160 - this.dataInfoLeader.approveOpinion.length;
      this.saveSdto();
    }
  },
  methods: {
    onSubmit() {
      this.$emit('select', this.examine);
    },
  },
  watch: {
    procInstId: {
      handler(newPro) {
        if (newPro && !this.isShowExamine) {
          this.$set(this.getProcInstId, 'procInstId', newPro);
          this.$store.dispatch(
            FETCH_FETCHGETQUERYSELECTSTYLE_ACTION,
            { addrCode: this.addrCode, webId: this.clientBaseUrl },
          ).then(() => {
            this.fetchWay1(this.getProcInstId);
          });
        }
      },
      immediate: true,
    },
    // ===========领导审批 页面 ===========//
    returnFalseData: {
      handler() {
        this.savePathZero(this.returnFalseData, 'viTargetNode', 'viTargetNodeValue', true);
      },
      deep: true,
    },
    returnTrueData: {
      handler() {
        this.savePathZero(this.returnTrueData, 'viRejectNode', 'viRejectNodeValue', false);
      },
    },
    truePer() { // 下一处理人为一人状态处理
      // 重新渲染级联选择器
      if (_.isEmpty(this.truePer)) {
        this.isResouceShowTrue += 1;
      }
      if (!_.isEmpty(this.truePer) && this.truePer.length === 1 && !this.isShowSignPer) {
        // 级联同意得时候人唯一得时候自动显示
        if (this.isShowCascader) {
          this.dataInfoLeader.viCaseTrueLabel = this.truePer[0].label;
          this.dataInfoLeader.viCaseTrueValue = this.truePer[0].value;
          this.dataInfoLeader.viCaseTrueData = this.convertData(this.truePer, '1');
        } else {
          this.dataInfoLeader.viTitle = this.truePer[0].label;
          this.dataInfoLeader.viTitleLabel = this.truePer[0].label;
          this.dataInfoLeader.viTitleValue = this.truePer[0].value;
          this.saveSdto();
        }
      }
      // 级联投票会签
      if (
        !_.isEmpty(this.truePer) &&
        this.isShowCascader &&
        this.isShowSignPer &&
        this.isSelectAll
      ) {
        this.$nextTick(() => {
          this.dataInfoLeader.viCaseTrueValue = _.cloneDeep(_.map(this.truePer, 'value')).join();
          this.dataInfoLeader.viCaseTrueLabel = _.cloneDeep(_.map(this.truePer, 'label')).join();
          this.dataInfoLeader.viCaseTrueData = this.convertData(
            this.truePer,
            '2',
          );
          this.saveSdto();
        });
      }
      this.getSelectAllSignPer('viSignPer', this.truePer, this.isShowSignPer);
    },
    falsePer() { // 退回处理人为一人状态处理
      // 重新渲染级联选择器
      if (_.isEmpty(this.falsePer)) {
        this.isResouceShowFalse += 1;
      }
      if (this.falsePer && this.falsePer.length === 1) {
        // 级联驳回得时候人唯一得时候自动显示
        if (this.isShowCascader && !this.isSubmitUser) {
          this.dataInfoLeader.viCaseFalseLabel = this.falsePer[0].label;
          this.dataInfoLeader.viCaseFalseValue = this.falsePer[0].value;
          this.dataInfoLeader.viCaseFalseData = this.convertData(this.falsePer, '1');
        } else {
          this.dataInfoLeader.viPeople = this.falsePer[0].label;
          this.dataInfoLeader.viPeopleLabel = this.falsePer[0].label;
          this.dataInfoLeader.viPeopleValue = this.falsePer[0].value;
        }
        this.saveSdto();
      }
      // this.getSelectAllSignPer('viRebutPer', this.falsePer, this.isShowRebut);
    },
  },
};
</script>
<style lang="scss" scoped>
.bpm-select{
     /deep/ .removeClose .el-icon-close{
      display: none;
    }
    .el-dialog__body{
          max-height:540px;
    }
    .examine-Leader{
      width:100%;
      margin-top:10px;
      vertical-align: bottom;
    }
  .add-examine {
    float: right;
    color: #0085d0;
    margin-top: 3px;
  }
  .criticize1 {
    margin-top: 0px;
    // margin-left: 20px;
  }
  .div-criticize4 {
    border: 1px solid #d0d0d0;
    margin-top: 10px;
    height: 188px;
    overflow: auto;
  }

  .div-criticize3 {
    border: 1px solid #d0d0d0;
    height: 188px;
    margin-top: 10px;
    overflow: auto;
  }
  .div-hover:hover {
    background: #e6f3fb;
  }
  .c-value {
    padding: 9px 11px;
  }
  .c-add {
    font-size: 11px;
    &:hover{
    cursor: pointer;
    }
  }
  .c-del {
    float: right;
    color: #0085d0;
    font-size: 18px;
  }
}
</style>

<style lang="scss">
.bpm-select{
     /deep/ .removeClose .el-icon-close{
      display: none;
    }
   .div-textarea{
      height: 190px;
      .el-textarea__inner {
        height:190px;
      }
    }
    // .el-select {
    //   width: 205px;
    // }
    // .el-alert {
    //   width: 205px;
    // }
    // .el-form .el-row .el-form-item{
    //   width: 226px;
    // }
}
</style>
