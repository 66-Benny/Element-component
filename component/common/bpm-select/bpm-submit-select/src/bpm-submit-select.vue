<template>
<basic-dialog :visible.sync="innerVisible"
                title="审批"
                width="1050px">
    <div class="bpm-select">
    <scm-dialog-sub-header title="提交审批" style="margin-bottom:10px">
      <template slot="action">
        <scm-dialog-sub-header-button icon="submit"
                                      @click.native='onSubmit'>
          提交
        </scm-dialog-sub-header-button>
      </template>
    </scm-dialog-sub-header>
    <scm-card v-if="isShowExamine === true">
      <scm-form ref="submitForm"
                class="basic-info"
                label-position="top"
                :model="condition"
                inline>
        <scm-row :gutter="20">
          <scm-col :span="10">
            <scm-form-item label="可选流程">
              <scm-select placeholder="请选择流程"
                          :disabled="isDisabled"
                          style="width:100%;margin-top:5px"
                          v-model="condition.modelKey"
                          @change="onSelectPath">
                <scm-option v-for="(item, index) in startPathData"
                            :key="index"
                            :label="item.modelName"
                            :value="item.modelKey">
                </scm-option>
              </scm-select>
            </scm-form-item>
          </scm-col>
          <scm-col :span="8">
            <scm-form-item label="下一路径">
                <scm-select v-model="condition.viPathNode"
                            placeholder="请选择路径"
                            style="width:100%;margin-top:5px"
                            @change="onSelectWay">
                  <scm-option v-for="(item, index) in wayData"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
            </scm-form-item>
          </scm-col>
          <scm-col :span="6">

            <scm-form-item label="下一处理人"
                           prop="viPerson"
                           v-show="isShowCounter &&
                                   isShowNextProcessor &&
                                   !isShowSignPer &&
                                   !isShowCascader">
                <scm-select v-model="condition.viPerson"
                            style="width:100%;margin-top:5px"
                            @change="onSelectPerson">
                  <scm-option v-for="(item, index) in personData"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
            </scm-form-item>
          </scm-col>
    <!-- 级联选择器形式 -->
          <scm-col :span="6">
            <scm-form-item label="下一处理人"
                           prop="viCasePerData"
                           v-show="isShowCounter && isShowCascader">
                      <scm-cascader
                        :key="isResouceShow"
                        :options="options"
                        :show-all-levels="false"
                        :props = "{multiple:isShowSignPer}"
                        v-model="condition.viCasePerData"
                        @change="onChangeCasPer"
                        collapse-tags
                        style="margin-top:6px;"
                      ></scm-cascader>
            </scm-form-item>
          </scm-col>
          <scm-col :span="6">
<!-- 投票会签，下一处理人为多选的情况 -->
            <scm-form-item label="下一处理人"
                           prop="viSingPerson"
                           v-show="isShowCounter &&
                                   isShowNextProcessor &&
                                   isShowSignPer &&
                                   !isShowCascader">
                <scm-select v-model="condition.viSingPerson"
                            :clearable="!voteSignDisabled"
                            :class="voteSignDisabled ? 'removeClose': ''"
                            multiple
                            collapse-tags
                            style="width:100%;margin-top:5px"
                            @change="onSelectPerson">
                  <scm-option v-for="(item, index) in personData"
                              :key="index"
                              :disabled="item.disabled"
                              :label="item.label"
                              :value="item.value">
                  </scm-option>
                </scm-select>
            </scm-form-item>
          </scm-col>
