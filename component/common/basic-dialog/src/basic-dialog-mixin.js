export default {
  props: {
    // 是否显示对话框
    visible: Boolean,
    openRefresh: {
      // 是否开启打开刷新列表
      type: Boolean,
      default: false,
    },
    // 在Dialog打开时是否自动根据默认查询条件进行查询操作，默认为 `false`
    autoSearch: Boolean,
    appendToBody: {
      type: Boolean,
      default: false,
    },
    nullValue: {
      // 返回空值的显示与隐藏
      type: Boolean,
      default: false,
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false,
    },
    showClose: {
      // 是否显示关闭按钮
      type: Boolean,
      default: true,
    },
    closeOnPressEscape: {
      // 是否可以通过按下 ESC 关闭 Dialog
      type: Boolean,
      default: true,
    },
    closeOnClickModal: {
      // 是否可以通过点击 modal 关闭 Dialog
      type: Boolean,
      default: true,
    },
    // 对查询查询条件和查询结果的控制属性（是否可见，是否可用）
    customize: {
      type: Object,
      default() {
        return {
          // 查询条件
          condition: {
            viErpMapName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            bgLineNum: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            bgItemName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            bnActName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            bnAct: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            bgResDep: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: false,
            },
            corName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: false,
            },
            corMode: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: false,
            },
            annual: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viEmployeeName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viRoleName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viIProvinces: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // disabled: true,
            },
            viPosition: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viUserName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viEmployeeType: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viStr: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            smallName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            proName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            proType: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viProjectID: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viProjectName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viOUID: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viOUName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viProjectCode: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viManager: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            supNum: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            supName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            contractName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            unitNum: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            unitName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viProductCode: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viDataValue: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viSelectValue: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viCompany: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viDepartmentName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viCompanyName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
          },
          // 查询结果
          searchResult: {
            viErpMapName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，false为不可见
              // autoSearch: true,
            },
            bgLineNum: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            bgItemName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            bnActName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            bnAct: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            bgResDep: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            corName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            corMode: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            annual: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viEmployeeName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viRoleName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viIProvinces: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // disabled: true,
            },
            viPosition: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viUserName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viEmployeeType: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viStr: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            smallName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            proName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            proType: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viProjectID: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viProjectName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viOUID: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viOUName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viProjectCode: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viManager: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            supNum: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            supName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            contractName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            unitNum: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            unitName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viProductCode: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viDataValue: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viSelectValue: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viCompany: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viDepartmentName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
            viCompanyName: {
              // // 是否显示, false为不显示
              // visible: true,
              // // 是否可用，true为不可用
              // autoSearch: true,
            },
          },
        };
      },
    },
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
};
