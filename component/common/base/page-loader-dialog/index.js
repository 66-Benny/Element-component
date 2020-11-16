import PageLoaderDialog from './src/page-loader-dialog.vue';

/* istanbul ignore next */
PageLoaderDialog.install = (Vue) => {
  Vue.component(PageLoaderDialog.name, PageLoaderDialog);
};

export default PageLoaderDialog;
