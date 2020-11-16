import ScmAttachmentBasic from './src/attachment-basic';

/* istanbul ignore next */
ScmAttachmentBasic.install = (Vue) => {
  Vue.component(ScmAttachmentBasic.name, ScmAttachmentBasic);
};

export default ScmAttachmentBasic;
