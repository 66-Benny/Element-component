import ScmAttachmentCard from './src/attachment-card';

/* istanbul ignore next */
ScmAttachmentCard.install = (Vue) => {
  Vue.component(ScmAttachmentCard.name, ScmAttachmentCard);
};

export default ScmAttachmentCard;
