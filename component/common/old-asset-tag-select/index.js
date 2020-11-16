import oldAssetTagSelect from './src/old-asset-tag-select';

/* istanbul ignore next */
oldAssetTagSelect.install = (Vue) => {
  Vue.component(oldAssetTagSelect.name, oldAssetTagSelect);
};

export default oldAssetTagSelect;
