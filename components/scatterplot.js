import { Scatter, mixins } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

export default {
  extends: Scatter,
  mixins: [mixins.reactiveProp],
  plugins: [ChartDataLabels],
  props: ['options', 'chartData'],
  data () {
    return {
      localOptions: this.options
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.localOptions)
  }
}
