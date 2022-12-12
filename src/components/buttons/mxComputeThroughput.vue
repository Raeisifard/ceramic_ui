<template>
  <mx-button :editor="editor" action="computeThroughput" label="Throughput"></mx-button>
</template>

<script>
import mxButton from '@/components/buttons/mxComponents/mxButton.vue';

export default {
  name: "mxComputeThroughput",
  components: {
    mxButton
  },
  data: function() {
    return {
      editor: {},
      prevChecks: [],
      edgesMap: new Map(),
      median_tps: 0,
      all_tps: 0,
      spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2']
    }
  },
  methods: {
    computeDifChecks: function(newChecks) {
      let diffChecks = [];
      if (this.prevChecks.length === 0)
        diffChecks = newChecks;
      else {
        diffChecks = newChecks.map(newCheck => {
          let diffCheck = mxUtils.clone(newCheck);
          let prevCheck = this.prevChecks.find(ch => ch.id === newCheck.id);
          for (const key in newCheck.data.ports) {
            if (newCheck.data.ports.hasOwnProperty(key)) {
              diffCheck.data.ports[ key ] = newCheck.data.ports[ key ];
              if (prevCheck && prevCheck.data.ports.hasOwnProperty(key) && prevCheck.data.ports[ key ] <= newCheck.data.ports[ key ])
                diffCheck.data.ports[ key ] -= prevCheck.data.ports[ key ];
            }
          }
          return diffCheck;
        })
      }
      this.prevChecks = newChecks;
      return diffChecks;
    },
    setEdgeThroughputStyle: function(edge, tps, graph) {
      const state = graph.view.getState(edge);
      if (state != null) {
        state.shape.node.getElementsByTagName('path')[ 0 ].setAttribute('stroke-width', '4');
        state.shape.node.getElementsByTagName('path')[ 0 ].setAttribute('stroke', 'white');
        state.shape.node.getElementsByTagName('path')[ 0 ].setAttribute('visibility', 'hidden');
        state.shape.node.getElementsByTagName('path')[ 1 ].setAttribute('class', '');
        if (tps.success.toString() === 'NaN' || tps.success.toString() === 'Infinity' || tps.out == 0)
          return;

        // Adds animation to edge shape and makes "pipe" visible
        state.shape.node.getElementsByTagName('path')[ 0 ].removeAttribute('visibility');
        let edge_width = 4;
        if (this.median_tps > 0)
          edge_width += ( Math.floor(tps.out / this.median_tps) * 2 );
        state.shape.node.getElementsByTagName('path')[ 0 ].setAttribute('stroke-width', edge_width > 24 ? 24 : edge_width);
        state.shape.node.getElementsByTagName('path')[ 0 ].setAttribute('stroke', this.heatMapColorforValue(tps.success > 125 ? 125 : tps.success < 75 ? 75 : tps.success));
        state.shape.node.getElementsByTagName('path')[ 1 ].setAttribute('class', 'flow');
      }
    },
    heatMapColorforValue: function(value) {
      value = Math.round(( value - 75 ) / 5);
      return this.spectral[ value ];
    },
    /*heatMapColorforValue: function(value) {
      value = (value -75) / 50;
      let h = ( value ) * 240
      return "hsl(" + h + ", 100%, 50%)";
    }*/
    throughput: function() {
//TODO if throughput still is on
      if (this.$store.getters.isThroughputEnable) {
        this.$http
            .get('/health/status/' + this.$store.getters.getGraphId)
            .then(response => {
              let checks = response.data.checks;
              //console.dir(checks);
              let difChecks = this.computeDifChecks(checks);
              let throughput = [];
              let graph = this.editor.graph;
              let model = graph.getModel();
              //let edges = model.getChildEdges(model.root.getChildAt(0));
              let edges = graph.getAllEdges([model.root.getChildAt(0)]);
              let edgesMap = new Map();
              edges.forEach(edge => {
                if (edge.edge) {
                  let source_port = edge.source;
                  let source_tool = source_port.getType() ? source_port : source_port.parent;
                  let source_check = difChecks.find(c => c.id === source_tool.id);
                  let edge_in = 0;
                  try{
                    edge_in = source_check.data.ports[ source_port.value.toLowerCase() ];
                  }catch (e) {
                    edge_in = 0;
                  }
                  let target_port = model.getTerminal(edge, false);
                  let target_tool = target_port.getType() ? target_port : target_port.parent;
                  let target_check = difChecks.find(c => c.id === target_tool.id);
                  let edge_out = 0;
                  try {
                    edge_out = target_check.data.ports[ target_port.value.toLowerCase() ];
                  }catch (e) {
                    edge_out = edge_in;
                  }
                  let incomingEdges = model.getIncomingEdges(target_port);

                  let edges_in = incomingEdges.reduce((acc, cv) => {
                    /* if (cv.isEdge())*/
                    let sp = model.getTerminal(cv, true);
                    let st = sp.getType() ? sp : sp.parent;
                    let sc = difChecks.find(c => c.id === st.id);
                    try {
                      return acc + sc.data.ports[ sp.value.toLowerCase() ];
                    }catch (e) {
                      return acc;
                    }
                  }, 0);
                  let percent = Math.round(( edge_out / edges_in ) * 100);
                  edgesMap.set(edge, { out: edge_in, success: percent })
                }
              });
              this.all_tps = [...edgesMap.values()].reduce((all, cv) => {
                if (cv.out >= 0)
                  all += cv.out;
                return all;
              }, 0);
              this.median_tps = Math.round(this.all_tps / edgesMap.size);
              //console.log("all_tps: " + this.all_tps + "  median_tps: " + this.median_tps);
              //console.dir(edgesMap);
              if (this.$store.getters.isThroughputEnable)
                edgesMap.forEach((v, k) => {
                  this.setEdgeThroughputStyle(k, v, graph);
                });
              this.edgesMap = edgesMap;
            });

        setTimeout(this.throughput, 5000)
      } else
        this.setAllEdges2DefaultStyle();
    },
    setAllEdges2DefaultStyle: function() {
      let graph = this.editor.graph;
      let model = graph.getModel();
      //let edges = model.getChildEdges(model.root.getChildAt(0));
      let edges = graph.getAllEdges([model.root.getChildAt(0)]);
      edges.forEach(edge => {
        if (edge.edge) {
          const state = graph.view.getState(edge);
          if (state != null) {
            state.shape.node.getElementsByTagName('path')[ 0 ].setAttribute('stroke-width', '4');
            state.shape.node.getElementsByTagName('path')[ 0 ].setAttribute('stroke', 'white');
            state.shape.node.getElementsByTagName('path')[ 0 ].setAttribute('visibility', 'hidden');
            state.shape.node.getElementsByTagName('path')[ 1 ].setAttribute('class', '');
          }
        }
      });
    }
  },
  mounted() {
    this.editor = this.$store.getters.getEditor;
    let editor = this.editor;
    let that = this;
    let old_mxGraphView = mxGraphView.prototype.viewStateChanged;
    mxGraphView.prototype.viewStateChanged = function() {
      this.revalidate();
      this.graph.sizeDidChange();
      if (that.$store.getters.isThroughputEnable && that.edgesMap.size > 0)
        that.edgesMap.forEach((v, k) => {
          that.setEdgeThroughputStyle(k, v, this.graph);
        });
    };
    this.editor.addAction('computeThroughput', function(editor, checks) {
      if (that.$store.getters.isThroughputEnable || that.$store.getters.getGraphStatus !== "deployed") {
        that.$store.commit("SET_THROUGHPUT_ENABLE", false);
      } else {
        that.$store.commit("SET_THROUGHPUT_ENABLE", true);
        let headers = { cmd: "query", name: that.$store.getters.getGraphName, uid: that.$store.getters.getGraphId };
        that.$store.getters.getEb.send('mx.vx', that.$store.getters.getGraphId, headers, (err, res) => {
          if (err == null) {
            if (res.body.active) {
              that.throughput();
              //let intervalId = setInterval(that.throughput, 5000);
            }
          } else {
            mxLog.warn("There is some error in query graph! \"that.$store.getters.getGraphName\"(that.$store.getters.getGraphId)");
            console.dir(err);
          }
        });
      }
    });
  }
}
</script>

<style>
.flow {
  stroke-dasharray: 8;
  stroke-width: 4;
  animation: dash 0.5s linear;
  animation-iteration-count: infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -16;
  }
}
</style>