import multipleTags from './src/multipleTags';

/* istanbul ignore next */
multipleTags.install = (Vue) => {
  Vue.component(multipleTags.name, multipleTags);
};

export default multipleTags;
