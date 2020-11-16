<template>
  <basic-dialog :visible.sync="innerVisible"
                title="自定义列表字段"
                width="1000px">
    <scm-dialog-sub-header :title="subtitle">
      <template slot="action">
        <scm-dialog-sub-header-button icon="submit" @click="onSubmit">
          提交
        </scm-dialog-sub-header-button>
      </template>
    </scm-dialog-sub-header>
    <div class="scm-item-visibility-status-list">
      <scm-checkbox :indeterminate="isIndeterminate"
                    v-model="checkAll"
                    @change="handleCheckAllChange">全选</scm-checkbox>
      <scm-row class="item-list">
        <scm-col :xs="24"
                :sm="24"
                :md="8"
                :lg="6"
                v-for="(value, key) in columns"
                :key="key">
          <scm-checkbox-group v-model="checked" @change="handleCheckboxChange">
            <scm-checkbox :disabled="value.disabled"
                          :label="value.label">
              {{ value.title }}
            </scm-checkbox>
          </scm-checkbox-group>
        </scm-col>
      </scm-row>
    </div>
  </basic-dialog>
</template>
<script>
import BasicDialog from '../../basic-dialog';
import BasicDialogMixin from '../../basic-dialog/src/basic-dialog-mixin';

export default {
  name: 'ScmItemVisibilityStatusList',
  mixins: [BasicDialogMixin],
  components: {
    BasicDialog,
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
    subtitle: String,
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      columns: [],
      isIndeterminate: false,
      checkAll: false,
      checked: [],
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.columns = val;
      },
    },
    value: {
      immediate: true,
      handler(val) {
        this.checked = val;
        if (this.checked.length === this.columns.length) {
          this.checkAll = true;
        }
      },
    },
  },
  methods: {
    handleCheckAllChange(val) {
      this.checked = [];
      if (val) {
        this.columns.forEach(item => this.checked.push(item.title));
      }
      this.isIndeterminate = false;
    },
    handleCheckboxChange(val) {
      this.checkAll = val.length === this.columns.length;
      this.isIndeterminate = val.length > 0 && val.length < this.columns.length;
    },
    onSubmit() {
      this.$emit('select', this.checked);
    },
  },
};
</script>
<style lang="scss" scoped>
.scm-item-visibility-status-list {
  .item-list {
    /deep/ {
      label.el-checkbox {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
