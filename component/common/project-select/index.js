import ScmProjectSelect from './src/project-select';

ScmProjectSelect.install = (Vue) => {
  Vue.component(ScmProjectSelect.name, ScmProjectSelect);
};

export default ScmProjectSelect;
