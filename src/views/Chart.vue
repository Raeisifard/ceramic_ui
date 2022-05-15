<template>
  <div :class="{'chart-container': true, 'no-signal': noSignal}">
    <canvas id="chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "Chart",
  data() {
    return {
      chart: null,
      data: null,
      ctx: null,
      noSignal: true,
      x: {
        "data": {
          "labels": [],
          "datasets": []
        },
        "options": {},
        "type": "line"
      },
    }
  },
  methods: {
    alert: function() {
      alert();
      console.dir(this);
    },
    merge: function(a, b) {
      if (typeof b === 'undefined') {
        return Object.assign({}, this.x, a);
      } else {
        if (b.type) {
          return Object.assign({}, a, b);
        } else {
          if (typeof a.type === 'undefined') {
            a = Object.assign({}, a, this.x);
          }
          let ab = Object.assign({}, a, b);
          ab.data.labels = a.data.labels.concat(b.data.labels);
          b.data.datasets.forEach((v, i, ar) => {
            ab.data.datasets[ i ] = Object.assign({}, a.data.datasets[ i ] || {}, v);
            ab.data.datasets[ i ].data = ( a.data.datasets[ i ] || { data: [] } ).data.concat(v.data);
          })
          return ab;
        }
      }
    }
  },
  mounted() {
    let that = this;
    that.ctx = document.getElementById('chart');

    window.store = this.$store;
    window.updateChart = function(a) {
      if (!a)
        return;
      if (a.type) {
        that.data = a;
        if (that.chart)
          that.chart.destroy();
        that.chart = new Chart(document.getElementById('chart'), that.data);
        that.noSignal = false;
      } else if (that.chart) {
        a.data.labels.forEach(i => {
          that.chart.data.labels.push(i)
        });
        if (that.data.limit)
          while (that.data.limit < that.chart.data.labels.length)
            that.chart.data.labels.shift();
        a.data.datasets.forEach((v, i, ar) => {
          if (typeof that.chart.data.datasets[ i ] === 'undefined')
            that.chart.data.datasets[ i ] = { data: [] };
          v.data.forEach(d => {
            that.chart.data.datasets[ i ].data.push(d);
          })
          if (that.data.limit)
            while (that.data.limit < that.chart.data.datasets[ i ].data.length)
              that.chart.data.datasets[ i ].data.shift();
        })

        that.chart.update();
      } else {
        //that.chart = new Chart(document.getElementById('chart'), that.merge(a));
        that.noSignal = true;
      }
      //that.noSignal = false;
    }

    window.parent.getChart(new URL(location.href).searchParams.get("gid"), new URL(location.href).searchParams.get("cid"));
  }
  /*this.chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          beginAtZero: true
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 0,
    }
  });*/
}
</script>

<style scoped>
body {
  background: #1D1F20;
  overflow: hidden;
  /*padding: 16 px;*/
}

canvas {
  /*border: 1px dotted red;*/
  height: 100%;
  width: 100%;
}

.chart-container {
  position: relative;
  margin: auto;
  height: 100vh;
  width: 100vw;
}

.no-signal {
  background-image: url('/src/images/no-signal.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>