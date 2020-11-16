import ProductTreeSelect from './src/product-tree-select';

/* istanbul ignore next */
ProductTreeSelect.install = (Vue) => {
  Vue.component(ProductTreeSelect.name, ProductTreeSelect);
};

export default ProductTreeSelect;
