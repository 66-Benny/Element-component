import ScmDbCard from './src/db-card';

/* istanbul ignore next */
ScmDbCard.install = (Vue) => {
  Vue.component(ScmDbCard.name, ScmDbCard);
};

export default ScmDbCard;
