import assetClassOracleSelect from './src/asset-class-oracle-select';

/* istanbul ignore next */
assetClassOracleSelect.install = (Vue) => {
  Vue.component(assetClassOracleSelect.name, assetClassOracleSelect);
};

export default assetClassOracleSelect;
