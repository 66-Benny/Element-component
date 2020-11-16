import ScmUserSelect from './src/user-select';

/* istanbul ignore next */
ScmUserSelect.install = (Vue) => {
  Vue.component(ScmUserSelect.name, ScmUserSelect);
};

export default ScmUserSelect;
