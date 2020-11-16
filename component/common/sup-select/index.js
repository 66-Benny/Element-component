import ScmSupSelect from './src/sup-select';

/* istanbul ignore next */
ScmSupSelect.install = (Vue) => {
  Vue.component(ScmSupSelect.name, ScmSupSelect);
};

export default ScmSupSelect;
