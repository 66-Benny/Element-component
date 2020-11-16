import Pie from './src/pie.vue';

/* istanbul ignore next */
Pie.install = (Vue) => {
  Vue.component(Pie.name, Pie);
};

export default Pie;
