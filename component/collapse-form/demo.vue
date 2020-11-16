<template>
  <div>
    <p>正常</p>
    <scm-form :inline="true"
      :model="formInfo"
      class="demo-form-inline"
      ref="ruleForm"
      label-position="left">
      <collapse-form :visible.sync="visible">
        <template slot="base">

          <scm-form-item label="key1">
            <scm-input v-model="formInfo.key1"
              placeholder="请填写">
            </scm-input>
          </scm-form-item>
          <scm-form-item label="key2">
            <scm-input v-model="formInfo.key2"
              placeholder="请填写">
            </scm-input>
          </scm-form-item>

        </template>

         <template slot="collapse">

          <scm-form-item label="key3">
            <scm-input v-model="formInfo.key3"
              placeholder="请填写">
            </scm-input>
          </scm-form-item>
          <scm-form-item label="key4">
            <scm-input v-model="formInfo.key4"
              placeholder="请填写">
            </scm-input>
          </scm-form-item>

        </template>

      </collapse-form>
    </scm-form>

  </div>
</template>

<script>
import CollapseForm from './index';

export default {
  components: { CollapseForm },
  data() {
    return {
      visible: true,
      formInfo: {},
    };
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
};
</script>
<style lang="scss" scoped>

</style>
