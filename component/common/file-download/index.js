import ScmFileDownload from './src/file-download';

/* istanbul ignore next */
ScmFileDownload.install = (Vue) => {
  Vue.component(ScmFileDownload.name, ScmFileDownload);
};

export default ScmFileDownload;
