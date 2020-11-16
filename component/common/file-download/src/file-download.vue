<template>
  <form ref="download"
        :name="formName"
        class="file-download-form"
        :action="url"
        :method="method"
        target="_blank">
    <input v-for="param in paramList"
           type="hidden"
           :name="param.key"
           :value="param.value"
           :key="`param-${param.key}`">
  </form>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'ScmFileDownload',
  props: {
    url: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: 'post',
    },
    param: Object,
  },
  data() {
    return {
      paramList: [],
      formName: `form-${Math.random()}`,
    };
  },
  watch: {
    param: {
      immediate: true,
      deep: true,
      handler(val) {
        this.paramList = [];
        if (!_.isEmpty(val)) {
          const paramKeyList = _.keys(val);
          paramKeyList.forEach((key) => {
            let paramValue = val[key];
            // 复合类型转为JSON
            if (_.isObject(paramValue) || _.isArray(paramValue)) {
              try {
                paramValue = JSON.stringify(paramValue);
              } catch (err) {
                throw err;
              }
            }
            this.paramList.push({
              key,
              value: paramValue,
            });
          });
        }
      },
    },
  },
  methods: {
    download() {
      this.$refs.download.submit();
    },
  },
};
</script>
<style lang="scss" scoped>
.file-download-form {
  display: hidden;
}
</style>
