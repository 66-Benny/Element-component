import ScmContractXfSelect from './src/contract-xf-select';

/* istanbul ignore next */
ScmContractXfSelect.install = (Vue) => {
  Vue.component(ScmContractXfSelect.name, ScmContractXfSelect);
};

export default ScmContractXfSelect;
