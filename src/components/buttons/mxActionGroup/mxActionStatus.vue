<template>
  <!--<mx-button :editor="editor" action="deploy" label="Deploy"
             image="/src/images/deploy.png"></mx-button>-->
  <span :class="{open: open, 'x-split-button':true}" @click.stop>
     <!-- <mx-button class="x-button x-button-main" :editor="editor" action="deploy" label="Deploy"
                 image="/src/images/deploy.png"></mx-button>-->
        <button class="x-button x-button-drop" @click="open = addOpenClass()">&#9660;</button>
      <button class="status-button" :class="getConnectionState" type="button" disabled>
        {{ getStatus }}
        <img style="" v-if="image" :src="image"/>
      </button>

      <ul class="x-button-drop-menu" @click="open = false">
          <li>
          <a @click.prevent="newGraph">New</a>
        </li>
        <li>
          <a v-if="isDeployEnable" @click.prevent="deploy">Deploy</a>
        </li>
        <li>
          <a v-if="isUndeployEnable" @click.prevent="undeploy">Undeploy</a>
        </li>
        <li>
          <a v-if="isRedeployEnable" @click.prevent="redeploy">Redeploy</a>
        </li>
        <!--          <mx-open-xml-graph :max=1></mx-open-xml-graph>-->
          <mx-import-button></mx-import-button>
          <mx-export-button></mx-export-button>
        <li>
          <a @click.prevent="showList">List</a>
        </li>
      </ul>
        <graph-list v-if="showGraphList" @closeGraphList="showList"></graph-list>
        <confirm-alert v-if="confirmAlert" @cancel="confirmAlert=false;" @confirm="confirm($event)"
                       :action="action"></confirm-alert>
    </span>
</template>

<script>
const pako = require('pako');
import mxButton from '@/components/buttons/mxComponents/mxButton.vue';

import MxImportButton from "./mxImport/mxImportButton";
import MxExportButton from "./mxExport/mxExportButton";
import { CONNECTION_STATUS } from "@/store/constants.js";
import Graph from "../../Graph";
import GraphList from "./tools/GraphList";
import ConfirmAlert from "./tools/ConfirmAlert";

class JsonCodec extends mxObjectCodec {
  constructor() {
    super((value) => {
    });
  }

  encode(value) {
    const xmlDoc = mxUtils.createXmlDocument();
    const newObject = xmlDoc.createElement("Object");
    for (let prop in value) {
      newObject.setAttribute(prop, value[ prop ]);
    }
    return newObject;
  }

  decode(model) {
    return Object.keys(model.cells).map(
        (iCell) => {
          const currentCell = model.getCell(iCell);
          return ( currentCell.value !== undefined ) ? currentCell : null;
        }
    ).filter((item) => ( item !== null ));
  }
}

