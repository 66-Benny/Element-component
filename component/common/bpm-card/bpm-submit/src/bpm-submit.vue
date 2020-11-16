<template>
  <div class="bpm-submit">
    <scm-card class="mg-t-15"
              v-if="isShowExamine === true">
      <div slot="header"
           class="clearfix">
        <span>提交处理</span>
      </div>
      <scm-form ref="submitForm"
                class="basic-info"
                label-position="top"
                :model="condition"
                inline>
        <scm-row :gutter="20"
                 style="margin-bottom:2px">
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
                           v-show="isShowCounter && !isShowSignPer && !isShowCascader">
              <scm-select v-model="condition.viPerson"
                          style="width:100%;margin-top:5px"
                          :loading="fetchLoading"
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
                           v-show="isShowCounter && isShowSignPer && !isShowCascader">
              <scm-select v-model="condition.viSingPerson"
                          multiple
                          collapse-tags
                          :clearable="!voteSignDisabled"
                          :class="voteSignDisabled ? 'removeClose': ''"
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
        </scm-row>
        <!-- <scm-divider dashed
                     v-show="!isShowCounter"></scm-divider> -->
                     <!--  -->
<!-- input会签显示情况 -->
        <scm-row style="margin-top:10px">
          <scm-form-item :label="item.taskName"
                          class="examine-Leader"
                         v-for="(item,index) in allCounterData"
                         :key="index"
                         :prop="item.val"
                         v-show="!isShowCounter && !isShowCascader"
                         style="width:220px">
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
<!-- 级联会签cascader显示情况 -->
        <scm-row style="margin-top:10px">
          <scm-form-item :label="item.taskName"
                          class="examine-Leader"
                         v-for="(item,index) in allCounterData"
                         :key="index"
                         :prop="item.val"
                         v-show="!isShowCounter && isShowCascader"
                         style="width:220px">
            <scm-cascader
                        placeholder="选择处理人"
                        :key="isResouceShow"
                        :options="countersignOptions[index]"
                        @change="getNodeRoleNewChange(index,radCas[index][1])"
                        :show-all-levels="false"
                        v-model="radCas[index]"
                        style="margin-top:6px;"
                      ></scm-cascader>
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
                       class="div-textarea-submit"
                       type="textarea"
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
</template>
<script>
import { StoreGlobalAPI } from 'scm-sdk';
import _ from 'lodash';
import BpmCardtMixin from '../../src/bpm-card-mixin';

const FETCH_UPDATESAVEDTOS_ACTION = 'bpm/updateSaveDtos';
const FETCH_FETCHGETNODEROLE_ACTION = 'bpm/fetchGetNodeRole';
const FETCH_FETCHGETQUERYSELECTSTYLE_ACTION = 'bpm/fetchGetQuerySelectStyle';

