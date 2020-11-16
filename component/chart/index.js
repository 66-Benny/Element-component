import Vue from 'vue';
import ECharts from 'vue-echarts-ex/components/ECharts.vue';
import 'echarts';
import Pie from './pie';

Vue.component('v-chart', ECharts);

export default {
  Pie,
};
