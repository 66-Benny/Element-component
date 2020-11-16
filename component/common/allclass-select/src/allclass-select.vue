<!-- 搜索帮助（大中小类）-->
<template>
  <basic-dialog :visible.sync="innerVisible"
                title="产品选择"
                width="800px">
    <div class="allclass-select">
      <scm-dialog-sub-header title="大中小产品选择">
        <template slot="action">
          <scm-divider type="vertical"
                       v-if="nullValue"></scm-divider>
          <scm-dialog-sub-header-button icon="previous"
                                        v-if="nullValue"
                                        @click="onPrevious">
            返回空值
          </scm-dialog-sub-header-button>
        </template>
      </scm-dialog-sub-header>
      <div class="allclass">
        <div class="allclass-menu">
          <scm-auto-menu class="all-menu"
                         :data="opitree"
                         :isShowAutomenu="isShowmenu"
                         @getCodename="codeNamedata"
                         @select="handleSelect"></scm-auto-menu>
        </div>
      </div>
    </div>
  </basic-dialog>
</template>
<script>
// import _ from 'lodash';
import { StoreGlobalAPI } from 'scm-sdk';
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';
import ScmAutoMenu from '../../menutoo/scm-auto-menu';

const FETCH_OPITREE_ACTION = 'mdm/fetchOpiTree';

export default {
  name: 'ScmOpiSelect',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
    ScmAutoMenu,
  },
  props: {
    addrCode: { // 省码
      type: String,
      default() {
        return this.$store.getters['systemConfig/user'].addrCode;
      },
    },
    viproductType: {
      // 1 == 目录产品 2 == 细化产品
      required: true,
      type: String,
      default: '2',
    },
    zfbprod: {
      // 非标产品标识(1:一采非标;2:二采非标;3:标准产品; 空值：全部产品)
      type: String,
      default: '3',
    },
    viTopoType: {
      // 采购类型(1:一级集采;2:二级集采;3:非集采;空值：全部类型)
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      activeIndex: '1',
      esopiData: '',
      cloneCondition: {},
      isShowmenu: true,
      opitree: [],
    };
  },
  computed: {
    ...StoreGlobalAPI.mapState({
      fetchOpiLoading: state => state.loading.actions[FETCH_OPITREE_ACTION],
      // opitree: state => state.mdm.OpiTree,
    }),
  },
  destroyed() {
    this.isShowmenu = true;
  },
  mounted() {
    this.fetchOpiTree();
    if (this.viTopoType === '1') {
      this.poType = this.viTopoType1;
      this.condition.viProType = '1';
    } else if (this.viTopoType === '2') {
      this.poType = this.viTopoType2;
      this.condition.viProType = '2';
    }
  },
  methods: {
    handleSelect(key, keyPath, val) {
      // console.log(key);
      // console.log(keyPath);
      // console.log(val);
      this.$emit('select', val.$attrs.value);
      // this.isShowmenu = false;
    },
    codeNamedata(val) {
      console.log(val);
      this.$emit('select', val);
      this.isShowmenu = false;
    },
    onPrevious() {
      this.$emit('select', this.esopiData);
    },
    fetchOpiTree() {
      // 产品树的获取
      const {
        viproductType, addrCode, zfbprod, viTopoType,
      } = this;
      this.$store.dispatch(FETCH_OPITREE_ACTION, {
        viproductType,
        addrCode,
        zfbprod,
        viTopoType,
      }).then((res) => {
        this.opitree = res;
      });
    },
  },
};
</script>
<style lang="scss" scope>
.allclass-select {
  .allclass {
    height: 500px;
    .allclass-menu {
      display: inline-block;
      height: 100%;
      overflow-y: scroll;
      .all-menu {
        width: 255px;
        /deep/ {
          .el-submenu {
            & > .el-submenu__title {
              border-bottom: 1px dashed #cccccc;
            }
          }
        }
      }
    }
  }
}
</style>
