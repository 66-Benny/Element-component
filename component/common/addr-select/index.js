import AddrSelect from './src/addr-select';

/* istanbul ignore next */
AddrSelect.install = (Vue) => {
  Vue.component(AddrSelect.name, AddrSelect);
};

export default AddrSelect;
