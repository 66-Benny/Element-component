import capacityListSelect from './src/capacity-list-select';

/* istanbul ignore next */
capacityListSelect.install = (Vue) => {
  Vue.component(capacityListSelect.name, capacityListSelect);
};

export default capacityListSelect;
