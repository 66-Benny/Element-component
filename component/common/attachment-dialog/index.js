import attachmentDialog from './src/attachment-dialog';

/* istanbul ignore next */
attachmentDialog.install = (Vue) => {
  Vue.component(attachmentDialog.name, attachmentDialog);
};

export default attachmentDialog;
