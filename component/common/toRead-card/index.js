import ScmToReadCard from './src/toRead-card';

/* istanbul ignore next */
ScmToReadCard.install = (Vue) => {
  Vue.component(ScmToReadCard.name, ScmToReadCard);
};

export default ScmToReadCard;
