<template>
  <component :is="dialogName" v-if="showDialog" :cell="cell" @close="showDialog=false"></component>
</template>

<script>
import JsonObject from "./data";
import editor from './mxDialogEditor';
import config from './mxDialogConfig';
import setting from './mxDialogSetting';
import MxWindow from "./chart/dialog/mxWindow";
import { CONNECTION_STATUS } from "../../../store/constants";

mxCodecRegistry.addAlias(mxUtils.getFunctionName(JsonObject), 'JsonObject');
export default {
  name: 'mxProcess',
  components: {
    //MxWindow,
    editor,
    config,
    setting
  },
  props: {
    sidebar: {
      required: true
    }
  },
  data() {
    return {
      jsonObject: new JsonObject(),
      image: "/src/images/icons48/process.png",
      label: "",
      /*`<h1 style="margin:0;">${this.jsonObject.type}.charAt(0).toUpperCase()</h1>` +
        //'<h1 style="margin:0;">Process</h1>' +
        '<br>' +
        '<img src="/src/images/icons48/process.png" width="48" height="48">',*/
      dialog: null,
      showDialog: false,
      dialogName: null,
      cell: null,
    }
  },
  methods: {
    /*getLabel: function(cell) {
      if (cell.getData().fName === "SampleVerticle")
        return `<h1 style="margin:0;">${cell.getType().charAt(0).toUpperCase() + cell.getType().slice(1)}</h1><br>
                    <img src="/src/images/icons48/process.png" width="48" height="48">`;
      else
        return `<h1 style="margin:0;">${cell.getType().charAt(0).toUpperCase() + cell.getType().slice(1)}</h1><h2>${cell.getData().fName}</h2><img src="/src/images/icons48/process.png" width="48" height="48">`;
    },*/
    getWindow: function(cell) {
      if (!cell.vueComponent) {
        //cell.vueComponent = this.getVueComponent(cell, this).vueComponent;
        cell.vueComponent = this.$store.getters.getVueComponentByObject(this, cell);
      }
    },
    /*getVueComponent: function(cell, ctx) {
      const _chart = {
        name: "chart",
        components: {
          MxWindow
        },
        props: ['cell', 'store'],
        template: '<mx-window :cell="cell" :store="store"></mx-window>',
      };
      const ComponentClass = Vue.extend(_chart);
      let instance = new ComponentClass({
        propsData: { cell: cell, store: ctx.$store }
      });
      instance.$mount();

      function vueComponent(val) {
        this.vueComponent = val;
      }

      return new vueComponent(instance);
    },*/
    openEditor: function(menu, cell, evt, cx) {
      this.dialogName = 'editor';
      this.showDialog = true;
    },
    openConfig: function(menu, cell, evt, cx) {
      this.dialogName = 'config';
      this.showDialog = true;
    },
    openSetting: function(menu, cell, evt, cx) {
      this.dialogName = 'setting';
      this.showDialog = true;
    },
    addSidebarIcon: function(graph, sidebar, label, image) {
      // Function that is executed when the image is dropped on
      // the graph. The cell argument points to the cell under
      // the mousepointer if there is one.

      let funct = function(graph, evt, cell, x, y) {
        let parent = graph.getDefaultParent();
        let model = graph.getModel();

        let v1 = null;

        model.beginUpdate();
        try {
          // NOTE: For non-HTML labels the image must be displayed via the style
          // rather than the label markup, so use 'image=' + image for the style.
          // as follows: v1 = graph.insertVertex(parent, null, label,
          // pt.x, pt.y, 120, 120, 'image=' + image);
          let width = 96, height = 96, xOffset = -8, yOffset = -8, portWidth = 16, portHeight = 16,
              alternateWidth = 120, alternateHeight = 40;
          let jo = new JsonObject()
          v1 = graph.insertVertex(parent, null, label, x, y, width, height, jo.type);
          v1.setConnectable(false);
          v1.setType(jo.type);
          v1.setData(jo);
          // Presets the collapsed size
          v1.geometry.alternateBounds = new mxRectangle(0, 0, alternateWidth, alternateHeight);

          // Adds the ports at various relative locations
          let port = graph.insertVertex(v1, null, 'Trigger', 0, 0.25, portWidth, portHeight,
              'port;image=editors/images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18', true);
          port.geometry.offset = new mxPoint(-6, yOffset);
          port.direction = "in";
          port = graph.insertVertex(v1, null, 'Input', 0, 0.75, portWidth, portHeight,
              'port;image=editors/images/overlays/check.png;align=right;imageAlign=right;spacingRight=18', true);
          port.geometry.offset = new mxPoint(-6, -4);
          port.direction = "in";
          port = graph.insertVertex(v1, null, 'Error', 1, 0.25, portWidth, portHeight,
              'port;image=editors/images/overlays/error.png;spacingLeft=18', true);
          port.geometry.offset = new mxPoint(xOffset, yOffset);
          port.direction = "out";
          port = graph.insertVertex(v1, null, 'Result', 1, 0.75, portWidth, portHeight,
              'port;image=editors/images/overlays/information.png;spacingLeft=18', true);
          port.geometry.offset = new mxPoint(xOffset, -4);
          port.direction = "out";
        } finally {
          model.endUpdate();
        }

        graph.setSelectionCell(v1);
      };
      let dashStyle = { width: 96, height: 96 };

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
    }
  },
  mounted() {
    let that = this;
    let editor = this.$store.getters.getEditor;
    let graph = editor.graph;
    let graphConvertValueToString = graph.convertValueToString;

    graph.convertValueToString = function(cell) {
      if (this.model.isVertex(cell) && cell.getType() === that.jsonObject.type) {
        let overlays = graph.getCellOverlays(cell);
        if (overlays == null && 'enable' in cell.getData().config && !cell.getData().config.enable) {
          // Creates a new overlay with an image and a tooltip
          let overlay = new mxCellOverlay(
              new mxImage('editors/images/overlays/disabled.png', 16, 16),
              'Disabled', mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP);
          graph.addCellOverlay(cell, overlay);
        }
        if (this.isCellCollapsed(cell))
          return ( cell.getData().config.style && cell.getData().config.style === 'minimal' )
              ? cell.getValue().label
              : `<h2>${cell.getData().fName}</h2>`;
        else if (typeof cell.getValue() === 'object' && cell.getValue().label && cell.getValue().label.length > 0)//We have label here.
          return cell.getValue().label;
        else if (( cell.getData().config.chart && cell.getData().config.chart.type )
            || ( typeof cell.getValue() === 'object' && Object.keys(cell.getValue()).length > 0 )) {//We have Chart here.
          if (!cell.vueComponent)
            cell.vueComponent = that.$store.getters.getVueComponentByObject(that, cell);
          return cell.vueComponent.$el;
        } else {//We have normal Process here.
          return `<h1 style="margin:0;">${cell.getType().charAt(0).toUpperCase() + cell.getType().slice(1)}</h1><img src="/src/images/icons48/process.png" width="48" height="48">`;
        }
      } else//Other types of widgets
        return graphConvertValueToString.apply(this, arguments);
    }

    // Installs context menu
    let defaultMenu = graph.popupMenuHandler.factoryMethod;
    graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
      defaultMenu(menu, cell, evt);
      if (cell != null && cell.getType() == 'process') {
        that.cell = cell;
        let enable = !( 'enable' in cell.getData().config ) || cell.getData().config.enable;
        let enablePng = enable ? 'editors/images/disable.png' : 'editors/images/enable.png';
        menu.addItem('Config', 'editors/images/config.png', function() {
          that.openConfig(menu, cell, evt, that);
        });
        menu.addItem('Setting', 'editors/images/setting.png', function() {
          that.openSetting(menu, cell, evt, that);
        });
        menu.addSeparator();
        menu.addItem('Editor', 'editors/images/edit.png', function() {
          that.openEditor(menu, cell, evt, that);
        });
        menu.addItem(enable ? 'Disable' : 'Enable', enablePng, function() {
          cell.getData().config.enable = !enable;
          if (cell.getData().config.enable)
            graph.removeCellOverlays(cell);
          else {
            let overlays = graph.getCellOverlays(cell);
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
              graph.addCellOverlay(cell, overlay);
            }
          }
        });
        /* let submenu1 = menu.addItem('Submenu 1', null, null);

         menu.addItem('Subitem 1', null, function() {
           alert('Subitem 1');
         }, submenu1);
         menu.addItem('Subitem 1', null, function() {
           alert('Subitem 2');
         }, submenu1);*/
      }
    };
    const _chart = {
      name: "vue_chart",
      components: {
        MxWindow
      },
      props: ['cell', 'store'],
      template: '<mx-window :cell="cell" :store="store"></mx-window>',
    };
    this.$store.commit("ADD_VUE_OBJECT", _chart);
    this.$nextTick(function() {
      that.addSidebarIcon(graph, that.sidebar, that.label, that.image);
    })
    window.getChart = function(gid, cid) {
      let cell = graph.getModel().getCell(cid);
      if (cell.getData().config.chart && cell.getData().config.chart.type)
        cell.vueComponent.$children[ 0 ].frame.contentWindow.updateChart(JSON.parse(JSON.stringify(cell.getData().config.chart)));
      let status = that.$store.getters.getGraphStatus;
      if (status === 'undeployed') {
        return -1;//The Graph must already deployed!
      }
      let eb = that.$store.getters.getEb;
      if (eb.state !== CONNECTION_STATUS.OPEN)
        return -1;
      let headers = {
        cmd: "chart",
        name: that.$store.getters.getGraphName,
        uid: gid,
        type: 'process',
        id: cid,
      };
      eb.send('mx.vx', '{}', headers, (err, res) => {
        if (err == null) {
          //console.dir(res.body);
          cell.vueComponent.$children[ 0 ].frame.contentWindow.updateChart(res.body);
        } else {
          mxLog.warn(err);
        }
      });

    }
    // const oldDeploy = editor.deploy;
    // editor.deploy = function(mxCell) {
    //   let jModel = oldDeploy(mxCell);
    //   if (jModel) {
    //     return jModel;
    //   } else {
    //     if (mxCell.getType() == 'process') {
    //       let process = {
    //         type: mxCell.getType(),//type = "process";
    //         id: mxCell.getId(),
    //         data: mxCell.getData(),
    //         trigger: [],
    //         input: [],
    //         error: [],
    //         result: []
    //       };
    //       //Trigger
    //       if (mxCell.children[ 0 ].edges)
    //         mxCell.children[ 0 ].edges.forEach(function(edge, i, arr) {
    //           if (edge.source.getId() != mxCell.children[ 0 ].getId()) {
    //             process.trigger.push(edge.source.getParent().getType() + '.' +
    //               edge.source.getParent().getId() + '.' + edge.source.getValue().toLowerCase());
    //           }
    //         }, that);
    //
    //       //Input
    //       if (mxCell.children[ 1 ].edges)
    //         mxCell.children[ 1 ].edges.forEach(function(edge, i, arr) {
    //           if (edge.source.getId() != mxCell.children[ 1 ].getId()) {
    //             process.input.push(edge.source.getParent().getType() + '.' +
    //               edge.source.getParent().getId() + '.' + edge.source.getValue().toLowerCase());
    //           }
    //         }, that);
    //
    //       //Error
    //       if (mxCell.children[ 2 ].edges)
    //         mxCell.children[ 2 ].edges.forEach(function(edge, i, arr) {
    //           if (edge.target.getId() != mxCell.children[ 2 ].getId()) {
    //             process.error.push(edge.target.getParent().getType() + '.' +
    //               edge.target.getParent().getId() + '.' + edge.target.getValue().toLowerCase());
    //           }
    //         }, that);
    //
    //       //Result
    //       if (mxCell.children[ 3 ].edges)
    //         mxCell.children[ 3 ].edges.forEach(function(edge, i, arr) {
    //           if (edge.target.getId() != mxCell.children[ 3 ].getId()) {
    //             process.result.push(edge.target.getParent().getType() + '.' +
    //               edge.target.getParent().getId() + '.' + edge.target.getValue().toLowerCase());
    //           }
    //         }, that);
    //
    //       //OutsX
    //       for (let i = 4; i < mxCell.getChildCount(); i++) {
    //         process[ 'out' + ( i - 4 ) ] = [];
    //         if (mxCell.children[ i ].edges)
    //           mxCell.children[ i ].edges.forEach(function(edge) {
    //             if (edge.target.getId() != mxCell.children[ i ].getId()) {
    //               process[ 'out' + ( i - 4 ) ].push(edge.target.getParent().getType() + '.' +
    //                 edge.target.getParent().getId() + '.' + edge.target.getValue().toLowerCase());
    //             }
    //           }, that);
    //       }
    //
    //       //console.dir(mxCell);
    //       //console.dir(process);
    //       return process;
    //     } else
    //       return false;
    //   }
    // };
  }
}
</script>
