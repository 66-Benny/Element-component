import BasicDialog from './src/basic-dialog';

/* istanbul ignore next */
BasicDialog.install = (Vue) => {
  Vue.component(BasicDialog.name, BasicDialog);
};

export default BasicDialog;
