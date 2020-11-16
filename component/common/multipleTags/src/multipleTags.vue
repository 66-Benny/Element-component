<template>
  <div class="multipleTags">
    <p class="title">{{title}}：</p>
    <div class="tagsWrap">
      <div>
        <label class="tag selectAllTag" v-if="optionsList.length > 0">
          <input type="checkbox" v-model="selectAllTag" :disabled="selectAllTagDisabled" />
          <span><scm-icon name="submit" :tooltip="false"></scm-icon></span>
        </label>
        <label class="tag" v-for="item in optionsList" :key="item[selfProps.value]">
          <input type="checkbox"
                 :disabled="item.disabled"
                  name="checkbox"
                  v-model="checkboxTag"
                  :value="item[selfProps.value]" />
          <span :title="item.disabled? disabledTitle : ''">{{item[selfProps.label]}}</span>
        </label>
      </div>
    </div>
    <!-- <div>{{checkboxTag}}</div> -->
  </div>
</template>

<script>
// import _ from 'lodsh';

export default {
  name: 'ScmMultipleTags',
  components: {
  },
  props: {
    title: {
      // 标题
      type: String,
    },
    optionsList: {
      // tags列表
      type: Array,
      default() {
        return [];
      },
    },
    props: {
      // 参数变更
      type: Object,
    },
    value: {
      type: Array,
    },
  },
  data() {
    return {
      checkboxTag: [],
      selfProps: {
        label: 'label',
        value: 'value',
      },
      selectAllTag: true,
      unDisabledNum: 0,
      disabledTitle: '该公司下人员不唯一',
    };
  },
  watch: {
    // 修改对应参数字段名
    props: {
      handler(newVal) {
        Object.assign(this.selfProps, newVal);
      },
      immediate: true,
    },
    // 获取可以点击的按钮的数量
    optionsList: {
      handler(newVal) {
        this.unDisabledNum = 0;
        newVal.map((item) => {
          if (!item.disabled) {
            this.unDisabledNum += 1;
          }
          return item;
        });
      },
      immediate: true,
    },
    // 子tag变化时变更全选tag的状态
    checkboxTag: {
      handler(newVal) {
        if (newVal.length === this.unDisabledNum && newVal.length !== 0) {
          this.selectAllTag = true;
        } else {
          this.selectAllTag = false;
        }
        this.$emit('input', this.checkboxTag);
      },
      immediate: true,
    },
    // 全选tag变化时变更子tag的状态
    selectAllTag: {
      handler(newVal) {
        if (newVal) {
          this.checkboxTag = [];
          this.optionsList.map((item) => {
            if (!item.disabled) {
              this.checkboxTag.push(item[this.selfProps.value]);
            }
            return item;
          });
        } else if (!newVal && this.checkboxTag.length === this.unDisabledNum) {
          this.checkboxTag = [];
        }
      },
      immediate: true,
    },
    value: {
      handler(newVal) {
        if (newVal) {
          this.checkboxTag = newVal;
        }
      },
      immediate: true,
    },
  },
  computed: {
    selectAllTagDisabled() {
      return this.checkboxTag.length === 0 && this.checkboxTag.length === this.unDisabledNum;
    },
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss">
  .multipleTags{
    min-height: 23px;
    position: relative;
    color: #000;
    .title{
      position: absolute;
      left: 0;
      // top: 50%;
      // transform: translateY(-50%);
      top: 2px;
      margin: 0;
      padding: 0;
      width: 100px;
      box-sizing: border-box;
      text-align: right;
      color: #666;
    }
    .tagsWrap{
      width: 100;
      box-sizing: border-box;
      padding-left: 100px;
      &>div{
        box-sizing: border-box;
        padding-left: 30px;
        position: relative;
      }
      .tag{
        display: inline-block;
        margin: 2px 15px 2px 0;
        min-width: 96px;
        vertical-align: top;
        height: 23px;
        &.selectAllTag {
          position: absolute;
          left: 2px;
          top: 5px;
          width: 15px;
          min-width: 15px;
          height: 15px;
          margin: 0;
          input{
            &:checked+span{
              background: #fff;
              .el-svg-icon{
                color: #0085d0;
              }
            }
            &:disabled+span{
              border-color: #dcdfe6;
              cursor: no-drop;
              .el-svg-icon{
                cursor: no-drop;
              }
              &:hover{
                border-color: #dcdfe6;
              }
            }
          }
          span{
            width: 100%;
            height: 100%;
            padding: 0;
            &:hover{
              background: #fff;
            }
            .el-svg-icon{
              color: #fff;
              position: absolute;
              left: 2px;
              top: 2px;
            }
          }
        }
        input{
          display: none;
          &:checked+span{
            color: #fff;
            border: 1px solid #0085d0;
            background: #0085d0;
          }
          &:disabled+span{
            color: #ffcece;
            border-color: #ffcece;
            cursor: no-drop;
            .el-svg-icon{
              cursor: no-drop;
            }
            &:hover{
              background: #ffffff;
              color: #ffcece;
              border-color: #ffcece;
            }
          }
        }
        span{
          display: inline-block;
          width: 100%;
          height: 100%;
          border: 1px solid #dcdfe6;
          border-radius: 3px;
          text-align: center;
          padding: 1px 5px;
          cursor: pointer;
          transition: all .3s;
          box-sizing: border-box;
          &:hover{
            background: #71c5f5;
            border: 1px solid #71c5f5;
            color: #fff;
          }
        }
      }
    }
  }
</style>


<style lang="scss" scoped>
</style>
