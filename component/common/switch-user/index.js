import SwitchUser from './src/switch-user';

/* istanbul ignore next */
SwitchUser.install = (Vue) => {
  Vue.component(SwitchUser.name, SwitchUser);
};

export default SwitchUser;
