<template>
  <div class="scm-pie">
    <scm-row>
      <scm-col :span="22">
        <v-chart ref="chart"
                 class="chart"
                 :options="options">
        </v-chart>
      </scm-col>
      <scm-col :span="2">
        <scm-radio-group v-model="radioSelect"
                         direction="vertical"
                         @change="onClickRadioChange"
                         class="radio-group">
          <scm-radio label="PROJECT_START">项目启动及时率</scm-radio>
          <scm-radio label="PROJECT_END">项目完成及时率</scm-radio>
          <scm-radio label="HANDOVER">合同交接及时率</scm-radio>
          <scm-radio label="SATISFACTION">满意度</scm-radio>
        </scm-radio-group>
      </scm-col>
    </scm-row>
  </div>
</template>
<script>
import { StoreGlobalAPI } from 'scm-sdk';

const FETCH_ECHARTATION_ACTION =
  'report/summaryQueryReport/fetchEchart';
export default {
  name: 'ScmPie',
  props: {
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  data() {
    return {
      radioSelect: 'PROJECT_START',
      options: {
        color: ['#5DADE2'],
        tooltip: {
          triggerOn: 'none',
        },
        label: {},
        xAxis: {
          data: [],
        },
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [{
          type: 'bar',
          barWidth: '20%',
          data: [],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: ['#000'],
          },
        }],
      },
    };
  },
  created() {
    const payload = {
      year: this.year,
      queryCode: this.radioSelect,
    };
    this.postEchartData(payload);
  },
  computed: {
    // 获取 Vuex 中 state 的数据
    ...StoreGlobalAPI.mapState({
      echartDataFromVuex: state => state.report.summaryQueryReport.echartData, // 获取Echart数据}),
    }),
  },
  methods: {
    onClickRadioChange() {
      const payload = {
        year: this.year,
        queryCode: this.radioSelect,
      };
      if (this.radioSelect === 'SATISFACTION') {
        this.options.series[0].label.formatter = '{c}';
      } else {
        this.options.series[0].label.formatter = '{c}%';
      }
      this.postEchartData(payload);
    },
    postEchartData(payload) {
      this.$store.dispatch(FETCH_ECHARTATION_ACTION, payload);
    },
  },
  watch: {
    echartDataFromVuex(newval) {
      if (newval.message === '操作成功') {
        this.options.xAxis.data = newval.data['x-data'];
        this.options.series[0].data = newval.data['y-data'];
      }
    },
    year: {
      immediate: true,
      deep: true,
      handler() {
        const payload = {
          year: this.year,
          queryCode: this.radioSelect,
        };
        this.postEchartData(payload);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.scm-pie {
  position: relative;
  .chart {
    width: 100%;
    height: 300px;
  }
  .radio-group {
    position: absolute;
    bottom: 17%;
    right: 3%;
  }
}
</style>

