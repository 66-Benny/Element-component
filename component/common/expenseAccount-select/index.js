import ExpenseAccountSelect from './src/expenseAccount-select';

/* istanbul ignore next */
ExpenseAccountSelect.install = (Vue) => {
  Vue.component(ExpenseAccountSelect.name, ExpenseAccountSelect);
};

export default ExpenseAccountSelect;
