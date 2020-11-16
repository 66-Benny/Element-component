import BankSelect from './src/bank-select';

/* istanbul ignore next */
BankSelect.install = (Vue) => {
  Vue.component(BankSelect.name, BankSelect);
};

export default BankSelect;
