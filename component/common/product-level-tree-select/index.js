import ProductLevelTreeSelect from './src/product-level-tree-select';

/* istanbul ignore next */
ProductLevelTreeSelect.install = (Vue) => {
  Vue.component(ProductLevelTreeSelect.name, ProductLevelTreeSelect);
};

export default ProductLevelTreeSelect;
