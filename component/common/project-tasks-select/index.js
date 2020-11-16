import ProjectTasksSelect from './src/project-tasks-select';

/* istanbul ignore next */
ProjectTasksSelect.install = (Vue) => {
  Vue.component(ProjectTasksSelect.name, ProjectTasksSelect);
};

export default ProjectTasksSelect;