export default {
  name: "mxDeployButton",
  components: {
    ConfirmAlert,
    Graph,
    MxExportButton,
    MxImportButton,
    mxButton,
    /*
        mxOpenXmlGraph,
    */
    GraphList
  },
  data: function() {
    return {
      action: "Undeployed",
      open: false,
      editor: this.$store.getters.getEditor,
      eb: this.$store.getters.getEb,
      openXmlGraph: false,
      image: "/src/images/deploy.png",
      stateClass: "closed",
      showGraphList: false,
      confirmAlert: false
    }
  },
  mounted() {
    let that = this;
    this.editor.addAction('deploy', function(editor, cell) {
      let enc = new mxCodec(mxUtils.createXmlDocument());
      let model = editor.graph.getModel();
      let node = enc.encode(model);
      let store = that.$store;
      this.eb = store.getters.getEb;
      const gzip = pako.gzip(JSON.stringify({
        cmd: "deploy",
        uid: store.getters.getGraphId,
        name: store.getters.getGraphName,
        graph: mxUtils.getXml(node),
        zip: false
      }));
      run().catch(err => console.log(err));

      async function run() {
        // Post the form, just make sure to set the 'Content-Type' header
        const res = await that.$http.post(`http://${that.$store.getters.getConfig.vertxbus.BusAddress}/stt/form`, gzip, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip'
          }
        });
        console.log(res.data);
      }
    });

    this.editor.addAction('redeploy', function(editor, cell) {

      let enc = new mxCodec(mxUtils.createXmlDocument());
      let model = editor.graph.getModel();
      if (model.getChildVertices(model.root.children[ 0 ]).length === 0) {
        mxLog.writeln(`ERROR: Could not redeploy.`);
        mxLog.writeln(`The Graph "${that.$store.getters.getGraphName}" is empty.`);
        return
      }
      let node = enc.encode(model);
      let store = that.$store;
      this.eb = store.getters.getEb;
      const gzip = pako.gzip(JSON.stringify({
        cmd: "redeploy",
        uid: store.getters.getGraphId,
        name: store.getters.getGraphName,
        //graph: LZString.compressToUTF16(mxUtils.getXml(node)),
        graph: mxUtils.getXml(node),
        zip: false
      }));
      run().catch(err => console.log(err));

      async function run() {
        // Post the form, just make sure to set the 'Content-Type' header
        const res = await that.$http.post(`http://${that.$store.getters.getConfig.vertxbus.BusAddress}/stt/form`, gzip, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip'
          }
        });
        console.log(res.data);
      }
    });

    this.editor.addAction('undeploy', function(editor, cell) {
      let store = that.$store;
      this.eb = store.getters.getEb;
      let headers = { cmd: "undeploy", name: store.getters.getGraphName, uid: store.getters.getGraphId };
      this.eb.send('mx.vx', "Undeploy the Graph", headers, (err, res) => {
        if (err == null) {
          //store.dispatch("setGraphStatus", "undeployed");
          store.dispatch("setThroughputEnable", false);
        } else {
          mxLog.warn("There is some error in undeploying graph!");
          console.dir(err);
        }
      });
    });

    this.editor.addAction('view', function(editor, cell, graphId) {
      let store = that.$store;
      let headers = {};
      that.$http({
        method: 'post',
        url: `http://${that.$store.getters.getConfig.vertxbus.BusAddress}/stt/form`,
        //headers: headers,
        data: {
          cmd: "view",
          uid: graphId
        }
      }).then(function(response) {
        editor.setGraph(response.data.graph, response.data.uid, response.data.graphName, response.data.active);
        store.dispatch("setThroughputEnable", false);
      }).catch(function(error) {
        console.dir(error);
      });
    })

    document.body.onclick = function() {
      that.open = false;
    };
    //this.$store.dispatch("setEb");
  },
  methods: {
    confirm($event) {
      this.confirmAlert = false;
      console.dir($event);
      if ($event === 'undeploy')
        this.editor.execute("undeploy");
      else if ($event === 'redeploy')
        this.editor.execute("redeploy");
    },
    deploy() {
      //this.action = 'deploy';
      //this.confirmAlert = true;
      this.editor.execute("deploy");
    },
    undeploy() {
      this.action = 'undeploy';
      this.confirmAlert = true;
      //this.editor.execute("undeploy");
    },
    redeploy() {
      this.action = 'redeploy';
      this.confirmAlert = true;
      //this.editor.execute("redeploy");
    },
    newGraph() {
      this.$store.dispatch("createNewGraph", "NewGraph");
    },
    openGraph() {
      this.openXmlGraph = true;
    },
    showList() {
      this.showGraphList = !this.showGraphList;
    },
    addOpenClass() {
      return this.open = !this.open;
    },
    getJsonModel() {
      const encoder = new JsonCodec();
      //encoder.exclude.push('vueComponent').push('data').push('dataset');
      return encoder.decode(this.editor.graph.getModel());//jsonModel
    },
    prettyXmlModel() {
      let enc = new mxCodec(mxUtils.createXmlDocument());
      let node = enc.encode(this.editor.graph.getModel());
      return mxUtils.getPrettyXml(node);
    },
    stringifyWithoutCircular(json) {
      return JSON.stringify(
          json,
          (key, value) => {
            if (( key === 'parent' || key == 'source' || key == 'target' ) && value !== null) {
              return value.id;
            } else if (key === 'value' && value !== null && value.localName) {
              let results = {};
              Object.keys(value.attributes).forEach(
                  (attrKey) => {
                    const attribute = value.attributes[ attrKey ];
                    results[ attribute.nodeName ] = attribute.nodeValue;
                  }
              );
              return results;
            }
            return value;
          },
          4
      );
    }

  },
  computed: {
    isDeployEnable: function() {
      return this.$store.getters.getConnected && ( this.$store.getters.getGraphStatus === null || this.$store.getters.getGraphStatus === 'undeployed' )
    },
    isRedeployEnable: function() {
      return this.$store.getters.getConnected && ( this.$store.getters.getGraphStatus === 'deployed' )
    },
    isUndeployEnable: function() {
      return this.$store.getters.getConnected && ( this.$store.getters.getGraphStatus === 'deployed' )
    },
    getConnectionState: function() {
      if (!this.$store.getters.getEb)
        return "closed";
      let state = this.$store.getters.getEb.state;
      switch (state) {
        case CONNECTION_STATUS.CONNECTING:
          this.stateClass = "connecting";
          break;
        case CONNECTION_STATUS.OPEN:
          this.stateClass = "open";
          break;
        case CONNECTION_STATUS.CLOSING:
          this.stateClass = "closing";
          break;
        case CONNECTION_STATUS.CLOSED:
          this.stateClass = "closed";
          break;
      }
      return this.stateClass;
    },
    getStatus: function() {
      return ( this.$store.state.graphStatus == null ? " " : this.$store.state.graphStatus ).padEnd(35);
    }
  }
}
</script>

