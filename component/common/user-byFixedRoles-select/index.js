import userByFixedRolesSelect from './src/user-byFixedRoles-select';

/* istanbul ignore next */
userByFixedRolesSelect.install = (Vue) => {
  Vue.component(userByFixedRolesSelect.name, userByFixedRolesSelect);
};

export default userByFixedRolesSelect;
