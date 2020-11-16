import ScmBpmApproveCard from './src/bpm-approve';

/* istanbul ignore next */
ScmBpmApproveCard.install = (Vue) => {
  Vue.component(ScmBpmApproveCard.name, ScmBpmApproveCard);
};

export default ScmBpmApproveCard;
