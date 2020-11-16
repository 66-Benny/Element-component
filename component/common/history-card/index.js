import ScmHistoryCard from './src/history-card';

/* istanbul ignore next */
ScmHistoryCard.install = (Vue) => {
  Vue.component(ScmHistoryCard.name, ScmHistoryCard);
};

export default ScmHistoryCard;
