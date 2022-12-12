<template>
  <div style="overflow: hidden">
    <input type="file" ref="import-file" style="display:none">
    <div style="background-color: #ddd;padding-top: 5px;padding-left: 10px;padding-bottom: 5px;">
      <span>
        <span style="width: 10px;display: inline-block;"></span>
        <span v-bind:class="{'blink': isBlink}"
              style="display: inline-block; float: left; margin: 10px; border-radius: 7px;">
          <img class="l-btn-left l-btn-icon-top" style=""
               src="/src/images/icons48/parquet.png"
               width="48" height="48" @click="showProps">
        </span>
        <span style="width: 20px;display: inline-block;"></span>
      <LinkButton iconCls="icon-large-new" size="large" iconAlign="top" @click="newClicked">New</LinkButton>
      <LinkButton iconCls="icon-large-save" size="large" iconAlign="top" @click="saveClicked">Save</LinkButton>
      <span style="width: 10px;display: inline-block;"></span>
      <LinkButton iconCls="icon-undo" iconAlign="top" @click="undoClicked">Undo</LinkButton>
      <LinkButton iconCls="icon-redo" iconAlign="top" @click="redoClicked">Redo</LinkButton>
      <span style="width: 10px;display: inline-block;"></span>
      <LinkButton iconCls="icon-large-cut" size="large" iconAlign="top" @click="cutClicked">Cut</LinkButton>
      <LinkButton iconCls="icon-large-copy" size="large" iconAlign="top" @click="copyClicked">Copy</LinkButton>
      <LinkButton iconCls="icon-large-paste" size="large" iconAlign="top" @click="pasteClicked">Paste</LinkButton>
      <span style="width: 10px;display: inline-block;"></span>
      <LinkButton iconCls="icon-large-import" size="large" iconAlign="top" @click="importClicked">import</LinkButton>
      <LinkButton iconCls="icon-large-export" size="large" iconAlign="top" @click="exportClicked">export</LinkButton>
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
        </span>
      <span style="width: 20px;display: inline-block;"></span>
      <span>
      <MenuButton style="" text="About" :plain="true">
        <Menu :noline="true">
          <div style="padding:10px">
            <img src="/src/images/parquet_about.png" style="width:120px;height:50px">
          </div>
        </Menu>
      </MenuButton>
        </span>
    </div>
    <div ref="blocklyDiv" class="blocklyDiv">
    </div>
  </div>
</template>

<script>
import Blockly from 'blockly';
import '../blocks/pattern';
import '../blocks/sql';

