<template>

</template>

<script>
import mxWebsphereMqDialogConfig from "./mxWebsphereMqDialogConfig";
import JsonObject from "./data";

mxCodecRegistry.addAlias(mxUtils.getFunctionName(JsonObject), 'JsonObject');

export default {
  name: 'mxWebsphereMq',
  props: {
    sidebar: {
      required: true
    }
  },
  data() {
    return {
      cell: null,
      image: "/src/images/icons48/mq_sidebar.png",
      label: '<img src="/src/images/icons48/mq.png" width="96" height="96">',
      type: "webspheremq",
      name: "WebsphereMQ",
      editor: null,
      wndConfig: null,
      background: null
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
          v1.geometry.alternateBounds = new mxRectangle(0, 0, 96, 24);
          // Adds the ports at various relative locations
          let port = graph.insertVertex(v1, null, 'Trigger', 0, 0.25, 12, 12,
              'port;image=editors/images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18', true);
          port.geometry.offset = new mxPoint(-1 + 10, -4);
          port.direction = "in";
          port = graph.insertVertex(v1, null, 'Input', 0, 0.75, 12, 12,
              'port;image=editors/images/overlays/check.png;align=right;imageAlign=right;spacingRight=18', true);
          port.geometry.offset = new mxPoint(0 + 10, -4);
          port.direction = "in";
          port = graph.insertVertex(v1, null, 'Error', 1, 0.25, 12, 12,
              'port;image=editors/images/overlays/error.png;spacingLeft=18', true);
          port.geometry.offset = new mxPoint(-10 - 10, -4);
          port.direction = "out";
          port = graph.insertVertex(v1, null, 'Result', 1, 0.75, 12, 12,
              'port;image=editors/images/overlays/information.png;spacingLeft=18', true);
          port.geometry.offset = new mxPoint(-11 - 10, -4);
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
    },
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
      let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
      let y = Math.max(10, ( document.body.scrollHeight ||
          document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
      this.wndConfig = new mxWindow(title, content, x, y, width, height, false, true);
      this.wndConfig.setClosable(true);
      this.wndConfig.destroyOnClose = true;
      graph.setEnabled(false);
      graph.tooltipHandler.hide();
      this.wndConfig.setVisible(true);
      // Fades the background out after after the window has been closed
      let that = this;
      this.wndConfig.addListener(mxEvent.DESTROY, function(evt) {
        graph.setEnabled(true);
        mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
      });
    },
    configCancel: function() {
      this.wndConfig.destroy();
      this.graph.setEnabled(true);
      mxEffects.fadeOut(this.background, 50, true, 10, 30, true);
    }
  },
  mounted() {
    let that = this;
    let editor = this.$store.getters.getEditor;
    that.graph = editor.graph;
    const _mxWebsphereMqDialogConfig = {
      components: {
        mxWebsphereMqDialogConfig
      },
      props: ['store', 'config'],
      template: '<mx-websphere-mq-dialog-config :store="store" :config="config" @ok="configOk($event)" @cancel="configCancel"></mx-websphere-mq-dialog-config>',
      methods: {
        configCancel: function() {
          that.wndConfig.destroy();
          that.graph.setEnabled(true);
          mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
        },
        configOk: function($event) {
          that.cell.setData(Object.assign(that.cell.getData(), { ...that.cell.getData(), ...{ config: $event } }));
          that.wndConfig.destroy();
          that.graph.setEnabled(true);
          mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
        }
      },
    };
    const ComponentClass = Vue.extend(_mxWebsphereMqDialogConfig);

    // Returns a shorter label if the cell is collapsed and no
    // label for expanded groups
    let getLabel = that.graph.getLabel;
    that.graph.getLabel = function(cell) {
      let tmp = getLabel.apply(this, arguments); // "supercall"
      if (this.isCellCollapsed(cell)) {
        if (cell.getType() === "webspheremq")
          tmp = `<h2>IBM MQ</h2>`;

      } else if (this.isCellLocked(cell)) {
        // Returns an empty label but makes sure an HTML
        // element is created for the label (for event
        // processing wrt the parent label)
        return '';
      }
      return tmp;
    };
    this.$nextTick(function() {
      that.addSidebarIcon(that.graph, that.sidebar, that.label, that.image, that.type);
    });
    // Installs context menu
    let defaultMenu = that.graph.popupMenuHandler.factoryMethod;
    that.graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
      defaultMenu(menu, cell, evt);
      if (cell != null && cell.getType() === 'webspheremq') {
        menu.addItem('Config', 'editors/images/config.png', function() {
          that.cell = cell;
          let instance = new ComponentClass({
            propsData: { store: that.$store, config: cell.getData().config }
          });
          instance.$mount();
          that.background = that.getBackground();
          document.body.appendChild(that.background);
          if (mxClient.IS_IE) {
            new mxDivResizer(that.background);
          }
          that.showModalConfigWindow(that.graph, "IBM MQ Configuration", instance.$el, 500, 272);
          //that.showModalWindow(graph, 'XML', instance.$el, 410, 440);
        });
      }
    };
    const oldDeploy = editor.deploy;
    editor.deploy = function(mxCell) {
      let jModel = oldDeploy(mxCell);
      if (jModel) {
        return jModel;
      } else {
        if (mxCell.getType() === 'webspheremq') {
          let webspheremq = {
            type: mxCell.getType(),//type = "webspheremq";
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
                webspheremq.trigger.push(edge.source.getParent().getType() + '.' +
                    edge.source.getParent().getId() + '.' + edge.source.getValue().toLowerCase());
              }
            }, that);

          //Input
          if (mxCell.children[ 1 ].edges)
            mxCell.children[ 1 ].edges.forEach(function(edge, i, arr) {
              if (edge.source.getId() !== mxCell.children[ 1 ].getId()) {
                webspheremq.input.push(edge.source.getParent().getType() + '.' +
                    edge.source.getParent().getId() + '.' + edge.source.getValue().toLowerCase());
              }
            }, that);

          //Error
          if (mxCell.children[ 2 ].edges)
            mxCell.children[ 2 ].edges.forEach(function(edge, i, arr) {
              if (edge.target.getId() !== mxCell.children[ 2 ].getId()) {
                webspheremq.error.push(edge.target.getParent().getType() + '.' +
                    edge.target.getParent().getId() + '.' + edge.target.getValue().toLowerCase());
              }
            }, that);

          //Result
          if (mxCell.children[ 3 ].edges)
            mxCell.children[ 3 ].edges.forEach(function(edge, i, arr) {
              if (edge.target.getId() !== mxCell.children[ 3 ].getId()) {
                webspheremq.result.push(edge.target.getParent().getType() + '.' +
                    edge.target.getParent().getId() + '.' + edge.target.getValue().toLowerCase());
              }
            }, that);

          return webspheremq;
        } else
          return false;
      }
    };
  }
}
</script>

