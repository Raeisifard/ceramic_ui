<template>
  <div style="display: contents; overflow: hidden;">
    <div class="f-full">
      <div style="margin-bottom:10px; display: flex; flex-direction: row; justify-content: space-between;">
        <div style="display: flex; width: 60%;">
          <Label for="ip" align="top" style="display: flex;">IP:</Label>
          <TextBox inputId="ip" iconCls="icon-ip" placeholder="172.0.0.1" v-model="ip"
                   style="width:150px; display: flex;"></TextBox>
        </div>
        <div style="display: flex; width: 40%;">
          <Label for="port" align="top" style="display: flex;">Port:</Label>
          <NumberBox inputId="port" placeholder=1433 v-model="port" :max=65536 :min=0 iconCls="icon-port"
                     iconAlign="left"
                     style="width: 100px; display: flex; "></NumberBox>
        </div>
      </div>

      <div style="margin-bottom: 10px; display: flex; flex-direction: row; justify-content: space-between;">
        <div style="display: flex;">
          <Label for="user" align="top" style="display: flex;">Username:</Label>
          <TextBox inputId="user" v-model="user" placeholder="Username" iconCls="icon-man"
                   style="width: 60%; display: flex; "></TextBox>
        </div>
        <div style="display: flex;">
          <Label for="pass" align="top" style="display: flex;">Password:</Label>
          <PasswordBox inputId="pass" v-model="pass" placeholder="Password"
                       style="width: 60%; display: flex; "></PasswordBox>
        </div>

      </div>
      <div
          style="margin-bottom: 10px; display: flex; flex-direction: row; justify-content: space-between;; align-items: center;">
        <div>
          <div style="margin-bottom: 10px; display: flex; flex-direction: row; justify-content: space-between;">
            <div style="display: flex;">
              <Label for="database" align="top" style="display: flex;">DB Name:</Label>
              <TextBox inputId="database" v-model="dbName" placeholder="my.Database" iconCls="icon-database"
                       style="width: 150px; display: flex; "></TextBox>
            </div>

          </div>
          <div style="display: flex;flex-direction: row;">
            <div style="display: flex;flex-direction: row;">
              <Label for="instance" align="top" style="display: flex;">Instance:</Label>
              <NumberBox inputId="instance" :max=100 :min=1 v-model=instance iconCls="icon-instance"
                         iconAlign="left"
                         style="width: 95px; display: flex; "></NumberBox>
            </div>
            <div style="display: flex; margin-left: 10px;">
              <Label for="buffer" align="top" style="display: flex;">Buffer:</Label>
              <NumberBox inputId="buffer" :max=1000 :min=1 v-model=buffer iconCls="icon-buffer"
                         iconAlign="left"
                         style="width: 95px; display: flex; "></NumberBox>
            </div>
          </div>
        </div>
        <div style="width: 40%; display: flex;  justify-content: space-around;">
          <LinkButton :iconCls="testStatus" size="large" @click="testConnection" iconAlign="top"
                      style="display: flex;">Test Connection
          </LinkButton>
        </div>
      </div>
    </div>
    <div style="display: flex;justify-content: space-around;
    background: url(src/images/window-title.gif) repeat-x;
    background-size: auto 100%;
    margin-top: 10px;
    height: 30px;
    padding-bottom: 5px;">
      <button class="button-dark" tabindex="11" style="color: mediumspringgreen;"
              @click="configOk">OK
      </button>
      <button class="button-dark" tabindex="12" style="color: gold;"
              @click="$emit('cancel')">Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/event-bus";

export default {
  name: "mxSqlserverConfig",
  data() {
    return {
      cConfig: this.cell.getData().config,
      ip: null,
      port: null,
      dbName: null,
      user: null,
      pass: null,
      buffer: 1,
      instance: 1,
      testStatus: "db-unknown", //"ok", "failed"
      eb: null
    }
  },
  props: ['store', 'cell'],
  methods: {
    configOk(evt) {
      /*let editor = this.$store.getters.getEditor;
      let graph = editor.graph;
      let model = graph.getModel();*/
      let data = this.cell.getData();
      data.config = {};
      data.config.ip = this.ip || "172.0.0.1";
      data.config.port = this.port || 1433;
      data.config.dbName = this.dbName;
      data.config.user = this.user;
      data.config.pass = this.pass;
      data.config.buffer = this.buffer;
      data.config.instance = this.instance;
      this.cell.setData(data);
      this.$emit('ok');
    },
    testConnection() {
      this.testStatus = "db-process pulsating-circle";
      let config = {};
      config.ip = this.ip || '172.0.0.1';
      config.ip = config.ip.trim();
      let editor = this.store.getters.getEditor;
      let graph = editor.graph;
      let model = graph.getModel();
      if (model.getRoot().getData() && model.getRoot().getData().trim().length > 1) {
        let dataSources = JSON.parse(model.getRoot().getData());
        if (config.ip.trim().startsWith('#') && dataSources[ config.ip.trim().substring(1) ])
          config = { ...config, ...dataSources[ config.ip.trim().substring(1) ] }
      }
      config.port = this.port || config.port;
      config.dbName = this.dbName || config.dbName;
      config.user = this.user || config.user;
      config.pass = this.pass || config.pass;
      this.eb = this.store.getters.getEb;
      let headers = {
        "cmd": "TEST-CONNECTION",
        "id": this.cell.getId(),
        "type": this.cell.getType(),
        "dbType": this.cell.getData().dbType
      };
      this.eb.send('mx.vx.test.sqlserver', config, headers, (err, res) => {
        if (err == null) {
          this.testStatus = 'db-' + JSON.parse(res.body).testStatus.toLowerCase();
        } else {
          mxLog.warn(JSON.stringify(err));
          this.testStatus = "db-failed";
        }
      });
    },
    uuidv4: function() {
      return ( [1e7] + -1e3 + -4e3 + -8e3 + -1e11 ).replace(/[018]/g, c =>
          ( c ^ crypto.getRandomValues(new Uint8Array(1))[ 0 ] & 15 >> c / 4 ).toString(16)
      )
    },
    subscribeTestConnection() {
      EventBus.$on(this.uuid, msg => {
        this.testStatus = 'db-' + msg.testStatus.toLowerCase()
      });
    }
  },
  computed: {},
  mounted() {
    let data = this.cell.getData();
    if (data.config.ip)
      this.ip = data.config.ip;
    if (data.config.port)
      this.port = data.config.port;
    if (data.config.dbName)
      this.dbName = data.config.dbName;
    if (data.config.user)
      this.user = data.config.user;
    if (data.config.pass)
      this.pass = data.config.pass;
    if (data.config.buffer)
      this.buffer = data.config.buffer;
    if (data.config.instance)
      this.instance = data.config.instance;
    this.subscribeTestConnection();
  }
}
</script>

<style scoped>
* {
  user-select: none;
}

.f-full {
  flex-direction: column;
  display: flex;
  margin: 10px 10px 0 10px;
}

.button-dark {
  background: url(/src/images/button-dark.gif) repeat-x;
  width: 60px;
  margin-top: 5px;
}

.general-ux {
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.flex-row {
  padding: 5px;
  display: flex;
  flex-direction: row;
}

label {
  padding-right: 5px;
}
</style>