export default {
  name: 'EditorComponent',
  props: ['options', 'cell', 'store'],
  data() {
    return {
      workspace: null,
      bc: null,
      cid: null,
      gid: null,
      clipboard: null,
      isBlink: false,
    }
  },
  methods: {
    showProps: function() {
      alert(`Graph id: ${this.gid}\nParquet id: ${this.cid}`);
    },
    newClicked: function() {
      Blockly.mainWorkspace.clear();
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
    cutClicked: function() {
      if (Blockly.selected) {
        const p = new DOMParser();
        const d = p.parseFromString('<xml/>', "text/xml");
        d.documentElement.appendChild(Blockly.Xml.blockToDom(Blockly.selected, true));
        const serializer = new XMLSerializer();
        const xmlStr = serializer.serializeToString(d);
        if (typeof ( Storage ) !== "undefined") {
          window.localStorage.setItem('parquet.clipboard', xmlStr);
        } else {
          this.clipboard = xmlStr;
        }
        Blockly.Events.setGroup(true);
        Blockly.hideChaff();
        Blockly.selected.dispose(true);
        Blockly.Events.setGroup(false);
      }
    },
    copyClicked: function() {
      if (Blockly.selected) {
        const p = new DOMParser();
        const d = p.parseFromString('<xml/>', "text/xml");
        d.documentElement.appendChild(Blockly.Xml.blockToDom(Blockly.selected, true));
        const serializer = new XMLSerializer();
        const xmlStr = serializer.serializeToString(d);
        if (typeof ( Storage ) !== "undefined") {
          window.localStorage.setItem('parquet.clipboard', xmlStr);
        } else {
          this.clipboard = xmlStr;
        }
      }
    },
    pasteClicked: function() {
      /*Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.workspace))
      Blockly.Xml.appendDomToWorkspace(Blockly.Xml.blockToDom(Blockly.selected, true), this.workspace);
      let dom = Blockly.Xml.blockToDom(Blockly.selected, true);
      let xml = Blockly.Xml.domToText(dom);
      xml = '<xmg><block xmlns="https://developers.google.com/blockly/xml" type="xml_element" id="vYC,b=+33ZMQ?h8l=[`,"><field name="trans">Active</field><field name="tag">element</field></block></xmg>'
      dom = Blockly.Xml.textToDom(xml);
      Blockly.Xml.domToWorkspace(dom, this.workspace);*/
      //console.dir(Blockly.Xml.blockToDom(Blockly.selected, true));
      let xmlStr = null;
      if (typeof ( Storage ) !== "undefined") {
        xmlStr = window.localStorage.getItem('parquet.clipboard');
      } else {
        xmlStr = this.clipboard;
      }
      const dom = Blockly.Xml.textToDom(xmlStr);
      Blockly.Xml.appendDomToWorkspace(dom, this.workspace);

    },
    importClicked: function() {
      this.$refs[ "import-file" ].click();
    },
    exportClicked: function() {
      let blob = new Blob([Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.workspace))],
          { type: 'text/xml;charset=utf-8;' });
      let filename = `Parquet-${this.gid}-${this.cid}.xml`;
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename)
      } else {
        let link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          let url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    onItemClick: function(event) {
      switch (event) {
        case 'save':
          this.bc.postMessage({
            cmd: 'setCellCode', gid: this.gid, cid: this.cid,
            xml: Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.workspace)),
            code: Blockly[ 'JavaScript' ].workspaceToCode(this.workspace)
          });
          //console.dir(Blockly[ 'JavaScript' ].workspaceToCode(this.workspace));
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
    },
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
        //that.console.log("done");
      } else if (ev.data.gid === that.gid && ev.data.cid === that.cid && ev.data.cmd
          && ev.data.cmd === 'heartbeat') {
        that.isBlink = true;
        setTimeout(function() {
          that.isBlink = false;
        }.bind(that), 1000);
      }
    }
    this.bc.postMessage({ cmd: 'getCellData', gid: this.gid, cid: this.cid });
    //this.timerInterval = setInterval(() => (this.bc.postMessage({ cmd: 'heartbeat', gid: this.gid, cid: this.cid })), 2000);
    window.addEventListener('resize', this.onresize, false);
    Blockly.svgResize(that.workspace);

    /*this.$refs[ "import-file" ].onchange = function(evt) {
      console.dir(evt.target.value);
      evt.target.value = "";
    };*/
    this.$refs[ "import-file" ].addEventListener('change', function() {

      let fr = new FileReader();
      fr.onload = function() {
        try {
          let dom = Blockly.Xml.textToDom(fr.result);
          Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, that.workspace);
        } catch (e) {
          alert("File content is not \"Parquet\" compatible.");
        }
      }
      if (this.files[ 0 ]) {
        fr.readAsText(this.files[ 0 ]);
      }
      this.value = "";
    })
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

.icon-large-cut {
  background: url('icons/large_cut.png') no-repeat center center;
}

.icon-large-copy {
  background: url('icons/large_copy.png') no-repeat center center;
}

.icon-large-paste {
  background: url('icons/large_paste.png') no-repeat center center;
}

.icon-large-import {
  background: url('icons/large_import.png') no-repeat center center;
}

.icon-large-export {
  background: url('icons/large_export.png') no-repeat center center;
}

.icon-small-import {
  background: url('icons/small_import.png') no-repeat center center;
}

.icon-small-export {
  background: url('icons/small_export.png') no-repeat center center;
}

.l-btn-large {
  margin: 2px;
}

.parquet-logo {
  margin-top: 8px;
  margin-right: 20px;
}

.blink {
  background-color: rgba(244, 176, 14, .4);
}
</style>
