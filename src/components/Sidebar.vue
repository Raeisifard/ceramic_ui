<template>
  <!-- Creates a container for the toolboox -->
  <div id="sidebarContainer" :class="{no_side_bar: true, side_bar: isSideBar}">
    <mx-process :sidebar="sidebar"></mx-process>
    <mx-switch :sidebar="sidebar"></mx-switch>
<!--    <mx-chart :sidebar="sidebar"></mx-chart>-->
    <mx-file :sidebar="sidebar"></mx-file>
    <mx-database :sidebar="sidebar"></mx-database>
    <mx-websphere-mq :sidebar="sidebar"></mx-websphere-mq>
    <mx-parquet :sidebar="sidebar"></mx-parquet>
<!--    <mx-buffer :sidebar="sidebar"></mx-buffer>-->
    <mx-info :sidebar="sidebar"></mx-info>
<!--    <mx-pattern :sidebar="sidebar"></mx-pattern>
    <mxi-frame :sidebar="sidebar"></mxi-frame>-->
  </div>
</template>

<script>
import mxProcess from './tools/mxProcess/mxProcess.vue';
import mxSwitch from './tools/mxSwitch/mxSwitch.vue';
import mxInfo from './tools/mxInfo/mxInfo.vue';
import MxBuffer from "./tools/mxBuffer/mxBuffer";
//import MxChart from "./tools/mxChart/mxChart";
import MxWebsphereMq from "./tools/mxWebsphereMq/mxWebsphereMq";
import MxFile from "./tools/mxFile/mxFile";
import MxDatabase from "./tools/mxDatabase/mxDatabase";
import MxParquet from "./tools/mxParquet/mxParquet";
//import MxPattern from "@/components/tools/mxPattern/mxPattern";
//import MxiFrame from "@/components/tools/mxiFrame/mxiFrame";

export default {
  name: 'Sidebar',
  components: {
   /* MxiFrame,
    MxPattern,
    MxChart,
    MxBuffer,*/
    MxWebsphereMq,
    MxFile,
    MxDatabase,
    //MxBlockly,
    //MxPattern,
    MxParquet,
    //MxServer,
    //MxNewMail,
    mxInfo,
    mxProcess,
    mxSwitch,
    //mxKeys
  },
  data() {
    return {
      sidebar: {}
    }
  },
  methods: {
    showSplash: function(show) {
      this.$store.dispatch("showSplash", show);
    },
  },
  mounted() {
    let that = this;
    that.sidebar = that.$el;
    that.$nextTick(function() {
      that.showSplash(false);
    })
  },
  created() {
    this.config = this.$store.getters.getEditor_Config;
  },
  computed: {
    isSideBar() {
      return this.$store.getters.getEditor_Config.side_bar;
    }
  }
}
</script>

<style scoped>
.no_side_bar {
  box-sizing: initial;
  position: absolute;
  overflow: hidden;
  top: 36px;
  left: -1px;
  bottom: 36px;
  max-width: 52px;
  width: 0;
  padding-top: 10px;
  padding-left: 0px;
  background-image: url('/src/images/sidebar_bg.gif');
}

.side_bar {
  width: 52px;
  padding-left: 4px;
}
</style>
