import RegionSelect from './src/region-select';

/* istanbul ignore next */
RegionSelect.install = (Vue) => {
  Vue.component(RegionSelect.name, RegionSelect);
};

export default RegionSelect;
