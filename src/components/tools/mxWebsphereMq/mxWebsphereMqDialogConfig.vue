<template>
  <div ref="configForm" style="display: flex; flex-direction: column; justify-content: space-between;">
    <div class="f-full">
      <div style="display: flex; flex-direction: row;">
        <div class="general-ux">
          <div class="flex-row">
            <Label for="ip" align="top" style="">Mq IP:</Label>
            <TextBox inputId="ip" iconCls="icon-ip" placeholder="172.0.0.1" v-model="ip" :tabindex="1"
                     style="width:60%;"></TextBox>
          </div>
          <div class="flex-row">
            <Label for="manager" align="top" style="">Mq Manager:</Label>
            <TextBox inputId="manager" v-model="qm" placeholder="my.Queue.Manager" iconCls="icon-qm" :tabindex="3"
                     style="width:70%;"></TextBox>
          </div>
          <div class="flex-row">
            <Label for="user" align="top" style="">Username:</Label>
            <TextBox inputId="user" v-model="user" placeholder="Username" iconCls="icon-man" :tabindex="5"
                     style="width:60%;"></TextBox>
          </div>
        </div>

        <div class="general-ux">
          <div class="flex-row">
            <Label for="port" align="top" style="">Port:</Label>
            <NumberBox inputId="port" placeholder=1414 v-model="port" :max=65536 :min=0 iconCls="icon-port" :tabindex="2"
                       iconAlign="left" style="width:50%;"></NumberBox>
          </div>
          <div class="flex-row">
            <Label for="queue" align="top" style="">Queue:</Label>
            <TextBox inputId="queue" v-model="qName" placeholder="TestQueue" iconCls="icon-queue" :tabindex="4"
                     style="width:80%; display: flex;"></TextBox>
          </div>
          <div class="flex-row">
            <!--<TextBox inputId="user" v-model="user" placeholder="Username" iconCls="icon-user" style="width:30%; display: flex;"></TextBox>-->
            <Label for="pass" align="top" style="">Password:</Label>
            <PasswordBox inputId="pass" v-model="pass" placeholder="Password" :tabindex="6"
                         style="width:60%;"></PasswordBox>
          </div>
        </div>
      </div>
      <div style="margin-bottom: 0px;display: flex;">
        <div style="display: flex; flex-direction: column; width: 70%;">
          <div class="flex-row">
            <Label for="channel" align="top" style="">Channel:</Label>
            <TextBox inputId="queue" v-model="channelName" placeholder="SYSTEM.DEF.SVRCONN" iconCls="icon-channel"
                     :tabindex="7" style="width:70%;"></TextBox>
          </div>
          <div style="display: flex; flex-direction: row;">
            <div class="flex-row">
              <Label for="instance" align="top" style="">Instances:</Label>
              <NumberBox inputId="instance" :max=100 :min=1 v-model=instance iconCls="icon-instance" iconAlign="left"
                         :tabindex="8" style="width:50%;"></NumberBox>
            </div>
            <div class="flex-row">
              <Label for="cp" align="top" style="">Code Page:</Label>
              <TextBox inputId="cp" v-model="codepage" placeholder="1098"
                       iconCls="icon-codepage" :tabindex="9" style="width:45%;"></TextBox>
            </div>
          </div>
        </div>

        <LinkButton :iconCls="testStatus" size="large" @click="testConnection" iconAlign="top"
                    style="display: flex;" :tabindex="10">Test Connection
        </LinkButton>
      </div>
    </div>
    <div style="display: flex;justify-content: space-around;
    background: url(src/images/window-title.gif) repeat-x;
    background-size: auto 100%;
    margin-top: 10px;
    height: 30px;
    padding-bottom: 5px;">
      <button class="button-dark" :tabindex="11" style="color: mediumspringgreen;"
              @click="configOk">OK
      </button>
      <button class="button-dark" :tabindex="12" style="color: gold;"
              @click="$emit('cancel')">Cancel
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mxWebsphereMqDialogConfig',
  props: ['store', 'config'],
  data() {
    return {
      ip: this.config.ip,
      port: this.config.port,
      qm: this.config.qm,
      qName: this.config.qName,
      user: this.config.user,
      pass: this.config.pass,
      channelName: this.config.channelName,
      instance: this.config.instance || 1,
      codepage: this.config.codepage,
      testStatus: "unknown", //"ok", "failed"
    }
  },
  methods: {
    configOk: function() {
      let config = {};
      config.ip = this.ip != null ? this.ip.trim():null;
      config.port = this.port;
      config.qm = this.qm;
      config.qName = this.qName;
      config.user = this.user;
      config.pass = this.pass;
      config.channelName = this.channelName;
      config.instance = this.instance;
      config.codepage = this.codepage;
      this.$emit('ok', config);
    },
    testConnection() {
      this.testStatus = "process pulsating-circle";
      let config = {};
      config.ip = this.ip || '172.0.0.1';
      config.ip = config.ip.trim();
      let editor = this.store.getters.getEditor;
      let graph = editor.graph;
      let model = graph.getModel();
      if (model.getRoot().getData() && model.getRoot().getData().trim().length > 1) {
        let dataSources = JSON.parse(model.getRoot().getData());
        let dataSource = dataSources[ config.ip.substring(1) ];
        if (config.ip.startsWith('#') && dataSource) {
          config = {...dataSource };
        }
      }
      config.port = this.port || this.config.port || 1414;
      config.qm = this.qm || this.config.qm || 'TestQueue';
      config.qName = this.qName || this.config.qName || 'my.Queue.Manager';
      config.user = this.user || this.config.user || 'Username';
      config.pass = this.pass || this.config.pass || 'Password';
      config.channelName = this.channelName || this.config.channelName || 'SYSTEM.DEF.SVRCONN';
      config.instance = this.instance || this.config.instance || 1;
      config.codepage = this.codepage || this.config.codepage || '1098';
      this.eb = this.store.getters.getEb;
      let headers = {
        "cmd": "TEST-CONNECTION",
        //"id": this.config.id,
        //"type": this.config.type,
        //"uuid": this.uuid,
        //"graph_id": this.store.getters.getGraphId,
        //"graph_name": this.store.getters.getGraphName
      };
      this.eb.send('mx.vx.test.webspheremq', config, headers, (err, res) => {
        if (err == null) {
          this.testStatus = JSON.parse(res.body).testStatus.toLowerCase()
          mxLog.debug(JSON.stringify(res.headers));
        } else {
          this.testStatus = JSON.parse(err.message).testStatus.toLowerCase()
          mxLog.warn(JSON.stringify(err));
        }
      });
    },
  },
  mounted() {
  }
}
</script>
<style scoped>
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

label{
  padding-right: 5px;
}
</style>