<!--              批量审批时 下一处理人为自动匹配时 显示如下  待确认。                    -->
          <scm-col :span="6">
            <scm-form-item label="下一处理人"
                           v-show="isShowCounter && !isShowNextProcessor && !isShowCascader">
                  <scm-input value="自动匹配"
                             :disabled="true"
                             style="width:100%;margin-top:5px"></scm-input>
            </scm-form-item>
          </scm-col>

        </scm-row>
        <scm-row>
        <scm-form-item :label="item.taskName"
                       v-for="(item,index) in allCounterData"
                       :key="index"
                       :prop="item.val"
                       class="examine-Leader"
                       v-show="!isShowCounter"
                       style="width:220px">
          <scm-select placeholder="选择处理人"
                      v-model="rad[index]"
                      @change="getNodeRoleNewChange(index,rad[index])"
                      class="w-220"
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
                       @click="onAddCriticize"></i>
                  </scm-popover>
                </scm-col>
              </scm-row>
            </div>
            <scm-input v-model.trim="condition.approveOpinion"
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

const FETCH_UPDATESAVEDTOS_ACTION = 'bpm/updateSaveDtos';
// const FETCH_FETCHGETQUERYSELECTSTYLE_ACTION = 'bpm/fetchGetQuerySelectStyle';

