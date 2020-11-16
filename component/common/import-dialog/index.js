import ScmImportDialog from './src/import-dialog';

/* istanbul ignore next */
ScmImportDialog.install = (Vue) => {
  Vue.component(ScmImportDialog.name, ScmImportDialog);
};

export default ScmImportDialog;
