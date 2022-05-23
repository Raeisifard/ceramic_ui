import EB from "vertx3-eventbus-client";
import { EventBus } from "../event-bus";
import { CONNECTION_STATUS } from "./constants.js";

let myHandler = null;

let chunkSubstr = function(str, size) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)
  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[ i ] = str.substr(o, size)
  }
  return chunks
};

export default {
  checkVersion: (context, version) => {
    //TODO check version number with state-version and return true if the version is compatible.
    return true;
  },
  setVersion: (context, version) => {
    context.commit("SET_VERSION", version);
  },
  showSplash: (context, show) => {       // Add this:
    context.commit("SHOW_SPLASH", show);
  },
  setEditor: (context, editor) => {
    context.commit("SET_EDITOR", editor);
  },
  setCell: (context, cell) => {
    context.commit("SET_CELL", cell);
  },
  setConfig: (context, config) => {
    if (config == null) {
      mxUtils.get('./config.json', function(req) {
        let config = JSON.parse(req.request.responseText);
        context.commit("SET_CONFIG", config);
        context.commit("SET_EDITOR_CONFIG", config.editor);
      });
    } else {
      context.commit("SET_CONFIG", config);
      context.commit("SET_EDITOR_CONFIG", config.editor);
    }
  },
  setEditorConfig: (context, config) => {
    context.commit("SET_EDITOR_CONFIG", config);
  },
  setDialog: (context, dialog) => {
    dialog.close();
    context.commit("SET_DIALOG", dialog);
  },
  setEb: (context) => {
    let ctx = context;
    mxUtils.get('./config.json', function(req) {
      let config = JSON.parse(req.request.responseText);
      let options = {
        vertxbus_reconnect_attempts_max: config.vertxbus.reconnect.attemts_max || Infinity, // Max reconnect attempts
        vertxbus_reconnect_delay_min: config.vertxbus.reconnect.delay_min || 1000, // Initial delay (in ms) before first reconnect attempt
        vertxbus_reconnect_delay_max: config.vertxbus.reconnect.delay_max || 5000, // Max delay (in ms) between reconnect attempts
        vertxbus_reconnect_exponent: config.vertxbus.reconnect.exponent || 2, // Exponential backoff factor
        vertxbus_randomization_factor: config.vertxbus.randomization_factor || 0.5 // Randomization factor between 0 and 1
      };
      try {
        let eb = new EB(config.vertxbus.BusAddress, options);
        eb.enableReconnect(config.vertxbus.enableReconnect);
        eb.enablePing = function(enable) {
          eb.sockJSConn.send(JSON.stringify({ type: 'ping' }));
        };
        eb.onopen = function() {
          console.log("EB on open handler called.")
          ctx.dispatch("setConnected", true);
          // set a handler to receive a message
          eb.registerHandler('vx.mx', function(error, message) {
            if (error) {
              //EventBus.$emit('error', message);
              mxLog.warn("Vue EventBus got error on message handler:");
              console.dir(error);
            } else {
              let headers = message.headers;
              if (typeof message.body === 'object' && message.body.type && message.body.type === 'sync') {
                eb.enablePing(true);
                return;
              } else if (headers.cmd && headers.cmd === 'status' && headers[ "graph_id" ].toLowerCase() === context.getters.getGraphId) {
                switch (message.body) {
                  case "DEPLOYED":
                    let editor = context.state.editor;
                    editor.setGraph(mxUtils.getXml(new mxCodec(mxUtils.createXmlDocument()).encode(editor.graph.getModel())),
                      headers.graph_id, headers.graph_name, headers.active);
                    break;
                  //case "REDEPLOYED": Consists of one "Undeploy" followed by an explicit "Deploy".
                  case "DEPLOY FAILED":
                    context.dispatch("setGraphStatus", headers.active === 'true' ? 'deployed' : 'undeployed');
                    break;
                  case "UNDEPLOYED":
                    context.dispatch("setGraphStatus", 'undeployed');
                    break;
                }
              }
              let unit = headers.unit;//.e.g process.7 switch.2 ...
              //EventBus.$emit(unit, message);
            }
          });
          let id = ctx.getters.getGraphId;
          try {//Unregister previous uid listener if any.
            eb.unregisterHandler(`vx.mx.${id}`.toLowerCase(), myHandler);
            console.log("EB unregister handler");
            eb.registerHandler(`vx.mx.${id}`.toLowerCase(), myHandler);
            console.log("EB register handler");
          } catch (e) {
            console.dir(e);
          }
        };
        eb.onerror = function(err) {
          console.log("EB on error handler called.");
          try {
            ctx.dispatch("setConnected", false);
            mxLog.enter(JSON.stringify(err));
          } catch (e) {
            // dev tools are disabled so we cannot use console on IE
          }
        };
        context.commit("SET_EB", eb);
      } catch (e) {
        //mxLog.debug(e);
      }
    });
  },

  setConnected: (context, connected) => {
    context.commit("SET_CONNECTED", connected);
  },
  setDeployed: (context, deployed) => {
    context.commit("SET_DEPLOYED", deployed);
  },
  setComponents: (context, components) => {
    context.commit("SET_COMPONENTS", components);
  },
  addComponent: (context, component) => {
    context.commit("ADD_COMPONENT", component);
  },
  emit: (context, msg) => {
    let eb = context.getters.getEb;
    //msg.headers.graphId = context.getters.getGraphId;
    eb.send("mx.vx", msg.body, msg.headers, (err, res) => {
      if (err == null) {
        mxLog.debug(JSON.stringify(res.body));
      } else {
        mxLog.warn(JSON.stringify(err));
      }
    });
  },
  setGraphId: (context, graphId) => {
    if (myHandler === null) {
      myHandler = ( function(error, message) {
        if (message.headers.type === 'process') {
          let id = message.headers.id;
          let cmd = message.headers.cmd || message.body.cmd;
          if (cmd === 'label' && message.body.label) {
            let cell = this.getters.getModel.getCell(id);
            cell.setValue(message.body);
            let state = this.getters.getGraph.view.getState(cell);
            if (message.headers.fillColor) {
              state.style[ mxConstants.STYLE_FILLCOLOR ] = message.headers.fillColor;
            }
            if (message.headers.opacity) {
              state.style[ mxConstants.STYLE_OPACITY ] = message.headers.opacity;
            }
            if (message.headers.gradientColor) {
              state.style[ mxConstants.STYLE_GRADIENTCOLOR ] = message.headers.gradientColor;
            }
            state.shape.apply(state);

            mxCellRenderer.prototype.redrawLabel(state, true);

            state.shape.redraw();
          } else if (cmd === 'chart') {
            let cell = this.getters.getModel.getCell(id);
            //cell.label = message.body;
            //cell.setValue(message.body);
            if (cell.vueComponent)
              cell.vueComponent.$children[ 0 ].alertData(message.body);
            let state = this.getters.getGraph.view.getState(cell);
            state.shape.apply(state);
            mxCellRenderer.prototype.redrawLabel(state, true);
          }
        } else {
          EventBus.$emit(`${message.headers.address}`, message);
        }
        mxLog.debug('received a message: ' + JSON.stringify(message));
      } ).bind(context)
    }
    let eb = context.getters.getEb;
    let id = context.getters.getGraphId;
    if (eb != null && id != null && myHandler != null)
      if (id != graphId)
        try {//Unregister previous uid listener if any.
          eb.unregisterHandler(`vx.mx.${id}`.toLowerCase(), myHandler);
          console.log("EB unregister handler");
          eb.registerHandler(`vx.mx.${graphId}`.toLowerCase(), myHandler);
          console.log("EB register handler");
        } catch (e) {
          console.dir(e);
        }
    let bc = context.getters.getBc;
    if (bc != null && id != null) {
      bc.close();
    }
    id = graphId;
    context.commit("SET_GRAPH_ID", id);
    //eb.registerHandler(`vx.mx.${id}`, myHandler.bind(context));// set a handler to receive a message
    context.commit("SET_BC", new BroadcastChannel(id));
  },
  setGraphName: (context, graphName) => {
    context.getters.getEditor.graph.getModel().getCell(0).name = graphName;
    context.commit("SET_GRAPH_NAME", graphName);
  },
  setGraphStatus: (context, graphStatus) => {
    let eb = context.getters.getEb;
    let id = context.getters.getGraphId;

    context.commit("SET_GRAPH_STATUS", graphStatus);
    if (graphStatus === 'deployed') {
      //eb.registerHandler(`vx.mx.${id}`.toLowerCase(), myHandler);
      /*try {//Unregister previous uid listener
        //eb.unregisterHandler(`vx.mx.${id}`.toLowerCase(), myHandler);
      } finally {
        eb.registerHandler(`vx.mx.${id}`.toLowerCase(), myHandler);// set a handler to receive graph messages
      }*/
    } else {
      //eb.unregisterHandler(`vx.mx.${id}`.toLowerCase(), myHandler);
    }
  },
  setGraphState: (context, graphState) => {
    context.commit("SET_GRAPH_STATE", graphState);
    context.getters.getEditor.graph.refresh();
  },
  setGraphProfile: (context, graphProfile) => {
    context.commit("SET_GRAPH_PROFILE", graphProfile);
  },
  setJsonGraph: (context, jsonGraph) => {
    context.commit("SET_JSON_GRAPH", jsonGraph);
  },
  setData2JsonGraph: (context, dat) => {
    let jsonGraph = context.getters.getJsonGraph;
    if (!jsonGraph) return;//The graph did not deployed yet!
    let cmp = jsonGraph.filter(el => {
      return el.id === dat.id && el.type === dat.type
    });
    cmp.data = { ...cmp.data, ...dat.data };
    context.commit("SET_JSON_GRAPH", jsonGraph);
    //if (this.eb.state == 1)
    let eb = context.getters.getEb;
    let headers = {
      cmd: "set",
      graph_name: context.getters.getGraphName,
      graph_id: context.getters.getGraphId,
      type: dat.type,
      id: dat.id
    };
    eb.send('mx.vx', cmp.data, headers, (err, res) => {
      if (err == null) {
        mxLog.debug(JSON.stringify(res.body));
      } else {
        mxLog.warn(JSON.stringify(err));
      }
    });
  },
  sendCode2VX: (context, cell) => {
    let status = context.getters.getGraphStatus;
    if (status === 'undeployed') {
      return -1;//The Graph must already deployed!
    }
    let eb = context.getters.getEb;
    if (eb.state !== CONNECTION_STATUS.OPEN)
      return -1;
    let headers = {
      ...cell.getData().config,
      ...{
        cmd: "set",
        name: context.getters.getGraphName,
        uid: context.getters.getGraphId,
        type: cell.getType(),
        id: cell.getId(),
      }
    };
    eb.send('mx.vx', JSON.stringify({ code: cell.getData().code }), headers, (err, res) => {
      if (err == null) {
        mxLog.debug(res.body);
      } else {
        mxLog.warn(err);
      }
    });
  },
  sendSetting2VX: (context, cell, data) => {
    let status = context.getters.getGraphStatus;
    if (status === 'undeployed') {
      return -1;//The Graph must already deployed!
    }
    let eb = context.getters.getEb;
    if (eb.state !== CONNECTION_STATUS.OPEN)
      return -1;
    let headers = {
      ...cell.getData().config,
      ...{
        cmd: "set",
        name: context.getters.getGraphName,
        uid: context.getters.getGraphId,
        type: cell.getType(),
        id: cell.getId(),
      }
    };
    eb.send('mx.vx', JSON.stringify(data || cell.getData().setting), headers, (err, res) => {
      if (err == null) {
        mxLog.debug(res.body);
      } else {
        mxLog.warn(err);
      }
    });
  },
  receiveDataFromVX: (context, msg) => {
    let jsonGraph = context.getters.getJsonGraph;
    if (!jsonGraph) {
      mxLog.warn("Receive message while graph was stopped!");
      return;//The graph did not deployed yet!
    }
    let cmpType = msg.headers.type, cmpId = msg.headers.id, jsonCmp = null;
    if (cmpId && cmpType) {
      jsonCmp = jsonGraph.filter(el => {
        return el.id === cmpId && el.type === cmpType;
      });
    }
    if (!jsonCmp)
      return mxLog.warn(`Related component for "type:" ${cmpType} "id:" ${cmpId} not found!`);
    switch (cmpType.toLowerCase()) {
      case "chart":
        let func = jsonCmp.data.code;
        if (!func) {
          jsonCmp.data.chartData.push(msg.body);
        } else {
          let adaptor = new Function(func);
          jsonCmp.data.chartData.push(adaptor(msg));
        }
        break;
      default:
        break;
    }
    context.commit("SET_JSON_GRAPH", jsonGraph);
  },
  createNewGraph: (context, name) => {
    let editor = context.getters.getEditor;
    let oldModel = editor.graph.getModel();
    editor.open("/editors/diagrams/empty.xml");
    let model = editor.graph.getModel();
    let uid = context.getters.getUid();
    context.dispatch("setGraphId", uid);
    model.getCell(0).uid = uid;
    model.getCell(0).version = context.getters.getVersion;
    if (name)
      model.getCell(0).name = name;
    context.dispatch("setGraphName", model.getCell(0).name);
    return oldModel;
  },
  setThroughputEnable: (context, enable) => {
    context.commit("SET_THROUGHPUT_ENABLE", enable);
  },
  graph2vx: (context, { editor, cmd }) => {
    let enc = new mxCodec(mxUtils.createXmlDocument());
    let model = editor.graph.getModel();
    let node = enc.encode(model);
    this.eb = context.getters.getEb;
    //let headers = { cmd: "deploy", name: model.getCell(0).name, uid: model.getCell(0).uid};
    let headers = { cmd: cmd, name: context.getters.getGraphName, uid: context.getters.getGraphId };
    let graphXml = mxUtils.getXml(node);
    let chunk = chunkSubstr(graphXml, 200000);
    this.eb.send('mx.vx', "ask permission to send graph", headers, (err, res) => {
      if (err == null) {
        //res.reply
        editor.setGraph(res.body, res.headers.graph_id, res.headers.graph_name, res.headers.active);
        store.dispatch("setGraphStatus", res.headers.active ? 'deployed' : 'undeployed');
        //store.dispatch("setGraphStatus", "deployed");
      } else {
        mxLog.warn("There is some error in deploying graph!");
        console.dir(err);
      }
    });
  },
  /*setLabel: (context, editor) => {
    let model = editor.graph.model
    Object.entries(model.cells).forEach(entry => {
      let cell = entry[ 1 ];
      if (cell.type && cell.getType() === 'process' && cell.getValue().label) {
        cell.label = cell.getValue().label;
        let state = editor.graph.view.getState(cell);
        state.shape.apply(state);
        mxCellRenderer.prototype.redrawLabel(state, true);
      }
    })
  },*/
}