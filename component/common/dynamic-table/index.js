import ScmDynamicTable from './src/dynamic-table';

/* istanbul ignore next */
ScmDynamicTable.install = (Vue) => {
  Vue.component(ScmDynamicTable.name, ScmDynamicTable);
};

export default ScmDynamicTable;
