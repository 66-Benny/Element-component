import ScmBpmSubmitCard from './src/bpm-submit';

/* istanbul ignore next */
ScmBpmSubmitCard.install = (Vue) => {
  Vue.component(ScmBpmSubmitCard.name, ScmBpmSubmitCard);
};

export default ScmBpmSubmitCard;