export default {
  name: 'ScmbpmCard',
  mixins: [BpmCardtMixin],
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchLoading: state =>
        state.loading.actions[FETCH_FETCHGETNODEROLE_ACTION],
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
      isShowSignPer: state => state.bpm.isShowSignPer,
      isShowCascader: state => state.bpm.isShowCascader,
      // mapList: state => state.bpm.mapList, 11-1
    }),
    examineSubmitData: {
      // getter 方法
      get() {
        return this.examine;
      },
      // setter 方法
      set(newValue) {
        return newValue;
      },
    },
    options() {
      return this.convertData(this.personData, '0');
    },
    countersignOptions() {
      return this.convertSignData(this.realNameList);
    },
  },
  data() {
    return {
      condition: {
        modelKey: '', // 提交审批可选流程 流程图key
        modelLabel: '', // 提交审批可选流程 流程图key
        viPathNode: '', // 可选路径 value
        viPathLabel: '',
        viProcInstId: '',
        viTaskName: '', // 节点名称
        viPerson: '',
        viSingPerson: [], // 投票会签时得下一处理人
        viSingPersonLabel: [], // 投票会签时得下一处理人
        viPersonLabel: '', // 下一处理人value值
        // viPersonValue: '', // 预留下一处理人字段
        approveOpinion: '', // 常用语
        viId: '',
        viTaskType: '',
        viReturnBack: '',
        viType: '',
        viApproveUserId: '',
        viRadio: true,
        viCasePerValue: '', // 提交时级联选择器下一处理人
        viCasePerLabel: '', // 提交时级联选择器下一处理人
        viCasePerData: [], // 提交时级联选择器下一处理人.只是用来读入
      },
      // 审批获取流程
      getProcInstId: {
        procInstId: '',
      },
      input: 160,
      rad: [],
      radCas: [], // 级联并行会签v-model
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
    modelName: {
      type: Array,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isShowExamine: {
      required: true,
      type: Boolean,
      default: true,
    },
    receiveUserIdAutoFlag: {
      // 1 === 业务组传入
      type: Number,
      // default: 1,
    },
    receiveUserList: {
      // 传入的下一处理人list；
      type: Array,
      // default() {
      //   return [
      //     {
      //       label: '1111',
      //       value: 'zhanghuan6@tj.cmcc',
      //     },
      //     {
      //       label: '2222',
      //       value: '34001940@ah.cmcc',
      //     },
      //   ];
      // },
    },
    value: {
      type: Object,
    },
  },
  methods: {},
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.examineSubmitData = val;
      },
    },
    examineSubmitData: {
      deep: true,
      handler(val) {
        this.$emit('input', val);
      },
    },
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
            this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
          });
        }
      },
      immediate: true,
    },
    // 驳回时可选流程
    procInstId: {
      handler(newPro) {
        if (!this.isDisabled) {
          this.getProcInstId.procInstId = newPro;
          this.$store.dispatch(
            FETCH_FETCHGETQUERYSELECTSTYLE_ACTION,
            { addrCode: this.addrCode, webId: this.clientBaseUrl },
          ).then(() => {
            this.getFecthId(newPro);
          });
        }
      },
      // immediate: true,
    },
    // 流程初始化
    startPathData: {
      handler() {
        if (
          !_.isEmpty(this.startPathData) &&
          this.startPathData.length === 1 &&
          _.isEmpty(this.procInstId)
        ) {
          const member = _.cloneDeep(this.startPathData);
          this.$nextTick(() => {
            this.condition.modelKey = member[0].modelKey;
            this.condition.modelLabel = member[0].modelName;
            this.fetchExamine(this.condition).then((res) => {
              this.initFetchWay(res);
            });
          });
        }
      },
      deep: true,
    },
    wayData() {
      // 下一路径初始化显示
      if (this.wayData && this.wayData.length === 1) {
        const member = _.cloneDeep(this.wayData);
        this.$nextTick(() => {
          this.$set(this.condition, 'viPathNode', member[0].value);
          this.$set(this.condition, 'viPathLabel', member[0].label);
          this.saveSelectWay(member[0].value);
        });
      }
    },
    personData() {
      if (_.isEmpty(this.personData)) {
        this.isResouceShow += 1;
      }
      // 下一处理人初始化
      if (
        this.personData &&
        this.personData.length === 1 &&
        !this.isShowSignPer
      ) {
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
      if (
        !_.isEmpty(this.personData) &&
        this.isShowSignPer &&
        this.isSelectAll
      ) {
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
  mounted() {
    if (!_.isEmpty(this.modelName)) {
      this.fetchGetStartNode();
    }
    if (this.isShowExamine) {
      this.condition.approveOpinion = '请审批';
      this.input = 160 - this.condition.approveOpinion.length;
    }
    // 驳回时可以选流程
    if (!this.isDisabled && this.procInstId) {
      this.getProcInstId.procInstId = this.procInstId;
      this.getFecthId(this.procInstId);
    }
  },
};
</script>

<style scoped lang="scss">
.bpm-submit {
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
  .div-criticize4 {
    border: 1px solid #d0d0d0;
    margin-top: 10px;
    height: 120px;
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
    &:hover {
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
.bpm-submit {
  .div-textarea-submit {
    height: 122px;
    .el-textarea__inner {
      height: 122px;
    }
  }
  // .el-form .el-row .el-form-item{
  //   width: 226px;
  // }
}
</style>
