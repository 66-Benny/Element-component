import ScmBpmHistoryCard from './src/bpm-history-card';

/* istanbul ignore next */
ScmBpmHistoryCard.install = (Vue) => {
  Vue.component(ScmBpmHistoryCard.name, ScmBpmHistoryCard);
};

export default ScmBpmHistoryCard;
