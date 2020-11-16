import ScmTocSelect from './src/toc-select';

/* istanbul ignore next */
ScmTocSelect.install = (Vue) => {
  Vue.component(ScmTocSelect.name, ScmTocSelect);
};

export default ScmTocSelect;