<style scoped>
.x-split-button {
  border-width: 0;
  /* position: relative;
   display: block;
   text-align: left;*/
  /*margin-top: 20px;*/
}

.x-button {
  /*  position: relative;
    margin: 0;*/
  font-size: 10px;
  /* float: left;
   outline: none;
   !*line-height: 27px;*!
   background: #F2F2F2;
   border: 1px solid #E0E0E0;
   box-shadow: 1px 1px 2px #E0E0E0;*/
}

.x-button:hover {
  cursor: pointer;
  /*background: #E0E0E0;*/
}

.x-button:active {
  background: #D3D3D3;
}

.x-button.x-button-drop {
  /* border-left: 0;
   height: 18px;*/
  padding: 1px 0px;
  top: 2px;
  position: relative;
  height: 23px;
  font-size: 14px;
}

.open > .x-button-drop-menu {
  display: block;
}

.x-button-drop-menu {
  position: fixed;
  width: 119px;
  top: 30px;
  /*right: 0;*/
  z-index: 1000;
  display: none;
  float: left;
  /*min-width: 160 px;*/
  padding: 5px 0;
  margin: 2px 0 0;
  font-size: 16px;
  list-style: none;
  background-color: #F2F2F2;
  background-clip: padding-box;
  border: 1px solid #E0E0E0;
  box-shadow: 1px 1px 2px #E0E0E0;
}

.x-button-drop-menu li a {
  display: block;
  padding: 3px 19px;
  clear: both;
  font-family: arial;
  color: #444;
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
}

.x-button-drop-menu li a:hover {
  background: #D3D3D3;
}

.status-button {
  font-size: 14px;
  font-weight: bold;
  font-variant-caps: unicase;
  color: initial;
  border-style: inset;
  width: 115px;
}

.status-button img {
  height: 16px;
  vertical-align: middle;
  margin-right: 2px;
  top: 1px;
  position: relative;
}

.trans {
  background: transparent;
  color: #FFFFFF;
  border: none;
}

.open {
  background-color: greenyellow;
  /*border-width: 2px;*/
  border-color: greenyellow;
  border-style: inset;
  /*font-size: unset;*/
}

.connecting {
  background-color: yellow;
  border-width: 2px;
  border-color: greenyellow;
  border-style: inset;
}

.closing {
  background-color: gray;
  border-width: 2px;
  border-color: greenyellow;
  border-style: inset;
}

.closed {
  background-color: black;
  border-width: 2px;
  border-color: greenyellow;
  border-style: inset;
}
</style>