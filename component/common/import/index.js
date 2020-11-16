import ScmImport from './src/import-dialog';

/* istanbul ignore next */
ScmImport.install = (Vue) => {
  Vue.component(ScmImport.name, ScmImport);
};

export default ScmImport;
