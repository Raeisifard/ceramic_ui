<template>
  <component :is="cmd.name" :cell="cell" :cmd="cmd" @close="wndSetting.destroy()"/>
</template>

<script>
import triggerSetting from './dialogTriggerSetting';
import pushSetting from './dialogPushSetting';

export default {
  name: "mxDialog",
  components: {
    triggerSetting,
    pushSetting
  },
  props: ['cell', 'cmd'],
  data() {
    return {
      _setting: null,
      background: null,
      wndSetting: null,
      graph: this.$store.getters.getEditor.graph,
    }
  },
  methods: {
    getBackground: function() {
      let background = document.createElement('div');
      background.style.position = 'absolute';
      background.style.left = '0px';
      background.style.top = '0px';
      background.style.right = '0px';
      background.style.bottom = '0px';
      background.style.background = 'black';
      background.style.zIndex = '1';
      mxUtils.setOpacity(background, 50);
      return background;
    },
    showModalConfigWindow: function(graph, title, content, width, height) {
      this.background = this.getBackground();
      document.body.appendChild(this.background);
      if (mxClient.IS_IE) {
        new mxDivResizer(this.background);
      }
      let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
      let y = Math.max(10, ( document.body.scrollHeight ||
          document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
      this.wndSetting = new mxWindow(title, content, x, y, width, height, false, true);
      this.wndSetting.setClosable(true);
      this.wndSetting.destroyOnClose = true;
      this.wndSetting.setResizable(true);
      let minRect = new mxRectangle(0, 0, 440, 180);
      this.wndSetting.minimumSize = minRect;
      this.wndSetting.div.style.overflow = 'unset';
      this.wndSetting.content.parentElement.style.overflow = 'unset';

      graph.setEnabled(false);
      graph.tooltipHandler.hide();
      this.wndSetting.setVisible(true);
      this.cmd.style.height = this.wndSetting.content.offsetHeight;
      this.cmd.style.width = this.wndSetting.content.offsetWidth;
      // Fades the background out after after the window has been closed
      let that = this;
      this.wndSetting.addListener(mxEvent.DESTROY, function(evt) {
        graph.setEnabled(true);
        mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
        that.$emit('close');
      });
      this.wndSetting.addListener(mxEvent.RESIZE, function(evt) {
        let content = evt.content;
        that.cmd.style.height = content.offsetHeight;
        that.cmd.style.width = content.offsetWidth;
      });
    },
  },

 /* watch: {
    cmd: {
      handler(n, o) {
        console.log("mxDialog: " + oldVal + " " + newVal);
      },
      deep: true
    }
  },*/

  mounted() {
    this.showModalConfigWindow(this.graph, this.cmd.title, this.$el, this.cmd.style.width, this.cmd.style.height);
  }
}
</script>

<style scoped>

</style>