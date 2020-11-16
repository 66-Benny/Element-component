import ScmFakeBasicLayout from './src/fake-basic-layout.vue';

/* istanbul ignore next */
ScmFakeBasicLayout.install = (Vue) => {
  Vue.component(ScmFakeBasicLayout.name, ScmFakeBasicLayout);
};

export default ScmFakeBasicLayout;

