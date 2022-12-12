<template>
  <div style="display: flex; flex-direction: column;">
    <div ref="jsoneditor" :style="{height: height}"></div>
    <div style="display: flex;justify-content: space-around;
    background: url(src/images/window-title.gif) repeat-x; background-size: auto 100%; height: 30px; padding-bottom: 5px;">
      <NumberBox style="width:120px; margin: 2px; height: 26px;" inputId="n1" v-model="outNumber" :min="0" :max="99"
                 :increment="1" :spinners="true" suffix=" Outs" spinAlign="horizontal"></NumberBox>
      <div style="width: 50%; display: flex;justify-content: space-evenly;">
        <button class="button-dark" tabindex="11" style="color: mediumspringgreen;"
                @click="configOk">OK
        </button>
        <button class="button-dark" tabindex="12" style="color: gold;"
                @click="wndConfig.destroy()">Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import "jsoneditor/dist/jsoneditor.min.css";
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js';

export default {
  name: "dialogConfig",
  components: {},
  data() {
    return {
      outNumber: this.getOutNumber(),
      value: 0,
      //json: {config: {}, setting: {}},
      options: {},
      editor: null,
      background: null,
      wndConfig: null,
      graph: this.$store.getters.getGraph,
      height: '185px',
    }
  },
  props: ['cell'],
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
    configOk(evt) {
      let editor = this.$store.getters.getEditor;
      let graph = editor.graph;
      let model = graph.getModel();
      if (( this.cell.getChildCount() - 4 ) !== this.outNumber) {
        model.beginUpdate();
        try {
          let existOut = this.cell.getChildCount() - 4;
          let extendOut = existOut - this.outNumber;
          let dist = Math.round(100 / ( this.outNumber + 3 )) / 100;
          let error = this.cell.getChildAt(2);
          let result = this.cell.getChildAt(3);
          let geo = null;
          let out = null;
          if (extendOut < 0) {//we need more outs
            for (let i = existOut; i < this.outNumber; i++) {
              let port = graph.insertVertex(this.cell, null, 'Out' + i, 1, dist + ( i + 1 ) * dist, 16, 16,
                  'port;image=editors/images/connector.gif;spacingLeft=18', true)
              port.geometry.offset = new mxPoint(-8, -8);
              port.direction = "out";
            }
            for (let i = 0; i < existOut; i++) {
              out = this.cell.getChildAt(i + 4);
              geo = out.getGeometry().clone();
              geo.y = dist + ( i + 1 ) * dist;
              graph.model.setGeometry(out, geo);
            }
          } else {//we need to remove excess outs
            let outs = [];
            for (let i = existOut + 3; i > this.outNumber + 3; i--) {
              outs.push(this.cell.getChildAt(i));
            }
            graph.removeCells(outs, true);
            for (let i = 4; i < this.cell.getChildCount(); i++) {
              out = this.cell.getChildAt(i);
              geo = out.getGeometry().clone();
              geo.y = dist + ( i - 3 ) * dist;
              graph.model.setGeometry(out, geo);
            }
          }
          geo = error.getGeometry().clone();
          geo.y = dist;
          graph.model.setGeometry(error, geo);
          geo = result.getGeometry().clone();
          geo.y = 1 - dist;
          graph.model.setGeometry(result, geo);
        } finally {
          model.endUpdate();
        }
      }
      this.cell.data.outNumber = this.outNumber;
      // get json
      this.cell.data.config = this.editor.get();
      //apply if minimal style
      if (this.cell.data.config.style && this.cell.data.config.style === 'minimal') {
        this.cell.setStyle("minimal");
        if (this.cell.isCollapsed())
          editor.graph.foldCells(false, false, [this.cell]);
        editor.graph.foldCells(true, false, [this.cell]);
      } else if (this.cell.getStyle().trim().length > 3) {
        this.cell.setStyle("");
        if (!this.cell.isCollapsed())
          editor.graph.foldCells(true, false, [this.cell]);
        editor.graph.foldCells(false, false, [this.cell]);
      }
      //Enable & Disable Overlay
      let enable = !( 'enable' in this.cell.getData().config ) || this.cell.getData().config.enable;
      if (enable)
        graph.removeCellOverlays(this.cell);
      else {
        let overlays = graph.getCellOverlays(this.cell);
        if (overlays == null) {
          // Creates a new overlay with an image and a tooltip
          let overlay = new mxCellOverlay(
              new mxImage('editors/images/overlays/disabled.png', 16, 16),
              'Disabled', mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP);

          // Installs a handler for clicks on the overlay
          /*overlay.addListener(mxEvent.CLICK, function(sender, evt2)
          {
            mxUtils.alert('This tool is Disabled');
          });*/

          // Sets the overlay for the cell in the graph
          graph.addCellOverlay(this.cell, overlay);
        }
      }
      this.wndConfig.destroy();
    },
    getOutNumber() {
      return this.cell.getData().outNumber
    }
  },
  mounted() {
    let that = this;
    this.options = {
      mode: 'tree',
      modes: ['tree', 'view', 'form', 'code', 'text']
    };
    this.editor = new JSONEditor(this.$refs.jsoneditor, this.options);
    this.editor.set(this.cell.data.config);
    this.background = this.getBackground();
    document.body.appendChild(this.background);
    if (mxClient.IS_IE) {
      new mxDivResizer(this.background);
    }
    let width = 500;
    let height = 240;
    let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
    let y = Math.max(10, ( document.body.scrollHeight ||
        document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
    this.wndConfig = new mxWindow("Process Configuration", this.$el, x, y, width, height, false, true);
    this.wndConfig.setClosable(true);
    this.wndConfig.setResizable(true);
    this.wndConfig.minimumSize = new mxRectangle(0, 0, 440, 230);
    this.wndConfig.destroyOnClose = true;
    this.graph.setEnabled(false);
    this.graph.tooltipHandler.hide();
    this.wndConfig.setVisible(true);
    this.wndConfig.table.nextSibling.style.right = 0
    this.wndConfig.div.style.overflow = 'visible';
    this.wndConfig.content.parentElement.style.overflow = 'unset';
    this.wndConfig.addListener(mxEvent.DESTROY, function(evt) {
      that.graph.setEnabled(true);
      mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
      that.$emit('close');
    });
    this.wndConfig.addListener(mxEvent.RESIZE, function(evt) {
      that.height = ( evt.div.offsetHeight - 55 ) + 'px';
    });
  }
}
</script>

<style scoped>
* {
  user-select: none;
}

.button-dark {
  background: url(/src/images/button-dark.gif) repeat-x;
  width: 60px;
  margin-top: 5px;
}
</style>