<template>
  <div>

    <textarea ref="exportForm">{{getPrettyGraphXml()}}</textarea>
    <mx-button style="margin-left: 5px;" :editor="editor" action="saveXml" label="Download"
               image="/editors/images/save.gif"></mx-button>
    <span style="float: right; padding-right: 15px;">
      <input type="checkbox" id="zip" v-model="checked">
      <label for="zip"> ZIP </label>
    </span>

  </div>
</template>

<script>
import mxButton from '@/components/buttons/mxComponents/mxButton.vue';
import JSZip from "jszip";

export default {
  name: "exportForm",
  components: {
    mxButton
  },
  data: function() {
    return {
      editor: this.store.getters.getEditor,
      checked: false
    }
  },
  props: ['store'],
  created() {
    let that = this;
    this.editor.addAction('saveXml', function(editor, cell) {
      that.saveToFile(that.$refs.exportForm.value, that.editor.graph.getModel().getCell(0).name || that.editor.graph.getModel().getCell(0).uid);
      //mxUtils.alert("test " + cell);
    })
  },
  methods: {
    getPrettyGraphXml: function() {
      //let enc = new mxCodec(mxUtils.createXmlDocument(),["vueComponent"]);
      //mxCodecRegistry.getCodec(mxCell).exclude.push('vueComponent');
      //enc.exclude.push("vueComponent").push("dataset");
      let enc = new mxCodec(mxUtils.createXmlDocument());
      let node = enc.encode(this.editor.graph.getModel());
      return mxUtils.getPrettyXml(node);
    },
    saveToFile: function(jsonData, filename) {
      if (this.checked) {
        let zip = new JSZip();
        let blob = new Blob([jsonData], { type: 'application/zip;charset=utf-8;' });
        zip.file(filename + '.xml', blob);
        zip.generateAsync({ type: "blob", compression: "DEFLATE" })
            .then(function(content) {
              if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(content, filename)
              } else {
                let link = document.createElement('a');
                if (link.download !== undefined) { // feature detection
                  // Browsers that support HTML5 download attribute
                  let url = URL.createObjectURL(content);
                  link.setAttribute('href', url);
                  link.setAttribute('download', filename);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }
            });
      } else {
        let blob = new Blob([ jsonData ], { type: 'text/xml;charset=utf-8;' });
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
      }
    }
  },
  mounted() {
    let editor = this.editor;
    let that = this;
    // Defines a new export action
    /*this.editor.addAction('saveXml', function(editor, cell) {
      let graph = editor.graph;
//        that.showModalWindow(graph, 'XML', textarea, 410, 440);
    });*/
  }
}
</script>

<style scoped>
textarea {
  width: 408px;
  height: 385px;
  border-color: #8C8C8C;
  border-style: solid;
  border-width: 1px;
  font-family: Arial;
  font-size: 8pt;
  padding: 1px;
  resize: none;
}
</style>