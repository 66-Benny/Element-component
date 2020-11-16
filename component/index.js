import Vue from 'vue';
import ScmUI from 'scm-ui';
import locale from 'scm-ui/lib/locale';
import lang from 'scm-ui/lib/locale/lang/zh-CN';
import '@/style/app.scss';

// 使用中文语言加载Setaria UI
locale.use(lang);

const customComponents = {
};

/**
 * 引入项目所用组件
 * @param {Vue} VueInstance
 */
function install(VueInstance) {
  /* istanbul ignore if */
  if (install.installed) return;
  // 注册SCM UI
  Vue.use(ScmUI, {
    size: 'small',
  });

  // 注册自定义组件
  Object.keys(customComponents).forEach((key) => {
    const component = customComponents[key];
    // 注册组件
    VueInstance.component(component.name, component);
  });
}

const UI = Object.assign({}, {
  install,
});
export default UI;
