<template>
  <mx-color-picker @close="closeColorPicker" :show="show" :cell="cell"></mx-color-picker>
</template>

<script>
import JsonObject from "./data";
import Picker from 'vanilla-picker';
import MxColorPicker from "@/components/tools/mxComponents/mxColorPicker";

export default {
  name: 'mxInfo',
  components: { MxColorPicker },
  props: {
    sidebar: {
      required: true
    }
  },
  data() {
    return {
      cell: null,
      show: false,
      type: "info",
      bc: null,
      gid: null,
      colorPicker: null,
      graph: null
    }
  },
  methods: {
    openEditor: function(menu, cell, evt, cx) {
      cx.gid = cx.$store.getters.getGraphId;
      if (cx.bc != null) {
        cx.bc.close();
        cx.bc = null;
      }
      cx.bc = new BroadcastChannel(cx.gid + ':tinymce');
      cx.bc.onmessage = function(ev) {
        if (ev.data.cmd && ev.data.gid === cx.gid) {
          let gid = ev.data.gid;
          let cid = ev.data.cid;
          let graph = cx.$store.getters.getEditor.graph;
          let cell = graph.model.getCell(cid);
          switch (ev.data.cmd) {
            case 'getCellInfo':
              cx.bc.postMessage({ cmd: 'setCellInfo', info: cell.getData().config.info, gid: gid, cid: cid });
              break;
            case 'setCellInfo':
              cell.data.config.info = ev.data.info;
              cx.$store.getters.getEditor.graph.view.removeState(cell);
              cx.$store.getters.getEditor.graph.view.validateCell(cell);
              cx.$store.getters.getEditor.graph.view.validateCellState(cell);
              break;
            default:
              break;
          }
        }
      }
      let targetWindow = window.open(`./tinymce/index.html?gid=${cx.gid}&cid=${cell.getId()}`, '_blank');
    },
    changeBackgroundColor: function(menu, cell, evt, cx) {
      const port = this.graph.getChildCells(cell, true, false)[ 0 ];
      //const parent = this.graph.view.getState(port).shape.node.getElementsByTagName("image")[ 0 ].parentElement;
      //const parent = this.graph.view.getState(cell).text.node.firstChild.firstChild;
      const parent = this.graph.view.getState(cell).text.node.previousElementSibling;
      //cx.console.dir(parent);
      parent.insertAdjacentHTML('beforeend', '<foreignObject style="overflow:visible;"></foreignObject>');
      const foreign = parent.lastChild;
      //foreign.setAttribute('width', 500);
      //foreign.setAttribute('height',500);
      //cx.console.dir(foreign);

      cx.colorPicker.movePopup({
        parent: foreign,
        color: cx.graph.view.getState(cell).style[ mxConstants.STYLE_FILLCOLOR ],
        //Future feature...
        //alpha: (parent !== parentBG),
        /* onChange: mxUtils.bind(this, function(color) {
           let fillColor = color.rgbaString;
           cx.graph.view.getState(cell).style[ mxConstants.STYLE_GRADIENTCOLOR ] = fillColor;
           cx.graph.view.getState(cell).shape.apply(cx.graph.view.getState(cell));
           cx.graph.view.getState(cell).shape.redraw();
         }),
         onDone: mxUtils.bind(this, function(color) {
           let fillColor = color.rgbaString;
           cell.getData().config.fillColor = fillColor;
           cx.graph.view.getState(cell).style = cx.graph.view.getState(cell).style + 'fillColor=' + fillColor;
         })*/
        /*onChange: function(color) {
          this.settings.parent.setAttribute('data-color', color.rgbaString);
          //updateBackground();
        }*/
      }, true);
      //cx.colorPicker.show();
      //cx.colorPicker.openHandler();
    },
    closeColorPicker: function(val) {
      this.show = false;
    },
    addSidebarIcon: function(graph, sidebar, JO, image, type) {
      // Function that is executed when the image is dropped on
      // the graph. The cell argument points to the cell under
      // the mousepointer if there is one.

      let funct = function(graph, evt, cell, x, y) {
        let parent = graph.getDefaultParent();
        let model = graph.getModel();

        let v1 = null;

        model.beginUpdate();
        try {
          let width = 120, height = 120, xOffset = -8, yOffset = 9, portWidth = 16, portHeight = 16,
              alternateWidth = 120, alternateHeight = 40;
          v1 = graph.insertVertex(parent, null, new JO().config.info, x, y, width, height, type + ';');
          v1.setConnectable(false);
          v1.setType(type);
          v1.setData(new JsonObject());
          // Presets the collapsed size
          v1.geometry.alternateBounds = new mxRectangle(0, 0, alternateWidth, alternateHeight);
          let port = graph.insertVertex(v1, null, 'Info', 1, 0, portWidth, portHeight,
              'port;image=editors/images/overlays/lightbulb_on.png;', true);
          port.geometry.offset = new mxPoint(xOffset, yOffset);
          port.direction = "out";
          port.setConnectable(false);
          //const el = graph.view.getState(port);
          /*const popupBasic = new Picker(parentBasic);
          popupBasic.onChange = function(color) {
            parentBasic.style.backgroundColor = color.rgbaString;
          };*/
        } finally {
          model.endUpdate();
        }

        graph.setSelectionCell(v1);
      };
      let dashStyle = { width: 120, height: 120 };
      // Creates the image which is used as the sidebar icon (drag source)
      let img = document.createElement('img');
      img.setAttribute('src', image);
      img.style.width = '48px';
      img.style.height = '48px';
      img.title = 'Drag this to the diagram to create a new vertex';
      sidebar.appendChild(img);

      let dragElt = document.createElement('div');
      dragElt.style.border = 'dashed black 1px';
      dragElt.style.width = `${dashStyle.width}px`;
      dragElt.style.height = `${dashStyle.height}px`;

      // Creates the image which is used as the drag icon (preview)
      let ds = mxUtils.makeDraggable(img, graph, funct, dragElt, 0, 0, true, true);
      ds.setGuidesEnabled(true);
    },
    configureStylesheet: function(graph) {
      let style = {};
      style[ mxConstants.STYLE_GRADIENTCOLOR ] = '';
      style[ mxConstants.STYLE_FILLCOLOR ] = 'rgb(224,255,150,0.65)';
      style[ mxConstants.STYLE_STROKECOLOR ] = '#000000';
      style[ mxConstants.STYLE_ROUNDED ] = false;
      style[ mxConstants.STYLE_OVERFLOW ] = 'hidden';
      //style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_TOP;
      style[ mxConstants.STYLE_VERTICAL_ALIGN ] = mxConstants.ALIGN_TOP;
      //style[ mxConstants.STYLE_LABEL_POSITION ] = mxConstants.ALIGN_RIGHT;
      style[ mxConstants.STYLE_ALIGN ] = mxConstants.ALIGN_RIGHT;
      graph.getStylesheet().putCellStyle('info', style);
    }
  },
  mounted() {
    let that = this;
    let editor = this.$store.getters.getEditor;
    let graph = editor.graph;
    this.graph = graph;
    // Installs context menu
    let defaultMenu = graph.popupMenuHandler.factoryMethod;
    graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
      defaultMenu(menu, cell, evt);
      if (cell != null && cell.getType() === 'info') {
        menu.addItem('Open TinyMCE Editor', 'editors/images/new-window.png', function() {
          that.openEditor(menu, cell, evt, that);
        });
        menu.addItem('Background Color', 'editors/images/color.png', function() {
          that.cell = cell;
          that.show = true;
          //that.picker = true;
          //that.changeBackgroundColor(menu, cell, evt, that);
        });
      }
    };
    let graphConvertValueToString = graph.convertValueToString;
    graph.convertValueToString = function(cell) {
      if (this.model.isVertex(cell) && cell.getType() === "info" /*&& this.isCellCollapsed(cell)*/) {
        //that.console.dir(graph.view.getState(cell));
        return cell.getData().config.info;
      }
      return graphConvertValueToString.apply(this, arguments);
    };
    graph.addListener(mxEvent.CLICK, function(sender, evt) {//Moves the given cells to the front or back.
      let cell = evt.getProperty("cell"); // cell may be null
      if (cell != null && cell.type === 'info_bulb') {
        that.console.dir(cell);
      } else {
        //graph.getSelectionModel().clear();
      }
      //evt.consume();
    });
    this.colorPicker = new Picker({
      popup: 'top',
      color: graph.getStylesheet().getCellStyle('info')[ mxConstants.STYLE_FILLCOLOR ],
    });
    this.$nextTick(function() {
      that.configureStylesheet(graph);
      that.addSidebarIcon(graph, that.sidebar, JsonObject, "/src/images/icons48/info.png", that.type);
    })
  },
  computed: {
    console: () => console,
    window: () => window,
  }
}
</script>

<style scoped>

</style>
