<template>
    <div ref="importForm">
        <textarea v-model="xmlGraph">
        </textarea>
        <upload @xmlGraph="xmlGraph = $event"></upload>
        <mx-button class="upload-form" style="margin-left: 5px;margin-top: 2px;" :editor="editor" action="loadXml" label="Ok"
                   image="/src/images/check.png"></mx-button>
    </div>
</template>

<script>
  import mxButton from '@/components/buttons/mxComponents/mxButton.vue';
  import upload from '@/components/buttons/mxActionGroup/mxImport/Upload.vue';
  import { EventBus } from '../../../../event-bus.js';
  export default {
    name: "importForm",
    components: {
      mxButton,
      upload
    },
    data: function() {
      return {
        editor: this.store.getters.getEditor,
        xmlGraph: ""
      }
    },
    props: [ 'store' ],
    created() {
      let that = this;
      this.editor.addAction('loadXml', function(editor, cell) {
        let xml = that.xmlGraph;
        let xmlDocument = mxUtils.parseXml(xml);
        if (xmlDocument.documentElement != null && xmlDocument.documentElement.nodeName == 'mxGraphModel') {
          let decoder = new mxCodec(xmlDocument);
          let node = xmlDocument.documentElement;
          let model = editor.graph.getModel();
          editor.windows.closeAll();
          let oldUid = model.getCell(0).uid.trim();
          decoder.decode(node, model);
          let uid = model.getCell(0).uid;
          if (uid.trim().length === 0){
            uid = oldUid;
            model.getCell(0).uid = uid;
          }
          let version = model.getCell(0).version;
          let name = model.getCell(0).name;
          let context = that.store;
          context.dispatch("setGraphId", uid);
          context.dispatch("setGraphStatus", null);
          context.dispatch("setVersion", version);
          context.dispatch("setGraphName", name);
          context.dispatch("setThroughputEnable", false);
        }
        that.$emit('wndClose');
      })
    },
    methods: {
      getPrettyGraphXml: function() {
        let enc = new mxCodec(mxUtils.createXmlDocument());
        let node = enc.encode(this.editor.graph.getModel());
        return mxUtils.getPrettyXml(node);
      }
    },
    mounted() {
      let editor = this.editor;
      let that = this;
      this.xmlGraph = this.getPrettyGraphXml();
      // Defines a new export action
      /*this.editor.addAction('saveXml', function(editor, cell) {
        let graph = editor.graph;
//        that.showModalWindow(graph, 'XML', textarea, 410, 440);
      });*/
    }
  }
</script>

<style>
    textarea {
        width: 408px;
        height: 300px;
        border-color: #8C8C8C;
        border-style: solid;
        border-width: 1px;
        font-family: Arial;
        font-size: 8pt;
        padding: 1px;
        resize: none;
    }
    .upload-form{
        font-size: 12pt !important;
    }
    .upload-form img{
        float: right;
        padding: 0 1px;
        margin-left: 3px;
    }
</style>