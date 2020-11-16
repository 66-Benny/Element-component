<template>
  <div class="page-loader" v-loading="loading" ref="pageLoader"  :customSrc="srcProxy">

  </div>
</template>
<script>
import { constants } from 'scm-sdk';

const { SYSTEM_CATEGORY } = constants;

export default {
  name: 'PageLoader',
  props: {
    // 窗口打开类型
    type: {
      type: String,
      default: 'iframe',
    },
    // 使用Iframe打开页面的场合，此参数必须输入
    path: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: SYSTEM_CATEGORY.G4,
      validator(value) {
        // 这个值必须匹配下列字符串中的一个
        return !value || Object.values(SYSTEM_CATEGORY).includes(value);
      },
    },
    query: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      loading: true,
      src: null,
      iframeDom: '',
    };
  },
  mounted() {
    // this.$refs.iframe.onload = () => {
    //   const ifDoc = this.$refs.iframe.contentDocument || {};
    //   const ifTitle = ifDoc.title;
    //   if (ifTitle) {
    //     this.loading = false;
    //   }
    // };
  },
  computed: {
    srcProxy() {
      const res = this.category && this.path && this.query;
      this.setSrc();
      return res;
    },
  },
  watch: {
    src() {
      this.loading = true;
    },
  },
  methods: {
    setSrc() {
      const src = `/${this.category}${this.path}?_r=${this.getRandomString()}${this.setUrlParam(this.query)}&isFromPageLoader=1`;
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.setAttribute('frameborder', '0');
      iframe.onload = () => {
        const ifDoc = iframe.contentDocument || {};
        const ifTitle = ifDoc.title;
        if (ifTitle) {
          this.loading = false;
        }
      };
      this.iframeDom = iframe;
      this.$nextTick(() => {
        this.$refs.pageLoader.appendChild(iframe);
      });
    },
    // 移除路由中的信息
    setNullSrc() {
      this.iframeDom.src = null;
      this.$refs.pageLoader.removeChild(this.iframeDom);
    },
    // 获取随机数
    getRandomString() {
      let randomString = '';
      for (let i = 0; i < 20; i += 1) {
        randomString += Math.floor(Math.random() * 10);
      }
      return randomString;
    },
    // 设置参数
    setUrlParam(param, key, encode) {
      if (param == null) return '';
      let paramStr = '';
      const t = typeof param;
      if (t === 'string' || t === 'number' || t === 'boolean') {
        paramStr +=
          `&${
            key
          }=${
            encode == null || encode ? encodeURIComponent(param) : param}`;
      } else {
        Object.keys(param).forEach((i) => {
          const k = key == null
            ? i
            : key + (param instanceof Array ? `[${i}]` : `.${i}`);
          paramStr += this.setUrlParam(param[i], k, encode);
        });
        // for (const i in param) {

        // }
      }
      return paramStr;
    },
  },
};
</script>
<style lang="scss" scoped>
.page-loader {
  width: 100%;
  height: 100%;
}
</style>
