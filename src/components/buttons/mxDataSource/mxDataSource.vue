<template>
  <span>
  <div ref="dataSourceName">
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
              @click="nameOk($refs.dataSourceName.getElementsByTagName('input')[0])">OK ...</button>
      <button class="button-dark" style="color: gold;"
              @click="nameCancel($refs.dataSourceName.getElementsByTagName('input')[0])">Cancel</button>
    </div>
  </div>
  <div ref="dataSourceForm">
    <div ref="jsoneditor" style="height: 265px; margin: 2px 2px 0 0;">

    </div>
    <div style="display: flex;justify-content: space-around;">
      <button class="button-dark" style="color: mediumspringgreen;" @click="formOk">OK</button>
      <button class="button-dark" style="color: gold;" @click="formCancel">Cancel</button>
      <button class="button-dark" style="color: tomato;" @click="formDelete">Delete</button>
    </div>
  </div>
  </span>
</template>

<script>
import mxButton from '@/components/buttons/mxComponents/mxButton.vue';
import "jsoneditor/dist/jsoneditor.min.css";
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js';
import dataSourceTypes from "./dataSourceTypes";

export default {
  name: "mxDataSource",
  components: {
    mxButton
  },
  data: function() {
    return {
      nameType: "Free Type",
      dataSourceTypes: dataSourceTypes,
      editor: this.$store.getters.getEditor,
      wndName: null,
      wndForm: null,
      jsonEditor: null,
      background: null,
      name: ''
    }
  },
  methods: {
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
    nameOk: function(event) {
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
          if (this.wndName)
            this.wndName.hide();
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
    nameCancel: function(event) {
      if (event) {
        event.value = "";
      }
      this.nameType = "Free Type";
      this.wndName.hide();
      this.editor.graph.setEnabled(true);
      mxEffects.fadeOut(this.background, 50, true,
          10, 30, true);
    },
    formOk: function() {
      let dataSource = this.jsonEditor.get();
      this.jsonEditor.set({});
      this.jsonEditor.setMode('tree');
      let root = this.editor.graph.getModel().root;
      let data = JSON.parse(root.data) || {};
      data[ this.name ] = dataSource;
      root.setData(JSON.stringify({ ...data }));
      this.wndForm.hide();
      mxEffects.fadeOut(this.background, 50, true, 10, 30, true);
      this.editor.graph.setEnabled(true);
    },
    formCancel: function() {
      this.jsonEditor.set({});
      this.jsonEditor.setMode('tree');
      this.wndForm.hide();
      this.editor.graph.setEnabled(true);
      mxEffects.fadeOut(this.background, 50, true,
          10, 30, true);
    },
    formDelete: function() {
      this.jsonEditor.set({});
      this.jsonEditor.setMode('tree');
      let root = this.editor.graph.getModel().root;
      let data = JSON.parse(root.data) || {};
      delete data[ this.name ];
      root.setData(JSON.stringify({ ...data }));
      this.wndForm.hide();
      mxEffects.fadeOut(this.background, 50, true, 10, 30, true);
      this.editor.graph.setEnabled(true);
    },
    showModalWindow: function(graph, title, content, width, height, name) {

      if (this.wndName === null) {
        let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
        let y = Math.max(10, ( document.body.scrollHeight ||
            document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
        this.wndName = new mxWindow(title, content, x, y, width, height, false, true);
      }
      graph.setEnabled(false);
      graph.tooltipHandler.hide();
      this.wndName.setVisible(true);
    }
  },
  mounted() {
    let editor = this.editor;
    let that = this;
    that.jsonEditor = new JSONEditor(that.$refs.jsoneditor, {
      mode: 'tree',
      modes: ['tree', 'view', 'form', 'code', 'text']
    });
    //that.jsonEditor.set(that.data.setting);
    that.editor.addAction('dataSourceName', function(editor, name) {
      let graph = editor.graph;
      that.background = that.getBackground();
      document.body.appendChild(that.background);
      if (mxClient.IS_IE) {
        new mxDivResizer(that.background);
      }
      if (name)
        that.nameOk(name);
      else
        that.showModalWindow(graph, 'Enter an valid Name.', that.$refs[ 'dataSourceName' ], 410, 110, name);//that.$refs.exportForm.$el.firstElementChild
    });
  }
}
</script>

<style scoped>
.button-dark {
  background: url(/src/images/button-dark.gif) repeat-x;
  width: 60px;
  margin-top: 5px;
}
</style>