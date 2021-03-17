<template>
  <div id="fixed"></div>
</template>

<script>
import Picker from 'vanilla-picker';

export default {
  name: "mxColorPicker",
  data() {
    return {
      pickerFixed: null,
      graph: null,
      content: null,
      wnd: null
    }
  },
  props: {
    cell: {
      type: Object,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showModalWindow: function(graph, title, content, width, height) {
      let that = this;
      let background = document.createElement('div');
      background.style.position = 'absolute';
      background.style.left = '0px';
      background.style.top = '0px';
      background.style.right = '0px';
      background.style.bottom = '0px';
      background.style.background = 'black';
      mxUtils.setOpacity(background, 0);
      document.body.appendChild(background);
      if (mxClient.IS_IE) {
        new mxDivResizer(background);
      }
      let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
      let y = Math.max(10, ( document.body.scrollHeight ||
          document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
      //this.pickerFixed.setting.color = this.cell.getData.config.fillColor;
      //Set the color silently (doesn't trigger .onChange()):
      this.pickerFixed.setColor(this.cell.getData().config.fillColor, true);
      let wnd = new mxWindow(title, content, x, y, width, height, false, true);
      wnd.setClosable(true);

      // Fades the background out after after the window has been closed
      wnd.addListener(mxEvent.DESTROY, function(evt) {
        if (that.cell != null) {
          let state = graph.view.getState(that.cell);
          state.style[ mxConstants.STYLE_FILLCOLOR ] = that.cell.getData().config.fillColor;
          state.shape.apply(state);
          state.shape.redraw();
        }
        that.$emit('close', 'false');
        graph.setEnabled(true);
        mxEffects.fadeOut(background, 50, true, 10, 30, true);
      });

      graph.setEnabled(false);
      graph.tooltipHandler.hide();
      wnd.setVisible(true);
      return wnd;
    }
  },
  mounted() {
    let that = this;
    let graph = this.$store.getters.getEditor.graph;
    this.graph = graph;
    let content = document.createElement('div');
    this.content = content;
    content.append(this.$el);
    /* Fixed picker */
    const parentFixed = this.$el;
    this.pickerFixed = new Picker({
      parent: parentFixed,
      popup: false,
      alpha: true,
      editor: true,
      onChange: function(color) {
        if (that.cell != null) {
          let state = graph.view.getState(that.cell);
          state.style[ mxConstants.STYLE_FILLCOLOR ] = color.rgbaString;
          state.shape.apply(state);
          state.shape.redraw();
        }
      },
      onDone: function(color) {
        that.cell.getData().config.fillColor = color.rgbaString;
        that.cell.style = that.cell.getType() + ';fillColor=' + color.rgbaString;
        that.wnd.destroy();
      }
    });
  },
  watch: {
    show: function(newVal, oldVal) { // watch it
      if (newVal === true)
        this.wnd = this.showModalWindow(this.graph, 'Color Picker', this.content, 252, 305);
    }
  }
}
</script>

<style scoped>

</style>