export default {
  name: 'ScmBpmSubmitSelect',
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
      isShowSignPer: state => state.bpm.isShowSignPer,
      allProIdData: state => state.bpm.allProIdData,
      isShowNextProcessor: state => state.bpm.isShowNextProcessor, // 判断下一处理人是否显示(不包括会签)
      isShowCascader: state => state.bpm.isShowCascader,
    }),
    isShowCounter() {
      return _.isEmpty(this.realNameList);
    },
    options() {
      return this.convertData(this.personData, '0');
    },
  },
  data() {
    return {
      condition: {
        modelKey: '', // 提交审批可选流程 流程图key
        modelKeyValue: '', // 提交审批可选流程 流程图key
        modelKeyLabel: '', // 提交审批可选流程 流程图key
        viPathNode: '', // 可选路径 value
        viPathLabel: '',
        viProcInstId: '',
        viTaskName: '', // 节点名称
        viPerson: '',
        viPersonLabel: '',
        // viPersonValue: '',
        viSingPerson: [], // 投票会签时得下一处理人
        viSingPersonLabel: [], // 投票会签时得下一处理人
        approveOpinion: '', // 常用语
        viId: '',
        viTaskType: '',
        viReturnBack: '',
        viType: '',
        viApproveUserId: '',
        viRadio: true,
        ifAgrees: '', // 同意与否
        // viProcInstIds: '', // 批量审批传出的
        viCasePerValue: '', // 提交时级联选择器下一处理人
        viCasePerLabel: '', // 提交时级联选择器下一处理人
        viCasePerData: [], // 提交时级联选择器下一处理人.只是用来读入
      },
      dataInfoLeader: {
        viTargetNode: '', // 下一路径
        viTargetNodeValue: '', // 下一路径
        viRejectNode: '', // 退回路径
        viRejectNodeValue: '', // 退回路径
        viTitle: '', // 下一处理人1
        viTitleValue: '',
        viPeople: '', // 下一处理人2
        viPeopleValue: '', // 下一处理人2
        approveOpinion: '', // 常用语
        viProcInstId: '',
        viTaskName: '',
        viId: '',
        modelKey: '',
        viTaskType: '',
        viReturnBack: '',
        viType: '',
      },
      argreeData: {},
      notArgreeData: {},
      // 审批获取流程
      getProcInstId: {
        procInstId: '',
      },
      input: 160,
      rad: [],
      isResouceShow: 0,
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
    modelName: { // 启动流程由业务组传入
      type: Array,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
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
  },
  created() {
    this.fetchCommonList();
  },
  mounted() {
    if (!_.isEmpty(this.modelName)) {
      this.fetchGetStartNode();
    }
    if (this.isShowExamine) {
      this.condition.approveOpinion = '请审批';
      this.input = 160 - this.condition.approveOpinion.length;
    }
  },
  methods: {
    onSubmit() {
      this.$emit('select', this.examine);
    },
  },
  watch: {
    modelName() {
      if (!_.isEmpty(this.modelName)) {
        this.fetchGetStartNode();
      }
    },
    // 驳回流程置灰效果
    isDisabled: {
      handler() {
        if (this.isDisabled) {
          this.getProcInstId.procInstId = this.procInstId;
          this.fetchWay(this.getProcInstId).then(() => {
            const findPath = this.wayData[0].modelKey;
            this.condition.modelKey = findPath;
          });
        }
      },
      immediate: true,
    },
    realNameList() { // 会签人员初始化显示
      const that = this.rad;
      const member = this.examine.data.signDtos;
      // const userName = Array.from(new Set(this.realNameList));
      const userName = this.realNameList;
      for (let i = 0; i < userName.length; i += 1) {
        if (userName[i]) {
          if (userName[i].length === 1) {
            that[i] = userName[i][0].value;
            member[i].receiveUserId = that[i];
          } else {
            that[i] = null;
          }
        }
      }
    },
    // 流程初始化
    startPathData: {
      handler() {
        if (!_.isEmpty(this.startPathData) &&
         this.startPathData.length === 1 &&
          _.isEmpty(this.procInstId)) {
          const member = _.cloneDeep(this.startPathData);
          this.$nextTick(() => {
            this.condition.modelKey = member[0].modelKey;
            this.condition.modelKeyValue = member[0].modelKey;
            this.condition.modelKeyLabel = member[0].modelName;
            this.fetchExamine(this.condition).then((res) => {
              this.initFetchWay(res);
            });
          });
        }
      },
      deep: true,
    },
    wayData() { // 下一路径初始化显示
      if (this.wayData && this.wayData.length === 1) {
        const member = _.cloneDeep(this.wayData);
        this.$nextTick(() => {
          this.$set(this.condition, 'viPathNode', member[0].value);
          this.$set(this.condition, 'viPathLabel', member[0].label);
          this.saveSelectWay(member[0].value);
        });
      }
    },
    personData() { // 下一处理人初始化
      if (_.isEmpty(this.personData)) {
        this.isResouceShow += 1;
      }
      if (this.personData && this.personData.length === 1 && !this.isShowSignPer) {
        // 判断级联显示下一处理人得时候 为一个人得时候自动展示
        if (this.isShowCascader) {
          this.$nextTick(() => {
            this.condition.viCasePerValue = this.personData[0].value;
            this.condition.viCasePerLabel = this.personData[0].label;
            this.condition.viCasePerData = this.convertData(this.personData, '1');
            this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
          });
        } else {
          this.$nextTick(() => {
            this.condition.viPerson = this.personData[0].value;
            this.condition.viPersonLabel = this.personData[0].label;
            // this.condition.viPersonValue = this.personData[0].value;
            this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
          });
        }
      }
      // 投票会签状态下，下一处理人自动显示在input中。
      if (!_.isEmpty(this.personData) && this.isShowSignPer && this.isSelectAll) {
        if (this.isShowCascader) {
          this.$nextTick(() => {
            this.condition.viCasePerLabel = _.cloneDeep(_.map(this.personData, 'label'));
            this.condition.viCasePerValue = _.cloneDeep(_.map(this.personData, 'value'));
            this.condition.viCasePerData = this.convertData(this.personData, '2');
            this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
          });
        } else {
          this.$nextTick(() => {
            this.condition.viSingPerson = _.cloneDeep(_.map(this.personData, 'value'));
            this.condition.viSingPersonLabel = _.cloneDeep(_.map(this.personData, 'label'));
            this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  .bpm-select{
    /deep/ .removeClose .el-icon-close{
      display: none;
    }
  .examine-Leader {
    vertical-align: bottom;
  }
  .add-examine {
    float: right;
    color: #0085d0;
    margin-top: 3px;
  }
  .criticize1 {
    margin-top: 0px;
    margin-left: 30px;
    width: 440px;
  }
  .div-criticize4 {
    border: 1px solid #d0d0d0;
    margin-top: 10px;
    height: 188px;
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
    // .el-form .el-row .el-form-item{
    //   width: 226px;
    // }
}
</style>
