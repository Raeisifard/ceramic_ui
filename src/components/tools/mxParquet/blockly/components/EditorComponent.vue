<template>
  <div style="overflow: hidden">
    <div style="background-color: #ddd;padding-top: 5px;padding-left: 10px;padding-bottom: 5px;">
      <img class="l-btn-left l-btn-icon-top parquet-logo" style="margin-top: 5px;" src="/src/images/icons48/parquet.png"
           width="48" height="48">
      <LinkButton iconCls="icon-large-new" size="large" iconAlign="top" @click="newClicked">New</LinkButton>
      <LinkButton iconCls="icon-large-save" size="large" iconAlign="top" @click="saveClicked">Save</LinkButton>
      <LinkButton iconCls="icon-undo" size="large" iconAlign="top" @click="undoClicked">undo</LinkButton>
      <LinkButton iconCls="icon-redo" size="large" iconAlign="top" @click="redoClicked">redo</LinkButton>
      <!--      <MenuButton text="Edit" :plain="true" iconCls="icon-edit">
              <Menu @itemClick="onItemClick($event)">
                <MenuItem value="undo" text="Undo" iconCls="icon-undo"></MenuItem>
                <MenuItem value="redo" text="Redo" iconCls="icon-redo"></MenuItem>
                <MenuSep></MenuSep>
                <MenuItem text="Cut"></MenuItem>
                <MenuItem text="Copy"></MenuItem>
                <MenuItem text="Paste"></MenuItem>
                <MenuSep></MenuSep>
                <MenuItem text="Toolbar">
                  <SubMenu>
                    <MenuItem text="Address"></MenuItem>
                    <MenuItem text="Link"></MenuItem>
                    <MenuItem text="Navigation Toolbar"></MenuItem>
                    <MenuItem text="Bookmark Toolbar"></MenuItem>
                    <MenuSep></MenuSep>
                    <MenuItem text="New Toolbar..."></MenuItem>
                  </SubMenu>
                </MenuItem>
                <MenuItem text="Delete" iconCls="icon-remove"></MenuItem>
                <MenuItem text="Select All"></MenuItem>
              </Menu>
            </MenuButton>-->
      <MenuButton text="About" :plain="true">
        <Menu :noline="true">
          <div style="padding:10px">
            <img src="/src/images/parquet_about.png" style="width:120px;height:50px">
          </div>
        </Menu>
      </MenuButton>
    </div>
    <div ref="blocklyDiv" class="blocklyDiv">
    </div>
  </div>
</template>

<script>
import Blockly from 'blockly';
import '../blocks/pattern';

export default {
  name: 'EditorComponent',
  props: ['options', 'cell', 'store'],
  data() {
    return {
      workspace: null,
      bc: null,
      cid: null,
      gid: null
    }
  },
  methods: {
    newClicked: function() {
      this.workspace.clear();
    },
    saveClicked: function() {
      this.bc.postMessage({
        cmd: 'setCellCode', gid: this.gid, cid: this.cid,
        xml: Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.workspace)),
        code: Blockly[ 'JavaScript' ].workspaceToCode(this.workspace)
      });
    },
    undoClicked: function() {
      Blockly.mainWorkspace.undo(false);
    },
    redoClicked: function() {
      Blockly.mainWorkspace.undo(true);
    },
    onItemClick: function(event) {
      switch (event) {
        case 'save':
          this.bc.postMessage({
            cmd: 'setCellCode', gid: this.gid, cid: this.cid,
            xml: Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.workspace)),
            code: Blockly[ 'JavaScript' ].workspaceToCode(this.workspace)
          });
          console.dir(Blockly[ 'JavaScript' ].workspaceToCode(this.workspace));
          break;
        case 'new':
          this.workspace.clear();
          break;
        case 'undo':
          Blockly.mainWorkspace.undo(false);
          break;
        case 'redo':
          Blockly.mainWorkspace.undo(true);
          break;
      }
    },
    getId: function() {
      return this.cell.getType() + '.' + this.cell.getId()
    },
    onresize: function(e) {
      let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      this.$el.style.width = w + 'px';
      this.$el.style.height = h + 'px';
      this.$refs[ "blocklyDiv" ].style.width = w - 5 + 'px';
      this.$refs[ "blocklyDiv" ].style.height = h - 80 + 'px';
      Blockly.svgResize(this.workspace);
    }
  },
  mounted() {
    let that = this;
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.$el.style.width = w + 'px';
    this.$el.style.height = h + 'px';
    this.$refs[ "blocklyDiv" ].style.width = w - 5 + 'px';
    this.$refs[ "blocklyDiv" ].style.height = h - 80 + 'px';
    let options = this.$props.options || {};
    if (!options.toolbox) {
      options.toolbox = this.$refs[ "blocklyToolbox" ];
    }
    this.workspace = Blockly.inject(this.$refs[ "blocklyDiv" ], options);
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('gid'))
      this.gid = urlParams.get('gid');
    if (urlParams.has('cid'))
      this.cid = urlParams.get('cid');
    this.bc = new BroadcastChannel(this.gid + ':parquet');
    this.bc.onmessage = function(ev) {
      if (ev.data.gid === that.gid && ev.data.cid === that.cid && ev.data.cmd
          && ev.data.cmd === 'setCellData' && ev.data.xml && ev.data.xml.trim().length > 0) {
        let xml = Blockly.Xml.textToDom(ev.data.xml);
        //Blockly.Xml.domToWorkspace(xml, that.workspace);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, that.workspace);
        that.console.log("done");
      }
    }
    this.bc.postMessage({ cmd: 'getCellData', gid: this.gid, cid: this.cid });

    window.addEventListener('resize', this.onresize, false);
    Blockly.svgResize(that.workspace);
  },
  computed: {
    console: () => console,
    window: () => window,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/*.blocklyDiv {
    height: calc(100% - 30px);
    width: 100%;
    text-align: left;
}*/
.blocklyTreeRoot {
  margin-top: 20px;
}

.icon-large-new {
  background: url('icons/large_new.png') no-repeat center center;
}

.icon-large-save {
  background: url('icons/large_save.png') no-repeat center center;
}

.l-btn-large {
  margin: 2px;
}

.parquet-logo {
  margin-top: 8px;
  margin-right: 20px;
}
</style>
