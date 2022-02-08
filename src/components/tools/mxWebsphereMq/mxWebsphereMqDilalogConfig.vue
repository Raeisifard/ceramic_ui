<template>
  <div ref="configForm">
    <div style="height: 40px; padding-top: 10px; padding-left: 20px; font-size: larger;">
      <label for="dsname">Data Source Name:</label>
      <input type="text" id="dsname" name="dsname" style="font-size: 14px; padding: 5px;">
    </div>
    <div style="display: flex;justify-content: space-around; padding-top: 12px;">
      <select v-model="nameType">
        <option v-for="(value, name) in dataSourceTypes" v-bind:value="name">
          {{ name }}
        </option>
      </select>
      <button class="button-dark" style="color: mediumspringgreen;"
              @click="nameOk($refs.configForm.getElementsByTagName('input')[0])">OK ...</button>
      <button class="button-dark" style="color: gold;"
              @click="nameCancel($refs.configForm.getElementsByTagName('input')[0])">Cancel</button>
    </div>
  </div>
</template>

<script>
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
      image: "/src/images/icons48/mq_sidebar.png",
      label: '<img src="/src/images/icons48/mq.png" width="96" height="96">',
      type: "webspheremq",
      name: "WebsphereMQ",
      config: null
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
    /*openConfig: function(menu, cell, evt, cx) {
      let cmd = {};
      cmd.style = { width: '500px', height: '335px' };
      cmd.name = "config";
      cmd.title = "IBM MQ Configuration";
      cx.$store.dispatch("setCell", cell);
      cx.$store.commit("SET_CMD", cmd);
      window.easyDialog.open();
      window.easyDialog.moveToTop();
      window.easyDialog.center();
    },*/
    openConfig: function(menu, cell, evt, cx) {
      let graph = editor.graph;
      this.background = this.getBackground();
      document.body.appendChild(that.background);
      if (mxClient.IS_IE) {
        new mxDivResizer(that.background);
      }
      this.showModalConfigWindow(graph, "IBM MQ Configuration", this.$refs[ 'configForm' ], 410, 110);
    },
    openSetting: function(menu, cell, evt, cx) {
      let data = cell.getData();
      let cmd = {};
      cmd.style = { width: '500px', height: '170px' };
      cmd.name = "setting";
      cmd.title = "IBM MQ Setting (Message count in each reading.)";
      cx.$store.dispatch("setCell", cell);
      cx.$store.commit("SET_CMD", cmd);
      window.easyDialog.open();
      window.easyDialog.moveToTop();
      window.easyDialog.center();
    },
    getBackground: function() {
      let background = document.createElement('div');
      background.style.position = 'absolute';
      background.style.left = '0px';
      background.style.top = '0px';
      background.style.right = '0px';
      background.style.bottom = '0px';
      background.style.background = 'black';
      mxUtils.setOpacity(background, 50);
      return background;
    },
    configOk: function(event) {
      if (event) {
        if (typeof event === 'string')
          this.name = event.trim();
        else {
          this.name = event.value.trim();
          event.value = "";
        }
        if (this.name.length < 1)
          alert("Please, Enter a valid name.");
        else {
          if (this.wndConfig)
            this.wndConfig.hide();
          let root = this.editor.graph.getModel().root;
          let dataSources = JSON.parse(root.getData()) || {};
          let dataSource = null;
          if (dataSources[ this.name ]) {
            dataSource = dataSources[ this.name ]
          } else {
            dataSource = this.dataSourceTypes[ this.nameType ];
            this.nameType = "Free Type";
          }
          if (this.wndForm === null) {
            let width = 500;
            let height = 320;
            let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
            let y = Math.max(10, ( document.body.scrollHeight ||
                document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
            this.wndForm = new mxWindow(`Create Data Source (${this.name})`, this.$refs[ 'dataSourceForm' ], x, y, width, height, false, true);
          }
          this.jsonEditor.set(dataSource);
          this.wndForm.setVisible(true);
        }
      }
    },
    configCancel: function(event) {
      if (event) {
        event.value = "";
      }
      this.nameType = "Free Type";
      this.wndConfig.hide();
      this.editor.graph.setEnabled(true);
      mxEffects.fadeOut(this.background, 50, true,
          10, 30, true);
    },
    showModalConfigWindow: function(graph, title, content, width, height) {
      if (this.wndConfig === null) {
        let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
        let y = Math.max(10, ( document.body.scrollHeight ||
            document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
        this.wndConfig = new mxWindow(title, content, x, y, width, height, false, true);
      }
      graph.setEnabled(false);
      graph.tooltipHandler.hide();
      this.wndConfig.setVisible(true);
    }
  },
  mounted() {
    let that = this;
    let editor = this.$store.getters.getEditor;
    let graph = editor.graph;
    // Returns a shorter label if the cell is collapsed and no
    // label for expanded groups
    let getLabel = graph.getLabel;
    graph.getLabel = function(cell) {
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
      that.addSidebarIcon(graph, that.sidebar, that.label, that.image, that.type);
    });
    // Installs context menu
    let defaultMenu = graph.popupMenuHandler.factoryMethod;
    graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
      defaultMenu(menu, cell, evt);
      if (cell != null && cell.getType() === 'webspheremq') {

        menu.addItem('Config', 'editors/images/config.png', function() {
          that.openConfig(menu, cell, evt, that);
        });
        /*menu.addItem('Setting', 'editors/images/setting.png', function() {
          that.openSetting(menu, cell, evt, that);
        });*/
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

