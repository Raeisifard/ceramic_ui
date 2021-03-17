<template>
  <div id="container" :style="styles"></div>
</template>

<script>
import Highcharts from 'highcharts';
// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module.
Exporting(Highcharts);
import { mapState } from "vuex";
import { EventBus } from "@/event-bus";

export default {
  name: "highchartsLine",
  data: function() {
    return {
      chartData: {
        labels: [],
        datasets: []
      },
      options: this.cell.getData().setting.options,
      adaptor: () => {
      },
      code: this.cell.getData().setting.adaptor,
      chart: null,
      graph: null
    }
  },
  props: {
    cell: {
      type: Object,
      default: null
    },
    store: {
      type: Object,
      default: null
    },
    styles: {}
  },
  methods: {
    fillData01() {
      return {
        labels: [this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f8ac79',
            data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(),
              this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt()]
          }, {
            label: 'Data Two',
            backgroundColor: '#8ce368',
            data: [this.getRandomInt(), this.getRandomInt()]
          }
        ]
      }
    },
    fillData() {
      return {
        labels: [this.getRandomInt()],
        datasets: [
          {
            label: 'Data One',
            data: [this.getRandomInt(), this.getRandomInt()]
          }
        ]
      }
    },
    getRandomInt() {
      return Math.floor(Math.random() * ( 100 ))
    }
  },
  created() {
    this.$store = this.store;
  },
  computed: {
    ...mapState([
      'graphStatus', 'graphState', 'graphId'
    ]),
    /*code: function() {
      return this.cell.getData().setting.adaptor;
    },*/
    console: () => console,
    window: () => window,
  },
  mounted() {
    let that = this;
    let editor = this.$store.getters.getEditor;
    this.graph = editor.graph;
    /*if (this.$store.getters.getGraphStatus === 'deployed')
      this.chartData = {
        labels: [],
        datasets: [
          {
            label: '',
            backgroundColor: '#f8ac79',
            data: []
          }
        ]
      }*/
    this.adaptor = new Function("chartData", "msg", "options", "ctx", this.code);
    /*EventBus.$on(`${this.graphId}.${this.cell.getType()}.${this.cell.getId()}.trigger`.toLowerCase(), msg => {
      if (that.adaptor(this.chartData, msg, this.cell.getData().setting.options, that) !== false) {
        that.renderChart(this.chartData, this.options, that);
      }
    });
    EventBus.$on(`${this.graphId}.${this.cell.getType()}.${this.cell.getId()}.input`.toLowerCase(), msg => {
      if (that.adaptor(this.chartData, msg, this.cell.getData().setting.options, that) !== false)
        that.$data._chart.update();
    });
    if (this.$store.getters.getGraphStatus === 'deployed')
      EventBus.$emit(`${this.graphId}.${this.cell.getType()}.${this.cell.getId()}.trigger`.toLowerCase(), { body: { signal: "ready" } });
    this.renderChart(this.chartData, this.options);*/

    this.chart = Highcharts.chart(this.$el, {

      title: {
        text: 'Solar Employment Growth by Sector, 2010-2016'
      },

      subtitle: {
        text: 'Source: thesolarfoundation.com'
      },

      yAxis: {
        title: {
          text: 'Number of Employees'
        }
      },

      xAxis: {
        accessibility: {
          rangeDescription: 'Range: 2010 to 2017'
        }
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: 2010
        }
      },

      series: [{
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
      }, {
        name: 'Manufacturing',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
      }, {
        name: 'Sales & Distribution',
        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
      }, {
        name: 'Project Development',
        data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
      }, {
        name: 'Other',
        data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
      }],

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }

    });
  },
  watch: {
    styles: function(n, o) {
      //this.chart.setSize(n.width, n.height);
      //this.console.dir(this.cell.geometry);
      this.$el.parentElement.parentElement.setAttribute("width", this.cell.geometry.width);
      this.$el.parentElement.parentElement.setAttribute("height", this.cell.geometry.height);
      //this.console.dir(this.$el.parentElement.parentElement);
      //this.console.log(this.$el.parentElement.parentElement.parentElement.nodeName);
      this.$el.parentElement.parentElement.parentElement.setAttribute("transform", `translate(${this.cell.geometry.x}, ${this.cell.geometry.y})`);
      //this.chart.red();
      let that = this;
      //that.chart.reflow();
      setTimeout(function() {
        that.chart.reflow();
      }, 1)
      this.console.log("styles");
      /*this.graph.getView().invalidate(this.cell);
      this.graph.state.invalid = false;
      this.graph.state.view.validate();
      this.graph.redrawHandles();
      this.graph.refresh();*/
      //this.graph.getView().validate(this.cell);
      //this.graph.view.getState(this.cell).invalid = false;
    }
  },
}
</script>

<style scoped>

</style>