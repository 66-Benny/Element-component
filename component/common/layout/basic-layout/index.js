import ScmBasicLayout from './src/basic-layout.vue';

/* istanbul ignore next */
ScmBasicLayout.install = (Vue) => {
  Vue.component(ScmBasicLayout.name, ScmBasicLayout);
};

export default ScmBasicLayout;

