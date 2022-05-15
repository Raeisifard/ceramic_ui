<template>
  <div id="blocklysContainer">
    <mx-code-editor v-if="showCode" @close="showCode=false" :cell="cell"></mx-code-editor>
  </div>
</template>

<script>
import JsonObject from "./data";
import MxCodeEditor from "./mxCodeEditor";

mxCodecRegistry.addAlias(mxUtils.getFunctionName(JsonObject), 'JsonObject');
export default {
  name: "mxParquet",
  components: { MxCodeEditor },
  props: {
    sidebar: {
      required: true
    }
  },
  data() {
    return {
      type: "parquet",
      image: "/src/images/icons48/parquet.png",
      label:
          '<h3 style="margin:0;">Parquet</h3>' +
          '<img src="/src/images/icons48/parquet.png" width="48" height="48">',
      bc: null,
      gid: null,
      cid: null,
      cell: null,
      timerInterval: null,
      showCode: false,
    }
  },
  methods: {
    addSidebarIcon: function(graph, sidebar, ctx, image, type) {
      let funct = function(graph, evt, cell, x, y) {
        let parent = graph.getDefaultParent();
        let model = graph.getModel();
        let v1 = null;
        let label = null;
        model.beginUpdate();
        try {
          v1 = graph.insertVertex(parent, null, ctx.label, x, y, 80, 80, 'parquet;');
          v1.setConnectable(false);
          v1.setType(type);
          v1.setData(new JsonObject());
          // Presets the collapsed size
          v1.geometry.alternateBounds = new mxRectangle(0, 0, 50, 50);
          let port = graph.insertVertex(v1, null, 'Trigger', 0, 0.35, 12, 12,
              'port;image=editors/images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18', true);
          port.geometry.offset = new mxPoint(5, 0);
          port.direction = "in";
          port = graph.insertVertex(v1, null, 'Input', 0, 0.65, 12, 12,
              'port;image=editors/images/overlays/check.png;align=right;imageAlign=right;spacingRight=18', true);
          port.geometry.offset = new mxPoint(5, 0);
          port.direction = "in";
          port = graph.insertVertex(v1, null, 'Error', 1, 0.35, 12, 12,
              'port;image=editors/images/overlays/error.png;spacingLeft=18', true);
          port.geometry.offset = new mxPoint(-16, 0);
          port.direction = "out";
          port = graph.insertVertex(v1, null, 'Result', 1, 0.65, 12, 12,
              'port;image=editors/images/overlays/information.png;spacingLeft=18', true);
          port.geometry.offset = new mxPoint(-16, 0);
          port.direction = "out";
          //v1.vueComponent = ctx.$store.getters.getVueComponentByObject(ctx, v1);
        } finally {
          model.endUpdate();
        }
        graph.setSelectionCell(v1);
        graph.getView().clear(v1, false, false);
        graph.getView().validate();
      };
      // Creates the image which is used as the sidebar icon (drag source)
      let img = document.createElement('img');
      img.setAttribute('src', image);
      img.style.width = '48px';
      img.style.height = '48px';
      img.title = 'Drag this to the diagram to create a new instance parquet';
      sidebar.appendChild(img);
      let dragElt = document.createElement('div');
      dragElt.style.border = 'dashed black 1px';
      dragElt.style.width = '70px';
      dragElt.style.height = '40px';
      // Creates the image which is used as the drag icon (preview)
      let ds = mxUtils.makeDraggable(img, graph, funct, dragElt, 0, 0, true, true);
      ds.setGuidesEnabled(true);
    },
    configureStylesheet: function(graph) {
      let style = new Object();
      style[ mxConstants.STYLE_SHAPE ] = mxConstants.SHAPE_RECTANGLE;
      style[ mxConstants.STYLE_PERIMETER ] = mxPerimeter.RectanglePerimeter;
      style[ mxConstants.STYLE_FILLCOLOR ] = 'transparent';
      //style[ mxConstants.STYLE_FILLCOLOR ] = '#EE82EE';
      style[ mxConstants.STYLE_ALIGN ] = mxConstants.ALIGN_CENTER;
      style[ mxConstants.STYLE_VERTICAL_ALIGN ] = mxConstants.ALIGN_MIDDLE;
      style[ mxConstants.STYLE_FONTCOLOR ] = '#000000';
      style[ mxConstants.STYLE_ROUNDED ] = false;
      style[ mxConstants.STYLE_OPACITY ] = '0';
      //style[ mxConstants.STYLE_OPACITY ] = '80';
      style[ mxConstants.STYLE_FONTSIZE ] = '12';
      style[ mxConstants.STYLE_FONTSTYLE ] = 0;
      style[ mxConstants.STYLE_IMAGE_WIDTH ] = '48';
      style[ mxConstants.STYLE_IMAGE_HEIGHT ] = '48';
      style[ mxConstants.STYLE_FOLDABLE ] = 1;
      style[ mxConstants.STYLE_RESIZABLE ] = 1;
      //style[mxConstants.VERTEX_SELECTION_DASHED] = false;
      graph.getStylesheet().putCellStyle('parquet', style);
    },
    openEditor: function(menu, cell, evt, cx) {
      cx.gid = cx.$store.getters.getGraphId;
      cx.cid = cell.getId();
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      if (cx.bc != null) {
        cx.bc.close();
        cx.bc = null;
      }
      cx.bc = new BroadcastChannel(cx.gid + ':parquet');
      this.bc.onmessage = function(ev) {
        if (ev.data.cmd && ev.data.gid === cx.gid) {
          let gid = ev.data.gid;
          let cid = ev.data.cid;
          let graph = cx.$store.getters.getEditor.graph;
          let cell = graph.model.getCell(cid);
          switch (ev.data.cmd) {
            case 'getCellData':
              if (cell.getType() === 'parquet')
                cx.bc.postMessage({ cmd: 'setCellData', xml: cell.getData().xml, gid: gid, cid: cid });
              break;
            case 'setCellCode':
              cell.data.xml = ev.data.xml;
              cell.data.code = ev.data.code;
              break;
            default:
              break;
          }
        }
      }
      this.timerInterval = setInterval(this.sendHeartbeat, 2000);
      let cid = cell.getId();
      let routeData = this.$router.resolve({ name: 'parquet', query: { gid: cx.gid, cid: cid } });
      window.open(routeData.href, '_blank');
    },
    openCode: function(menu, cell, evt, cx) {
      this.cell = cell;
      this.showCode = true;
    },
    sendHeartbeat: function() {
      if (this.bc) {
        this.bc.postMessage({ cmd: 'heartbeat', gid: this.gid, cid: this.cid });
      }
    }
  },
  mounted() {
    let that = this;
    let editor = this.$store.getters.getEditor;
    let graph = editor.graph;
    let graphConvertValueToString = graph.convertValueToString;
    graph.convertValueToString = function(cell) {
      if (this.model.isVertex(cell) && cell.getType() == "parquet" && this.isCellCollapsed(cell)) {
        return `<img src="/src/images/icons48/parquet.png" width="48" height="48">`;
      }
      return graphConvertValueToString.apply(this, arguments);
    };
    let defaultMenu = graph.popupMenuHandler.factoryMethod;
    graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
      defaultMenu(menu, cell, evt);
      if (cell != null && cell.getType() === 'parquet') {
        menu.addItem('Open Editor', 'editors/images/new-window.png', function() {
          that.openEditor(menu, cell, evt, that);
        });
        menu.tbody.getElementsByClassName('mxPopupMenuIcon')[ 0 ].style.display = 'flex';
        menu.tbody.getElementsByClassName('mxPopupMenuIcon')[ 0 ].style.justifyContent = 'center';
        menu.addItem('Send Code', 'editors/images/send.png', function() {
          that.openCode(menu, cell, evt, that);
        });
      }
    };

    this.$nextTick(function() {
      that.configureStylesheet(graph);
      that.addSidebarIcon(graph, that.sidebar, that, that.image, that.type);
    });
  },
  computed: {
    console: () => console,
    window: () => window,
  }
}
</script>

<style scoped>
td.mxWindowTitle {
  padding-bottom: 0;
}
</style>