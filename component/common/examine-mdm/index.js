import ScmExamineSelect from './src/examine-mdm';

/* istanbul ignore next */
ScmExamineSelect.install = (Vue) => {
  Vue.component(ScmExamineSelect.name, ScmExamineSelect);
};

export default ScmExamineSelect;
