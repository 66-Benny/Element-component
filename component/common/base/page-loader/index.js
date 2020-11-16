import PageLoader from './src/page-loader';

/* istanbul ignore next */
PageLoader.install = (Vue) => {
  Vue.component(PageLoader.name, PageLoader);
};

export default PageLoader;
