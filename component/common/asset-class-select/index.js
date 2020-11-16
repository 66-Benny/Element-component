import assetClassSelect from './src/asset-class-select';

/* istanbul ignore next */
assetClassSelect.install = (Vue) => {
  Vue.component(assetClassSelect.name, assetClassSelect);
};

export default assetClassSelect;
