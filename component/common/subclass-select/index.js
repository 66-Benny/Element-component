import SubclassSelect from './src/subclass-select';

/* istanbul ignore next */
SubclassSelect.install = (Vue) => {
  Vue.component(SubclassSelect.name, SubclassSelect);
};

export default SubclassSelect;
