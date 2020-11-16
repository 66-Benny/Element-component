<template>
  <scm-dialog
    :title="title"
    :visible.sync="innerVisible"
    :width="width"
    :append-to-body="innerAppendToBody"
    :show-close="showClose"
    :fullscreen="fullscreen"
    :custom-class="customClass"
    :close-on-press-escape="closeOnPressEscape"
    :close-on-click-modal="closeOnClickModal"
    @opened="onOpened"
    @close="onClose"
    @closed="onClosed"
    class="common-basic-dialog"
    top="5vh">
    <slot></slot>

    <template slot="footer" v-if="$slots.footer">
        <slot name="footer"></slot>
    </template>

  </scm-dialog>
</template>
<script>
export default {
  name: 'BasicDialog',
  props: {
    visible: Boolean,
    title: String,
    width: String,
    showClose: {
      type: Boolean,
      default: true,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    customClass: String,
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
    innerAppendToBody() {
      // 优先使用当前组件的属性
      if (this.appendToBody) {
        return this.appendToBody;
      }
      return this.$parent.appendToBody;
    },
  },
  methods: {
    onOpened() {
      this.$emit('opened');
    },
    onClosed() {
      this.$emit('closed');
    },
    onClose() {
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss">
@import "../../style/basic-dialog-default.scss";
</style>
