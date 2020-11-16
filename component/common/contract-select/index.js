import ScmContractSelect from './src/contract-select';

/* istanbul ignore next */
ScmContractSelect.install = (Vue) => {
  Vue.component(ScmContractSelect.name, ScmContractSelect);
};

export default ScmContractSelect;
