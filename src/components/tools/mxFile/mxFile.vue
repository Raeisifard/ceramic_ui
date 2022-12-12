<template>

</template>

<script>
  import JsonObject from "./data";
  import dialogSetting from "./dialogSetting";
  mxCodecRegistry.addAlias(mxUtils.getFunctionName(JsonObject), 'JsonObject');
  export default {
    name: 'mxFile',
    props: {
      sidebar: {
        required: true
      }
    },
    data() {
      return {
        image: "./src/images/icons48/folder.png",
        label: '<h1 style="margin:0;">File</h1>' +
          '<img src="./src/images/icons48/folder.png" width="48" height="48">',
        type: "file",
        name: "File"
      }
    },
    methods: {
      addSidebarIcon: function(graph, sidebar, label, image, type) {
        let funct = function(graph, evt, cell, x, y) {
          let parent = graph.getDefaultParent();
          let model = graph.getModel();
          let v1 = null;
          model.beginUpdate();
          try {
            v1 = graph.insertVertex(parent, null, label, x, y, 96, 96, type);
            v1.setConnectable(false);
            v1.setType(type);
            v1.setData(new JsonObject());
            // Presets the collapsed size
            v1.geometry.alternateBounds = new mxRectangle(0, 0, 70, 30);
            // Adds the ports at various relative locations
            let port = graph.insertVertex(v1, null, 'Trigger', 0, 0.25, 12, 12,
              'port;image=editors/images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18', true);
            port.geometry.offset = new mxPoint(-6, 4);
            port.direction = "in";
            port = graph.insertVertex(v1, null, 'Input', 0, 0.75, 12, 12,
              'port;image=editors/images/overlays/check.png;align=right;imageAlign=right;spacingRight=18', true);
            port.geometry.offset = new mxPoint(-6, -4);
            port.direction = "in";
            port = graph.insertVertex(v1, null, 'Error', 1, 0.25, 12, 12,
              'port;image=editors/images/overlays/error.png;spacingLeft=18', true);
            port.geometry.offset = new mxPoint(-6, 2);
            port.direction = "out";
            port = graph.insertVertex(v1, null, 'Result', 1, 0.75, 12, 12,
              'port;image=editors/images/overlays/information.png;spacingLeft=18', true);
            port.geometry.offset = new mxPoint(-6, -4);
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
        //img.style.marginTop = '10px';
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
      let wnd = null;
      let editor = this.$store.getters.getEditor;
      let graph = editor.graph;
      this.$nextTick(function() {
        that.addSidebarIcon(graph, that.sidebar, that.label, that.image, that.type);
      });
      let graphConvertValueToString = graph.convertValueToString;
      graph.convertValueToString = function(cell) {
        if (this.model.isVertex(cell) && cell.getType() === "file") {
          let overlays = graph.getCellOverlays(cell);
          if (overlays == null && 'enable' in cell.getData().config && !cell.getData().config.enable) {
            // Creates a new overlay with an image and a tooltip
            let overlay = new mxCellOverlay(
                new mxImage('editors/images/overlays/disabled.png', 16, 16),
                'Disabled', mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP);
            graph.addCellOverlay(cell, overlay);
          }
        }
        return graphConvertValueToString.apply(this, arguments);
      };
      // Installs context menu
      let defaultMenu = graph.popupMenuHandler.factoryMethod;
      graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
        defaultMenu(menu, cell, evt);
        if (cell != null && cell.getType() === 'file') {
          let enable = !('enable' in cell.getData().config) || cell.getData().config.enable;
          let enablePng = enable ? 'editors/images/disable.png' : 'editors/images/enable.png';
          menu.addItem('Setting', 'editors/images/setting.png', function() {
            //that.openSetting(menu, cell, evt, that);
            if (wnd && wnd.isVisible() && ( wnd.cellID === cell.getId() )) {
              wnd.setLocation(wnd.x, wnd.y);
              wnd.activate();
              wnd.fit();
            } else {
              if (wnd && wnd.isVisible())
                wnd.destroy();
              let prop = { cell: cell, store: that.$store, wnd: wnd }
              let vueObj = {
                name: "vue_dialogSetting",
                components: {
                  dialogSetting
                },
                props: ['prop'],
                template: '<dialog-setting :prop="prop"></dialog-setting>',
              }
              const ComponentClass = Vue.extend(vueObj);
              let instance = new ComponentClass({
                propsData: {
                  prop: prop
                }
              });
              instance.$mount(); // pass nothing
              let h = 203;
              let w = 500;
              let y = ( window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight ) / 2 + window.top.screenY - ( h / 2 );
              let x = ( window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth ) / 2 + window.top.screenX - ( w / 2 );
              if (x < 0 || y < 0) {
                x = cell.geometry.x;
                y = cell.geometry.y;
              }
              x = Math.max(0, document.body.scrollWidth / 2 - w / 2);
              y = Math.max(10, ( document.body.scrollHeight ||
                  document.documentElement.scrollHeight ) / 2 - h * 2 / 3);
              wnd = new mxWindow(`#${cell.getId()} File setting`, instance.$el, x, y, w, h, false, true);
              wnd.addListener(mxEvent.DESTROY, function(evt) {
                graph.setEnabled(true);
                mxEffects.fadeOut(prop.background, 50, true, 10, 30, true);
              });
              wnd.x = x;
              wnd.y = y;
              wnd.setMaximizable(false);
              wnd.setScrollable(false);
              wnd.setResizable(false);
              wnd.setClosable(true);
              wnd.setVisible(true);
              wnd.cellID = cell.getId();
              prop.wnd = wnd;
            }
          });
          menu.addItem( enable ? 'Disable' : 'Enable', enablePng, function() {
            cell.getData().config.enable = !enable;
            if (cell.getData().config.enable)
              graph.removeCellOverlays(cell);
            else{
              let overlays = graph.getCellOverlays(cell);
              if (overlays == null)
              {
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
        }
      };
      const oldDeploy = editor.deploy;
      editor.deploy = function(mxCell) {
        let jModel = oldDeploy(mxCell);
        if (jModel) {
          return jModel;
        } else {
          if (mxCell.getType() === 'file') {
            let file = {
              type: mxCell.getType(),//type = "file";
              id: mxCell.getId(),
              data: mxCell.getData(),
              trigger: [],
              input: [],
              error: [],
              result: []
            };
            //Trigger
            if (mxCell.children[ 0 ].edges)
              mxCell.children[ 0 ].edges.forEach(function(edge, i, arr) {
                if (edge.source.getId() !== mxCell.children[ 0 ].getId()) {
                  file.trigger.push(edge.source.getParent().getType() + '.' +
                    edge.source.getParent().getId() + '.' + edge.source.getValue().toLowerCase());
                }
              }, that);

            //Input
            if (mxCell.children[ 1 ].edges)
              mxCell.children[ 1 ].edges.forEach(function(edge, i, arr) {
                if (edge.source.getId() !== mxCell.children[ 1 ].getId()) {
                  file.input.push(edge.source.getParent().getType() + '.' +
                    edge.source.getParent().getId() + '.' + edge.source.getValue().toLowerCase());
                }
              }, that);

            //Error
            if (mxCell.children[ 2 ].edges)
              mxCell.children[ 2 ].edges.forEach(function(edge, i, arr) {
                if (edge.target.getId() !== mxCell.children[ 2 ].getId()) {
                  file.error.push(edge.target.getParent().getType() + '.' +
                    edge.target.getParent().getId() + '.' + edge.target.getValue().toLowerCase());
                }
              }, that);

            //Result
            if (mxCell.children[ 3 ].edges)
              mxCell.children[ 3 ].edges.forEach(function(edge, i, arr) {
                if (edge.target.getId() !== mxCell.children[ 3 ].getId()) {
                  file.result.push(edge.target.getParent().getType() + '.' +
                    edge.target.getParent().getId() + '.' + edge.target.getValue().toLowerCase());
                }
              }, that);

            return file;
          } else
            return false;
        }
      };
    }
  }
</script>

