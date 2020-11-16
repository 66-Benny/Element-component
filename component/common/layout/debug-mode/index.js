import DebugMode from './src/debug-mode.vue';

/* istanbul ignore next */
DebugMode.install = (Vue) => {
  Vue.component(DebugMode.name, DebugMode);
};

export default DebugMode;

