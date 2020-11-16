/* eslint-disable prefer-destructuring */
import _ from 'lodash';

const FETCH_GETSTARTNODE_ACTION = 'bpm/fetchGetStartNode';
const FETCH_EXAMINE_ACTION = 'bpm/fetchExamine';
const FETCH_FETCHWAY_ACTION = 'bpm/fetchWay';
const FETCH_FETCHWAY1_ACTION = 'bpm/fetchWay1';
const FETCH_FETCHGETNODEROLE_ACTION = 'bpm/fetchGetNodeRole';
const FETCH_UPDATECLEARDATA_ACTION = 'bpm/updateClearData';
const FETCH_UPDATECLEARWAYDATA_ACTION = 'bpm/updateClearWayData';
const FETCH_UPDATECLEARALL_ACTION = 'bpm/updateClearAll';
const FETCH_UPDATECLEARSDTO_ACTION = 'bpm/updateClearSdto';
// const FETCH_UPDATEDELETEPER_ACTION = 'bpm/updateDeletePer';
const FETCH_UPDATESAVEPROID_ACTION = 'bpm/updateSaveProId';
const FETCH_ADDCOMMONLIST_ACTION = 'bpm/fetchAddCommonList';
const FETCH_UPDATESAVEDTOS_ACTION = 'bpm/updateSaveDtos';
const FETCH_UPDATESAVECOUNT_ACTION = 'bpm/updateSaveCount'; // 存入批量审批时procInstIds
const FETCH_UPDATESAVECOUNTERSIGN_ACTION = 'bpm/updateSaveCountersign';
const FETCH_UPDATASAVECOUNTERPER_ACTION = 'bpm/updataSaveCounterPer';
const FETCH_UPDATESAVECON_ACTION = 'bpm/updateSaveCon';
const FETCH_UPDATESAVELEADERCON_ACTION = 'bpm/updateSaveLeaderCon';
const FETCH_UPDATECHANGEISSHOWNEXTPER_ACTION = 'bpm/updateChangeIsShowNextPer';
const FETCH_UPDATEALLIDEA_ACTION = 'bpm/updateAllIdea';
const FETCH_UPDATECHANGESIGNTYPE_ACTION = 'bpm/updateChangeSignType';
const FETCH_UPDATECOUNTERDEPTCOMPANY_ACTION = 'bpm/updateCounterDeptCompany';
// const FETCH_UPDATEAGREE_ACTION = 'bpm/updateAgree';
// const FETCH_UPDATEISSHOWEXAMINE_SERVICE = 'bpm/updateIsShowExamine';
const FETCH_COMMONLIST_ACTION = 'bpm/fetchCommonList';
const FETCH_DELETECOMMONLIST_ACTION = 'bpm/fetchDeleteCommonList';
const FETCH_FETCHGETCOUNTERROLE_ACTION = 'bpm/fetchGetCounterRole';
const FETCH_UPDATECLEAR_SERVICE = 'bpm/updateClear'; // 清空
const FETCH_USERDEPTRECEIVEUSERLIST_SERVICE = 'bpm/userDeptReceiveUserList'; //  审批手动传入下一处理人
const FETCH_USERSUBMITRECEIVEUSERLIST_SERVICE = 'bpm/userSubmitReceiveUserList'; //  提交手动传入下一处理人
const FETCH_UPDATENEXTPROCESSOR_ACTION = 'bpm/updateNextProcessor';
const FETCH_UPDATEINITMUPPER_ACTION = 'bpm/updateInitMupPer';
const FETCH_UPDATESAVEADDRCODE_MUTATION = 'bpm/updateSaveAddrCode';
const FETCH_UPDATESUBMITUSER_MUTATION = 'bpm/updateSubmitUser';
const FETCH_UPDATESINGPER_MUTATION = 'bpm/updateSingPer';
const FETCH_UPDATECLEARNEXTPER_MUTATION = 'bpm/updateClearNextPer';
const FETCH_UPDATECLEARNEXTSTU_MUTATION = 'bpm/updateClearNextStu';
const FETCH_UPDATESAVESIGNPER_MUTATION = 'bpm/updateSaveSignPer';
const FETCH_UPDATESUBSAVESIGN_MUTATION = 'bpm/updateSubSaveSign';
const FETCH_UPDATEGETTYPE_MUTATION = 'bpm/updateGetType';
const FETCH_FETCHGETQUERYSELECTSTYLE_ACTION = 'bpm/fetchGetQuerySelectStyle';
const FETCH_FETCHGETAFFERENTROLES_ACTION = 'bpm/fetchGetAfferentRoles';
// const FETCH_USERDEPTCOMPANY_ACTION = 'bpm/userDeptCompany'; 11-1
// const FETCH_UPDATEDELETEPEREN_ACTION = 'bpm/updateDeletePeren'; 11-1
export default {
  data() {
    return {
      viAddrCode: null,
    };
  },
  props: {
    inputIsApprove: {
      // 默认是否同意
      type: Boolean,
      default: true,
    },
    inputIsApproveDisabled: {
      // 是否禁用同意驳回
      type: Boolean,
      default: false,
    },
    forcedReplacementData: {
      // 强制替换下一处理人(如果是多选时，要给每个人加deptList属性，该属性由业务组自己获取)
      type: Array,
      default() {
        return [];
      },
    },
    filterNextNode: { // 过滤下一路径
      type: Object,
      default() {
        return {
        };
      },
    },
    customCounterSignerList: {
      // 投票会签自定义人员列表；(如果是多选时，要给每个人加deptList属性，该属性由业务组自己获取)
      type: Array,
    },
    isSelectAll: {
      // 投票会签初始化是否全选显示在input，默认true显示；
      type: Boolean,
      default: true,
    },
    addrCode: {
      // 省码
      type: String,
      required: true,
      // default() {
      //   return this.$store.getters['systemConfig/user'].addrCode;
      // },
    },
    voteSignDisabled: {
      // 投票会签禁止编辑
      type: Boolean,
      default: false,
    },
    cityCode: {
      // 地市码
      type: String,
    },
    returnId: {
      // 业务手动传入下一处理人，根据returnId来确定下一路径
      type: String,
      // default: 'sid-DF0E030D-17F7-468B-8EF8-8E5B958032BF',
    },
  },
  computed: {
    // 处理手动传入处理人数据形式
    afferentRoles() {
      return {
        dept: null,
        locationFlag: false,
        role: null,
        type: 1,
        user: _.map(this.receiveUserList, 'value').join(),
      };
    },
    // 根据模块来区分级联显示
    clientBaseUrl() {
      return _.trim(process.env.VUE_APP_CLIENT_BASE_URL, '/');
    },
  },
  watch: {
    'dataInfoLeader.approveOpinion': {
      handler(newValue) {
        this.changeText(newValue);
        this.saveApproveLeader();
      },
    },
    'condition.approveOpinion': {
      handler(newValue) {
        this.changeText(newValue);
        this.saveApprove();
      },
    },
    /*
     *地市码
     *监听市码不为空得情况形式为addrCode_cityCode
     */
    cityCode: {
      immediate: true,
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
    },
    inputIsApprove: {
      handler(newPro) {
        this.condition.viRadio = newPro;
        if (this.dataInfoLeader) {
          this.handleRadioChange(newPro);
        }
      },
      immediate: true,
    },
    procInstIds: {
      handler(newPro) {
        if (_.isArray(newPro) && !_.isEmpty(newPro)) {
          this.$set(this.getProcInstId, 'procInstId', newPro[0]);
          this.$store.commit(FETCH_UPDATESAVECOUNT_ACTION, {
            procInstIds: newPro,
          });
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
    realNameList() {
      // 会签人员初始化显示
      const that = this.rad;
      const { radCas } = this;
      const member = this.examine.data.signDtos;
      const userName = this.realNameList;
      for (let i = 0; i < userName.length; i += 1) {
        if (userName[i]) {
          if (userName[i].length === 1) {
            // 并行会签的时候处理人为一个人的时候
            if (this.isShowCascader) {
              radCas[i] = this.convertData(userName[i], '1');
              member[i].receiveUserId = userName[i][0].value;
            } else {
              this.$nextTick(() => {
                that[i] = userName[i][0].value;
                member[i].receiveUserId = that[i];
              });
            }
          } else {
            that[i] = null;
          }
        }
      }
    },
  },
  mounted() {
    if (this.addrCode) {
      this.$store.commit(FETCH_UPDATESAVEADDRCODE_MUTATION, this.viAddrCode);
    }
    // await this.$store.dispatch(
    //   FETCH_FETCHGETQUERYSELECTSTYLE_ACTION,
    //   { addrCode: this.addrCode, webId: this.clientBaseUrl },
    // );
  },
  destroyed() {},
  created() {
    this.fetchCommonList();
    this.rad = [];
    this.$store.commit(FETCH_UPDATECLEAR_SERVICE, false);
    this.$store.commit(FETCH_UPDATECLEAR_SERVICE, true);
    this.$store.commit(FETCH_UPDATECLEARDATA_ACTION);
    this.$store.commit(FETCH_UPDATECLEARALL_ACTION);
    this.$store.commit(FETCH_UPDATENEXTPROCESSOR_ACTION, { isTrue: true }); // 自动匹配下一处理人正常显示
    this.$store.commit(FETCH_UPDATEINITMUPPER_ACTION, {
      isTrue: false,
      signType: '',
    }); // 投票会签时下一处理人正常显示
  },
  methods: {
    /**
     *
     * @param {*} member
     * @param {*} per
     * @param {*} isShow
     */
    getSelectAllSignPer(member, per, isShow) {
      if (!_.isEmpty(per) && isShow && this.isSelectAll && !this.isShowCascader) {
        this.$nextTick(() => {
          this.dataInfoLeader[member] = _.cloneDeep(_.map(per, 'value'));
          this.dataInfoLeader.viSignPerLabel = _.cloneDeep(_.map(per, 'label'));
          this.saveSdto();
        });
      }
    },
    // 审批校验包括投票会签
    validate() {
      const {
        modelKey,
        taskName,
        approveOpinion,
        type,
        signDtos,
      } = this.examine.data;
      let { nextPer } = this.examine.data;
      if (_.isEmpty(modelKey) && this.isShowExamine === true) {
        this.getMessage('请选择流程');
        return false;
      }
      if (taskName === '结束流程') {
        return true;
      }
      if (_.isEmpty(taskName)) {
        this.getMessage('请选择下一路径');
        return false;
      }
      // 校验并行会签下一处理人
      if (
        _.map(signDtos, 'receiveUserId').some(item => item === null || '') &&
        type === 2
      ) {
        this.getMessage('请选择下一处理人');
        return false;
      }
      if (_.isEmpty(nextPer) && type === 3) {
        nextPer = this.updateUserId;
        if (!this.examine.data.signDtos[0].receiveUserId || this.examine.data.signDtos[0].receiveUserId === '') {
          this.examine.data.signDtos[0].receiveUserId =
            this.updateUserId || this.examine.data.updateUserId;
        }
      }
      if (_.isEmpty(nextPer) && type !== 2) {
        this.getMessage('请选择下一处理人');
        return false;
      }
      if (_.isEmpty(approveOpinion)) {
        this.getMessage('请填写审批意见');
        return false;
      }
      return true;
    },
    getMessage(val) {
      if (this.$el && this.$el.scrollIntoView) {
        this.$el.scrollIntoView(true);
      }
      return this.$message({
        showClose: true,
        message: val,
        type: 'warning',
      });
    },
    // 驳回时可以选择换取流程
    getFecthId(proId) {
      this.fetchWay(this.getProcInstId).then(() => {
        const findPath = this.wayData[0].modelKey;
        this.condition.modelKey = findPath;
        if (this.wayData) {
          this.$nextTick(() => {
            const res = {};
            _.set(res, 'procInstId', proId);
            _.set(res, 'modelKey', findPath);
            this.$store.commit(FETCH_UPDATESAVEPROID_ACTION, res);
            this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
          });
        }
      });
    },
    // 会签功能人物处理公共方法     路径publicData  // con vue中
    publicGetPerInit(publicData, con, selectNextNode) {
      // 对signDtos的清除；
      this.$store.commit(FETCH_UPDATECLEARSDTO_ACTION);
      const params = con;
      const customCounterSignerList = this.customCounterSignerList;
      //  会签存入Dtos处理人信息。
      publicData.forEach((v) => {
        if (!_.isEmpty(v.jointlySign)) {
          v.jointlySign.map((item) => {
            params.viTaskName = item.taskName;
            params.modelKey = item.modelKey;
            params.viProcInstId = item.procInstId;
            params.viApproveUserId = item.approveUserId;
            // 会签的存入dtos中
            this.$store.commit(FETCH_UPDATESAVECOUNTERSIGN_ACTION, item);
            let isFetchPerNode = true;
            let perNode = {};
            if (customCounterSignerList) {
              customCounterSignerList.map((customItem) => {
                if (customItem.taskName === params.viTaskName && customItem.dataList.length > 0) {
                  isFetchPerNode = false;
                  perNode = customItem;
                  perNode.deptList = [];
                }
                return customItem;
              });
            }
            if (isFetchPerNode) {
              this.fetchGetPerNode(params);
            } else {
              this.$store.commit(FETCH_UPDATECOUNTERDEPTCOMPANY_ACTION, perNode);
            }
            return true;
          });
        }
      });
      if (selectNextNode) {
        params.viProcInstId = selectNextNode.procInstId;
        params.viType = selectNextNode.type;
      } else {
        params.viProcInstId = publicData[0].procInstId;
        params.viType = publicData[0].type;
      }
    },
    /**
     *审批页面切换同意与不同意之间，不在请求下一处理人
     *
     * @param {*} publicData
     * @param {*} con
     */
    publicSavePerInit(publicData, con, selectNextNode) {
      // 对signDtos的清除；
      this.$store.commit(FETCH_UPDATECLEARSDTO_ACTION);
      this.rad = [];
      this.radCas = [];
      const params = con;
      //  会签存入Dtos处理人信息。
      publicData.forEach((v) => {
        if (!_.isEmpty(v.jointlySign)) {
          v.jointlySign.map((item) => {
            params.viTaskName = item.taskName;
            params.modelKey = item.modelKey;
            params.viProcInstId = item.procInstId;
            params.viApproveUserId = item.approveUserId;
            // 会签的存入dtos中
            this.$store.commit(FETCH_UPDATESAVECOUNTERSIGN_ACTION, item);
            return true;
          });
        }
      });
      const that = this.rad;
      const { radCas } = this;
      const member = this.examine.data.signDtos;
      const userName = this.realNameList;
      for (let i = 0; i < userName.length; i += 1) {
        if (userName[i]) {
          if (userName[i].length === 1) {
            // 并行会签的时候处理人为一个人的时候
            if (this.isShowCascader) {
              radCas[i] = this.convertData(userName[i], '1');
              member[i].receiveUserId = userName[i][0].value;
            } else {
              this.$nextTick(() => {
                that[i] = userName[i][0].value;
                member[i].receiveUserId = that[i];
              });
            }
          } else {
            that[i] = null;
          }
        }
      }
      if (selectNextNode) {
        params.viProcInstId = selectNextNode.procInstId;
        params.viType = selectNextNode.type;
      } else {
        params.viProcInstId = publicData[0].procInstId;
        params.viType = publicData[0].type;
      }
    },
    // 会签功能关于角色得userId的拼接
    /**
     *
     * @param {*} val
     * @param {*} item
     */
    getNodeRoleNewChange(val, item) {
      this.$store.commit(FETCH_UPDATASAVECOUNTERPER_ACTION, { val, item });
    },
    // 选择可选流程触发事件
    onSelectPath(val) {
      this.condition.viPathNode = '';
      this.condition.viPathLabel = '';
      this.condition.viTaskName = '';
      this.initClearPer();
      this.rad = [];
      this.radCas = [];
      this.$store.commit(FETCH_UPDATECLEAR_SERVICE, true);
      this.$store.commit(FETCH_UPDATECLEARDATA_ACTION);
      this.$store.commit(FETCH_UPDATECLEARWAYDATA_ACTION);
      this.condition.modelLabel = _.find(this.startPathData, ['modelKey', val]).modelName;
      if (this.allProIdData.some(item => item.modelKey === val)) {
        const res = this.allProIdData[
          _.findIndex(this.allProIdData, ['modelKey', val])
        ];
        this.initFetchWay(res);
      } else {
        this.fetchExamine(this.condition).then((res) => {
          this.$store.commit(FETCH_UPDATESAVEPROID_ACTION, res);
          this.initFetchWay(res);
        });
      }
    },
    // 提交审批清除下一处理人数据
    initClearPer() {
      this.condition.viPerson = '';
      this.condition.viPersonLabel = '';
      this.condition.viSingPerson = [];
      this.condition.viSingPersonLabel = [];
      this.condition.viCasePerValue = '';
      this.condition.viCasePerLabel = '';
      this.condition.viCasePerData = [];
      this.$store.commit(FETCH_UPDATECLEARNEXTPER_MUTATION);
    },
    // 存入 sdto中
    initFetchWay(res) {
      // 批量提交时，把procInstIds存入进去。
      // if ((_.isNumber(res.bpmCount) && res.bpmCount >= 1)) {
      this.$store.commit(FETCH_UPDATESAVECOUNT_ACTION, res); // 存入批量审批的procInstIds
      // }
      this.fetchWay(res).then(() => {
        // 是否为会签节点：1普通节点、2会签节点、3会签单分支通过、5会签单分支驳回
        // 会签节点得地方
        if (this.wayData.some(item => item.type === 2)) {
          this.publicGetPerInit(this.wayData, this.condition);
          this.$store.commit(FETCH_UPDATESAVECON_ACTION, this.condition);
        } else {
          this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
        }
      });
    },
    // 可选路径获取下一处理人
    onSelectWay(val) {
      if (this.wayData.length === 1) {
        return;
      }
      if (!_.isNull(val)) {
        this.$emit('onNextNodeChange', {
          value: val,
          selectList: this.condition.viRadio ? this.returnFalseData : this.returnTrueData,
        });
        this.initClearPer();
        // this.examine.data.nextPer = null;
        this.saveSelectWay(val);
        this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
      }
    },
    // 提交审批可选路径公用方法
    saveSelectWay(val) {
      const { condition } = this;
      const member = _.cloneDeep(this.wayData);
      const params = _.find(member, { nextNode: val });
      if (params) {
        condition.viProcInstId = params.procInstId;
        condition.viPathNode = params.nextNode;
        condition.modelKey = params.modelKey;
        condition.viTaskName = params.taskName;
        condition.viId = params.id;
        condition.viTaskType = params.taskType;
        condition.viReturnBack = params.returnBack;
        condition.viType = params.type;
      }
      if (member.some(item => item.type === 2)) {
        return;
      }
      // 强制替换下一处理人逻辑
      const selectForcedReplacementData = this.pickForcedReplacementUserList(params.taskName);
      if (selectForcedReplacementData.length > 0) {
        this.$store.commit(
          FETCH_USERSUBMITRECEIVEUSERLIST_SERVICE,
          selectForcedReplacementData,
        );
        return;
        /*
        提交页面时手动传入角色
        */
      } else if (
        !_.isEmpty(this.receiveUserList) &&
        this.receiveUserIdAutoFlag === 1
        // && (params.id === this.returnId || member.length === 1)
      ) {
        // 手动传入时 页面显示得下一处理人，根据业务传入得taskName来改变下一处理人
        // 初始化又投票会签时下一处理人为普通input；
        if (this.isShowCascader) {
          this.$store.dispatch(FETCH_FETCHGETAFFERENTROLES_ACTION, this.afferentRoles);
        } else {
          this.$store.commit(
            FETCH_USERSUBMITRECEIVEUSERLIST_SERVICE,
            this.receiveUserList,
          );
        }
        return;
      }

      /**
       * !提前存入mapList，禁止发生多次请求下一处理人（11/1日添加）
       * 编号11-1
      */
      // console.log(this.mapList);
      // const mapData = !_.isEmpty(_.filter(this.mapList, params.taskName)) ?
      //   _.filter(this.mapList, params.taskName)[0][params.taskName] : [];
      // console.log(mapData);
      // if (_.isEmpty(mapData)) {
      //   this.fetchGetNodeRole(condition);
      // } else {
      //   this.$store.commit(FETCH_USERDEPTCOMPANY_ACTION, mapData);
      // }
      this.fetchGetNodeRole(condition);
      // this.getCorrect(val);
    },
    // !!解决下一路径请求处理人时间过长，下一处理人数据容易覆盖
    // getCorrect(nextNode) {
    //   this.fetchGetNodeRole(this.condition).then((res) => {
    //     // 清空下一处理人的数据
    //     this.$store.commit(FETCH_UPDATEDELETEPEREN_ACTION);
    //     if (nextNode === this.condition.viPathNode) {
    //       this.$store.commit(FETCH_USERDEPTCOMPANY_ACTION, res);
    //     } else {
    //       // 如果过快会造成无数据，重新背地里请求数据。
    //       this.getCorrect(this.condition.viPathNode);
    //     }
    //   });
    // },
    // 提交审批获取处理人
    onSelectPerson(val) {
      // 审批预览弹窗预留字段 start
      const member = this.personData;
      if (_.isArray(val)) {
        this.condition.viSingPerson = val;
        this.condition.viSingPersonLabel = val.map(v => _.find(member, ['value', v]).label);
        // 多选会签中，置空存入得时候
        if (
          _.isEmpty(this.condition.viSingPerson) &&
          _.isEmpty(this.condition.viSingPersonLabel)
        ) {
          const params = {
            viSingPerson: this.condition.viSingPerson,
            viSingPersonLabel: this.condition.viSingPersonLabel,
          };
          this.$store.commit(FETCH_UPDATESUBSAVESIGN_MUTATION, params);
        }
      } else {
        this.condition.viPersonLabel = _.find(member, ['value', val]).label;
        this.condition.viPerson = val;
      }
      // end
      this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
    },
    // 校验是否有权限启动流程图
    fetchGetStartNode() {
      const { updateUserId, modelName, viAddrCode } = this;
      this.$store.dispatch(FETCH_GETSTARTNODE_ACTION, {
        loginUserId: updateUserId,
        modelName,
        viAddrCode,
      });
    },
    // 会签功能获取人信息
    fetchGetPerNode(params = {}) {
      const { updateUserId, viAddrCode } = this;
      this.$store.dispatch(FETCH_FETCHGETCOUNTERROLE_ACTION, {
        updateUserId,
        ...params,
        viAddrCode,
      });
    },
    // 启动工作流
    fetchExamine(params = {}) {
      const { updateUserId, bpmCount } = this;
      return this.$store.dispatch(FETCH_EXAMINE_ACTION, {
        updateUserId,
        ...params,
        bpmCount,
      });
    },
    // 根据流程ID查询选择流程路径接口
    fetchWay(params = {}) {
      const { updateUserId, filterNextNode } = this;
      return this.$store.dispatch(FETCH_FETCHWAY_ACTION, {
        updateUserId,
        filterNextNode,
        ...params,
      });
    },
    // 会签时根据流程id获取下一路径
    fetchWay1(params = {}) {
      const { updateUserId, filterNextNode } = this;
      return this.$store.dispatch(FETCH_FETCHWAY1_ACTION, {
        updateUserId,
        filterNextNode,
        ...params,
      });
    },
    // 获取处理人
    fetchGetNodeRole(params = {}) {
      const { updateUserId, viAddrCode, voteSignDisabled } = this;
      return this.$store.dispatch(FETCH_FETCHGETNODEROLE_ACTION, {
        updateUserId,
        ...params,
        viAddrCode,
        voteSignDisabled,
      });
    },
    /**
     *  级联提交审批页面逻辑
     * @param {val} 级联数组
     */
    onChangeCasPer(val) {
      const member = this.personData;
      // 多选的数据处理
      if (this.isShowSignPer) {
        const param = _.uniq(_.map(val, n => n[1]));
        this.condition.viCasePerValue = param;
        this.condition.viCasePerLabel = param.map(v => _.find(member, ['value', v]).label);
      } else {
        const perStr = val[1];
        this.condition.viCasePerLabel = _.find(member, ['value', perStr]).label;
        this.condition.viCasePerValue = perStr;
      }
      this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
    },
    // ===============================领导审批功能===============================//
    //
    // 同意/不同意事件切换
    handleRadioChange(val) {
      this.$store.commit(FETCH_UPDATECLEARSDTO_ACTION);
      this.dataInfoLeader.approveOpinion = val ? '同意' : '不同意';
      this.input = 160 - this.dataInfoLeader.approveOpinion.length;
      this.$store.commit(FETCH_UPDATECHANGESIGNTYPE_ACTION, val);
      this.saveSdto(this.getNextNodeInfo());
    },
    // 数据情况为为一得情况
    savePathZero(val, con, convalue, radio) {
      if (val && val.length === 1) {
        this.$nextTick(() => {
          this.dataInfoLeader[con] = val[0].taskName;
          this.dataInfoLeader[convalue] = val[0].nextNode;
          this.initPath(val[0].nextNode, radio);
          this.saveSdto(this.getNextNodeInfo());
        });
      }
    },
    // 改变下一路径
    getNextNodesChange(val) {
      this.$emit('onNextNodeChange', {
        value: val,
        selectList: this.condition.viRadio ? this.returnFalseData : this.returnTrueData,
      });
      const { viRadio } = this.condition;
      const { dataInfoLeader } = this;
      // 如果下一路径唯一得话，点击不触发事件去请求下一处理人。
      if (this.returnFalseData.length === 1 && viRadio) {
        return;
      } else if (this.returnTrueData.length === 1 && !viRadio) {
        return;
      }
      // 根据不同状态，切换清空得下一处理人。
      if (viRadio) {
        dataInfoLeader.viSignPer = [];
        dataInfoLeader.viSignPerLabel = [];
        dataInfoLeader.viTitle = '';
        dataInfoLeader.viTitleValue = '';
        dataInfoLeader.viTitleLabel = '';
        dataInfoLeader.viCaseTrueData = []; // 同意
        dataInfoLeader.viCaseTrueLabel = '';
        dataInfoLeader.viCaseTrueValue = '';
        this.$store.commit(FETCH_UPDATECLEARNEXTSTU_MUTATION, viRadio);
      } else {
        // dataInfoLeader.viRebutPer = [];
        dataInfoLeader.viPeople = '';
        dataInfoLeader.viPeopleValue = '';
        dataInfoLeader.viPeopleLabel = '';
        dataInfoLeader.viCaseFalseData = []; // 不同意
        dataInfoLeader.viCaseFalseLabel = '';
        dataInfoLeader.viCaseFalseValue = '';
        this.$store.commit(FETCH_UPDATECLEARNEXTSTU_MUTATION, viRadio);
      }
      // this.$store.commit(FETCH_UPDATEDELETEPER_ACTION);
      // 会签节点得地方
      let selectNodeInfo = {};
      this.returnFalseData.forEach((i) => {
        if (i.nextNode === val) {
          selectNodeInfo = i;
        }
      });
      if (selectNodeInfo.type === 2 && viRadio) {
        this.$store.commit('bpm/updateCardShowHide', selectNodeInfo);
        this.publicGetPerInit(this.returnFalseData, dataInfoLeader, selectNodeInfo);
        this.$store.commit(FETCH_UPDATESAVELEADERCON_ACTION, dataInfoLeader);
      } else {
        if (viRadio) {
          this.$store.commit('bpm/updateCardShowHide', selectNodeInfo);
        }
        this.initPath(val, viRadio);
        this.$nextTick(() => {
          this.saveSdto(selectNodeInfo);
        });
      }
      // 当流程结束得时候
      if (!this.isShowNextPer) {
        this.saveSdto();
      }
    },
    // 获取下一路径的详细信息
    getNextNodeInfo() {
      let selectNodeInfo;
      this.returnFalseData.forEach((i) => {
        if (i.nextNode === this.dataInfoLeader.viTargetNode) {
          selectNodeInfo = i;
        }
      });
      return selectNodeInfo;
    },
    // 审批页面存入选入值得公用方法
    initPath(item, radio) {
      const member = radio ? this.returnFalseData : this.returnTrueData;
      const params = _.find(member, { nextNode: item });
      const { argreeData, notArgreeData } = this;
      // 审批同意时
      if (params && radio) {
        argreeData.viProcInstId = params.procInstId;
        argreeData.viTaskName = params.taskName;
        argreeData.viId = params.id;
        argreeData.modelKey = params.modelKey;
        argreeData.viTaskType = params.taskType;
        argreeData.viReturnBack = params.returnBack;
        argreeData.viType = params.type;
        argreeData.viRadio = radio;
        argreeData.viAllNode = item;
        if (params.taskName === '结束流程') {
          this.$store.commit(FETCH_UPDATECHANGEISSHOWNEXTPER_ACTION, false);
          return;
        }
        this.$store.commit(FETCH_UPDATECHANGEISSHOWNEXTPER_ACTION, true);
        // 强制替换下一处理人逻辑
        const selectForcedReplacementData = this.pickForcedReplacementUserList(params.taskName);
        if (selectForcedReplacementData.length > 0) {
          this.$store.commit(
            FETCH_USERDEPTRECEIVEUSERLIST_SERVICE,
            selectForcedReplacementData,
          );
        } else if (
          !_.isEmpty(this.receiveUserList) &&
          this.receiveUserIdAutoFlag === 1 &&
          (params.id === this.returnId || this.returnFalseData.length === 1)
        ) {
          // 手动传入时 页面显示得下一处理人，根据业务传入得taskName来改变下一处理人
          // 初始化又投票会签时下一处理人为普通input；
          this.$store.commit(FETCH_UPDATESINGPER_MUTATION, {
            isTrue: false,
            signType: 0,
            radio,
          });
          // 审批页面 关于级联时候手动传入处理人
          if (this.isShowCascader) {
            this.$store.dispatch(
              FETCH_FETCHGETAFFERENTROLES_ACTION,
              { ...this.afferentRoles, viRadio: true },
            );
          } else {
            this.$store.commit(
              FETCH_USERDEPTRECEIVEUSERLIST_SERVICE,
              this.receiveUserList,
            );
          }
        } else {
          let selectNodeInfo = {};
          this.returnFalseData.forEach((i) => {
            if (i.nextNode === item) {
              selectNodeInfo = i;
            }
          });
          // 下一路劲为会签得时候，不通过下一路径来获取下一处理人。
          if (selectNodeInfo.type === 2) {
            return;
          }
          // 获取下一处理人
          this.fetchGetNodeRole(argreeData);
        }
      } else {
        // 审批不同意时
        notArgreeData.viProcInstId = params.procInstId;
        notArgreeData.viTaskName = params.taskName;
        notArgreeData.viId = params.id;
        notArgreeData.modelKey = params.modelKey;
        notArgreeData.viTaskType = params.taskType;
        notArgreeData.viReturnBack = params.returnBack;
        notArgreeData.viType = params.type;
        notArgreeData.viApproveUserId = params.approveUserId;
        notArgreeData.viRadio = radio;
        notArgreeData.viAllNode = item;
        // 批量审批中下一处理人驳回状态 true为固定处理人 {label:'提交人',value: 'submitUser'}
        if (this.isSubmitUser) {
          const submitUser = [
            {
              label: '提交人',
              value: 'submitUser',
            },
          ];
          this.$store.commit(FETCH_UPDATESUBMITUSER_MUTATION, submitUser);
        } else {
          this.fetchGetNodeRole(notArgreeData);
        }
      }
    },
    // 通过所选择的taskName，挑选出需要强制替换的下一处理人列表
    pickForcedReplacementUserList(taskName) {
      let userList = [];
      if (this.forcedReplacementData && this.forcedReplacementData.length > 0) {
        this.forcedReplacementData.forEach((item) => {
          if (item.taskName === taskName && item.userList) {
            userList = item.userList;
          }
        });
      }
      return userList;
    },
    // 改变下一处理人
    getNodeRolechange(val) {
      if (this.condition.viRadio) {
        // 投票会签
        if (_.isArray(val)) {
          this.dataInfoLeader.viSignPer = val;
          // 为预览卡片留着预留字段
          this.dataInfoLeader.viSignPerLabel = val.map(v => _.find(this.truePer, ['value', v]).label);
          if (
            _.isEmpty(this.dataInfoLeader.viSignPer) &&
            _.isEmpty(this.dataInfoLeader.viSignPerLabel)
          ) {
            const params = {
              viSignPer: this.dataInfoLeader.viSignPer,
              viSignPerLabel: this.dataInfoLeader.viSignPerLabel,
            };
            this.$store.commit(FETCH_UPDATESAVESIGNPER_MUTATION, params);
          }
        } else {
          this.dataInfoLeader.viTitleValue = val;
          // 为预览卡片留着预留字段
          this.dataInfoLeader.viTitleLabel = _.find(this.truePer, [
            'value',
            val,
          ]).label;
        }
      } else if (!this.condition.viRadio) {
        // if (_.isArray(val)) {
        //   this.dataInfoLeader.viRebutPer = val;
        // } else {
        this.dataInfoLeader.viPeopleValue = val;
        // 为预览卡片留着预留字段
        this.dataInfoLeader.viPeopleLabel = _.find(this.falsePer, [
          'value',
          val,
        ]).label;
        // }
      }
      this.saveSdto();
    },
    /**
     * 审批状态下得下一处理人改变事件
     * @param {*} val
     */
    onChangeApproveRole(val) {
      if (this.condition.viRadio) {
        const memberTrue = this.truePer;
        if (this.isShowSignPer) {
          // 投票会签
          const param = _.uniq(_.map(val, n => n[1]));
          this.dataInfoLeader.viCaseTrueValue = param.join();
          this.dataInfoLeader.viCaseTrueLabel = param.map(v => _.find(memberTrue, ['value', v]).label).join();
        } else {
          const perApproveStrTrue = val[1];
          this.dataInfoLeader.viCaseTrueValue = perApproveStrTrue;
          this.dataInfoLeader.viCaseTrueLabel = _.find(memberTrue, [
            'value',
            perApproveStrTrue,
          ]).label;
        }
      } else if (!this.condition.viRadio) {
        const perApproveStrFalse = val[1];
        this.dataInfoLeader.viCaseFalseValue = perApproveStrFalse;
        this.dataInfoLeader.viCaseFalseLabel = _.find(this.falsePer, [
          'value',
          perApproveStrFalse,
        ]).label;
      }
      this.saveSdto();
    },
    // 切换到会签节点时的处理方法
    countersignMethod(dataInfoLeader) {
      if (_.isEmpty(this.realNameList)) {
        this.publicGetPerInit(this.returnFalseData, dataInfoLeader);
      } else {
        this.publicSavePerInit(this.returnFalseData, dataInfoLeader, this.getNextNodeInfo());
      }
      this.$store.commit(FETCH_UPDATESAVELEADERCON_ACTION, dataInfoLeader);
      // 审批页面，固定赋值，并行会签是否多选，固定处理人。
      this.$store.commit(FETCH_UPDATEGETTYPE_MUTATION, {
        delegatorType: 1,
        radio: true,
      });
      this.$store.commit(FETCH_UPDATESINGPER_MUTATION, {
        isTrue: false,
        signType: 0,
        radio: true,
      });
    },
    // 切换到非会签节点时的处理方法
    nonCountersignMethod(dataInfoLeader, argreeDatas) {
      const argreeData = argreeDatas;
      argreeData.viAllTitle = dataInfoLeader.viTitleValue;
      // !
      argreeData.viNextPer = dataInfoLeader.viTitleLabel;
      argreeData.viSignPer = dataInfoLeader.viSignPer;
      // !
      // 级联存入得字段
      argreeData.viCaseNextPer = dataInfoLeader.viCaseTrueLabel;
      argreeData.viCaseAllPer = dataInfoLeader.viCaseTrueValue;

      argreeData.viSignPerLabel = dataInfoLeader.viSignPerLabel;
      argreeData.approveOpinion = dataInfoLeader.approveOpinion;
      argreeData.ifAgrees = 1;
      this.$store.commit(FETCH_UPDATEALLIDEA_ACTION, argreeData);
    },
    // 拼接sdto
    saveSdto(selectNodeInfo) {
      console.log(selectNodeInfo);
      const {
        argreeData, notArgreeData, dataInfoLeader, isSubmitUser,
      } = this;
      if (this.condition.viRadio) {
        // 会签节点得地方 item.type === 2
        if (selectNodeInfo) {
          // 这一分支是为了解决，下一路径会同时出现会签及非会签节点的处理
          if (selectNodeInfo.type === 2) {
            this.countersignMethod(dataInfoLeader);
          } else {
            this.$store.commit(FETCH_UPDATECLEARSDTO_ACTION);
            this.nonCountersignMethod(dataInfoLeader, argreeData);
          }
        } else if (this.returnFalseData.some(item => item.type === 2)) {
          this.countersignMethod(dataInfoLeader);
          // if (_.isEmpty(this.realNameList)) {
          //   this.publicGetPerInit(this.returnFalseData, dataInfoLeader);
          // } else {
          //   this.publicSavePerInit(this.returnFalseData, dataInfoLeader);
          // }
          // this.$store.commit(FETCH_UPDATESAVELEADERCON_ACTION, dataInfoLeader);
          // // 审批页面，固定赋值，并行会签是否多选，固定处理人。
          // this.$store.commit(FETCH_UPDATEGETTYPE_MUTATION, {
          //   delegatorType: 1,
          //   radio: true,
          // });
          // this.$store.commit(FETCH_UPDATESINGPER_MUTATION, {
          //   isTrue: false,
          //   signType: 0,
          //   radio: true,
          // });
        } else {
          this.nonCountersignMethod(dataInfoLeader, argreeData);
          // argreeData.viAllTitle = dataInfoLeader.viTitleValue;
          // // !
          // argreeData.viNextPer = dataInfoLeader.viTitleLabel;
          // argreeData.viSignPer = dataInfoLeader.viSignPer;
          // // !
          // // 级联存入得字段
          // argreeData.viCaseNextPer = dataInfoLeader.viCaseTrueLabel;
          // argreeData.viCaseAllPer = dataInfoLeader.viCaseTrueValue;

          // argreeData.viSignPerLabel = dataInfoLeader.viSignPerLabel;
          // argreeData.approveOpinion = dataInfoLeader.approveOpinion;
          // argreeData.ifAgrees = 1;
          // this.$store.commit(FETCH_UPDATEALLIDEA_ACTION, argreeData);
        }
      } else {
        notArgreeData.viAllTitle = dataInfoLeader.viPeopleValue;
        // !
        notArgreeData.viNextPer = dataInfoLeader.viPeopleLabel;
        // 级联存入得字段
        notArgreeData.viCaseNextPer = dataInfoLeader.viCaseFalseLabel;
        notArgreeData.viCaseAllPer = dataInfoLeader.viCaseFalseValue;
        // notArgreeData.viSignPer = dataInfoLeader.viRebutPer;
        notArgreeData.approveOpinion = dataInfoLeader.approveOpinion;
        notArgreeData.ifAgrees = 0;
        // 批量审批弹窗 ，驳回
        notArgreeData.submitUser = isSubmitUser;
        this.$store.commit(FETCH_UPDATEALLIDEA_ACTION, notArgreeData);
      }
    },
    // 常用语 方法  《==============》
    fetchCommonList() {
      const { updateUserId } = this;
      this.$store.dispatch(FETCH_COMMONLIST_ACTION, {
        userId: updateUserId,
      });
    },
    // 删除常用语
    fetchDeleteCommonList(val) {
      return this.$store.dispatch(FETCH_DELETECOMMONLIST_ACTION, val);
    },
    outStyle(item) {
      this.$set(item, 'active', false);
    },
    selectStyle(item) {
      const self = this;
      this.$nextTick(() => {
        this.phrasesData.forEach((v) => {
          self.$set(v, 'active', false);
        });
        this.$set(item, 'active', true);
      });
    },
    onEditor(val) {
      if (this.isShowExamine) {
        this.condition.approveOpinion = val;
        this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
        this.input = 160 - this.condition.approveOpinion.length;
      } else {
        this.dataInfoLeader.approveOpinion = val;
        this.examine.data.approveOpinion = this.dataInfoLeader.approveOpinion;
        this.input = 160 - this.dataInfoLeader.approveOpinion.length;
      }
    },
    onDeleteRow(index) {
      this.$confirm('您确定要删除该常用批语吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          const member = this.phrasesData[index].id;
          this.fetchDeleteCommonList(member).then(() => {
            this.fetchCommonList();
          });
          this.$message({
            fullscreen: true,
            type: 'success',
            message: '常用批语被删除',
          });
        })
        .catch(() => {
          this.$message({
            fullscreen: true,
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    onAddCriticize() {
      this.saveCriticle(this.condition.approveOpinion, this.condition);
    },
    onAddCriticize1() {
      this.saveCriticle(
        this.dataInfoLeader.approveOpinion,
        this.dataInfoLeader,
      );
    },
    saveCriticle(app, cond) {
      if (_.isEmpty(app)) {
        this.$message({
          showClose: true,
          message: '请输入审批意见!',
          type: 'warning',
        });
      } else {
        this.fetchAddCommonList(cond).then(() => {
          // this.fetchCommonList();
          this.$message({
            fullscreen: true,
            type: 'success',
            message: '添加成功',
          });
        });
      }
    },
    saveApprove() {
      this.$store.commit(FETCH_UPDATESAVEDTOS_ACTION, this.condition);
    },
    saveApproveLeader() {
      this.examine.data.approveOpinion = this.dataInfoLeader.approveOpinion;
    },
    changeText(val) {
      this.input = 160 - (val ? val.length : 0);
    },
    fetchAddCommonList(params = {}) {
      const { updateUserId } = this;
      return this.$store.dispatch(FETCH_ADDCOMMONLIST_ACTION, {
        userId: updateUserId,
        ...params,
      });
    },
    /**
     *
     * @param {*} resData 会签传入得下一处理人数组形式
     * 显示options的格式
     */
    convertSignData(resData) {
      const casSign = _.cloneDeep(resData);
      const count = casSign.length;
      const arr = [];
      for (let i = 0; i < count; i += 1) {
        if (this.isShowCascader) {
          arr[i] = _.cloneDeep(this.convertData(casSign[i]));
        }
      }
      return arr;
    },
    /**
     *  对处理人数据进行处理
     * 转换成级联所需要的数据格式
     * @param {*} responseData
     * @param {*} flag '0' 返回级联需求数据 '1'自动显示在页面上得数据格式 "2" 投票会签显示格式
     */
    convertData(responseData, flag) {
      if (_.isEmpty(responseData)) {
        return [];
      }
      if (flag === '0' && !this.isShowCascader) {
        return [];
      }
      const arr = []; // 各个处理人得部门集合（会有重复）
      if (flag === '1') {
        // 自动显示在页面上得数据格式
        const arrDeotList = _.cloneDeep(responseData[0].deptList);
        const arrOnce = [arrDeotList[0].orgCode, responseData[0].value];
        return arrOnce;
      }
      if (flag === '2') {
        // 自动显示在页面上得数据格式投票会签
        const mupArrDeptList = _.map(responseData, n => [
          n.deptList[0].orgCode,
          n.value,
        ]);
        return mupArrDeptList;
      }
      for (let i = 0; i < responseData.length; i += 1) {
        const member = {
          value: responseData[i].value,
          label: responseData[i].label,
        };
        // 把每个处理人挂在对象中得部门当中
        responseData[i].deptList.map((v) => {
          const item = v;
          item.children = [member];
          item.label = v.deptName;
          item.value = v.orgCode;
          return item;
        });
        //  提取出来一个部门得数组
        _(responseData[i].deptList).forEach((h) => {
          const y = h;
          arr.push(y);
        });
      }
      // 根据部门orgCode去重之后部门集合
      const arr2 = _.uniqBy(arr, 'orgCode');
      // 进行二次循环，把处理人挂在各个部门之下
      arr.map((v) => {
        arr2.map((t) => {
          const item = t;
          if (v.value === t.value) {
            item.children = _.uniqBy(
              [...item.children, ...v.children],
              'value',
            );
          }
          return item;
        });
        return v;
      });
      // 得到arr2为最后得级联数据格式
      return arr2;
    },
  },
};
